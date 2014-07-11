'use strict';

var irc = require('irc'),
  chalk = require('chalk'),
  db = require('./db'),
  _ = require('lodash'),
  Awesom0;


module.exports = Awesom0 = {

  settings : {},
  client : {},

  // setup namespaces for different event types
  triggers : {
    oncommand : [],
    onhear : [],
    onjoin : []
  },

  init: function(settings) {
    // import settings
    try {
      this.settings = settings || require('./settings');
    }
    catch (error) {
      throw 'Unable to load ./settings.js.';
    }

    // setup db
    this.db = db(this);
    // determine whether or not we should be in debug mode
    this.debug = !!this.settings.debug;
    this.debugREPL = !!this.settings.debugREPL; // this is set in `debug.js`
    this.autostart = typeof this.settings.autostart !== 'undefined' ? this.settings.autostart : true;

    // loop through all scripts enabled in settings and import them
    _.each(this.settings.commands, function(command){
      try {
        if (this.debug) {
          process.stdout.write(chalk.blue('Loading script:') + ' ' + command + ' ' + chalk.blue('...'));
        }
        require('./scripts/' + command)(this);
        process.stdout.write(chalk.blue(' done') + '\n');
      }
      catch (err) {
        if (this.debug) {
          process.stdout.write(chalk.red(' error') + '\n');
          console.warn(err);
        }
      }
    }, this);

    if (this.autostart){
      this.start();
    }

    return this;
  },

  start : function(){
    // create a new client
    if (this.debugREPL){
      // if we are debugging a script via repl, define our own say function and
      // a function that makes testing commands easier
      this.client = {
        say: function(channel, msg) {
          console.log(chalk.green('Response (via ' + channel + '):'), msg);
        },
        opt : this.client.opt
      };
      this.testMsg = function(msg) {
        this.onmessage('TestUser', '#test', msg);
      };
    } else {
      // connect to the irc server
      this.client = new irc.Client(this.settings.server, this.settings.botname, {
        channels: this.settings.channels,
        port: this.settings.port || 6667,
        showErrors: this.debug,
        userName: this.settings.userName || 'awesom0',
        realName: this.settings.realName || 'AWESOM-0'
      });

      // bind all events
      this.client.addListener('connect', _.bind(this.onconnect, this));
      this.client.addListener('message', _.bind(this.onmessage, this));
      this.client.addListener('join', _.bind(this.onjoin, this));
      this.client.addListener('error', _.bind(this.onerror, this));
    }

    return this;
  },

  // scripts call this method to register their commands, callbacks, and usage
  respond: function(match, usage, callback) {
    // if usage is a function, then it's probably supposed to be the callback
    // and there isn't a usage defined
    if (typeof usage == 'function') {
      callback = usage;
      usage = null;
    }
    this.triggers.oncommand.push({ match: match, command: callback, usage: usage });
  },

  hear: function(match, usage, callback) {
    if (_.isFunction(usage)) {
      callback = usage;
      usage = null;
    }
    this.triggers.onhear.push({ match: match, command: callback, usage: usage });
  },

  userJoin: function(callback) {
    this.triggers.onjoin.push(callback);
  },

  onconnect: function() {
    var opt = this.client.opt;
    if( this.debug ){
      console.log('Connected to', opt.server, 'port', opt.port, 'on channels', opt.channels, 'as', opt.nick);
    }
  },

  onjoin: function(channel, nick, message) {
    _.each(this.triggers.onjoin, function(trigger){
      trigger({channel: channel, nick: nick, message:message});
    });
  },

  onmessage: function(from, channel, message) {
    if (this.debug)
      console.log(chalk.yellow('Message (' + from + ' via ' + channel + '):'), message);

    // check if pm. if so, set channel to nick sending the pm
    if (channel == this.settings.botname) {
      channel = from;
      this.checkCommands(from, channel, message);
    }

    // check if message is directed at our bot
    if (message.split(' ')[0].indexOf(this.settings.botname) > -1) {
      // remove the name of the bot from the message
      var tokens = message.split(' ');
      tokens.splice(0, 1);
      message = tokens.join(' ');
      this.checkCommands(from, channel, message);
    }

    this.checkListens(from, channel, message);
  },

  checkCommands: function(from, channel, message) {
    // commands
    for (var i = 0, match, j = this.triggers.oncommand.length; i < j; i++) {
      match = message.match(this.triggers.oncommand[i].match);
      if (match && match.length) {
        var msg = {
          match: match,
          from: from,
          message: message,
          channel: channel
        };
        this.triggers.oncommand[i].command(msg);
      }
    }
  },

  checkListens: function(from, channel, message) {
    // listen
    for (var i = 0, match, j = this.triggers.onhear.length; i < j; i++) {
      match = message.match(this.triggers.onhear[i].match);
      if (match && match.length) {
        var msg = {
          match: match,
          from: from,
          message: message,
          channel: channel
        };
        this.triggers.onhear[i].command(msg);
      }
    }
  },

  onerror: function(error) {
    console.log(chalk.red('Error: '), error);
  },

  // help is always returned as a private message to the user who issued the command
  printHelp: function(from) {
    var response = (typeof this.settings.help === 'undefined') ? '' : this.settings.help;
    response += 'Here is a list of my available commands:\n';
    // loop through all commands and print their help, if it's been defined
    _.each(this.triggers.oncommand, function(command){
      if( !_.isEmpty(command.usage) ){
        response += command.usage + '\n';
      }
    });
    response += 'Note: Generally if a command has a bang (!) in front of it, the bot is listening for ';
    response += 'for that string. The command doesn\'t need to have the botname before it.';

    this.client.say(from, response);
  }
};

// if script is called directly, initialize the bot
if(require.main === module){
    Awesom0.init();
}
