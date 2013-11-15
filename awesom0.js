var 
  // libraries
  irc = require('irc'),
  chalk = require('chalk'),

  // import settings
  settings = require("./settings");


var Awesom0 = {
  init: function() {
    // determine whether or not we should be in debug mode
    this.debug = (typeof settings.debug !== 'undefined') ? settings.debug : false;
    // array to store commands
    this.commands = [];
    // array to store things to listen for
    this.sounds = [];
    // loop through all scripts enabled in settings, importing them and storing them
    // in the commands array
    for (var i = 0, file; file = settings.commands[i]; i++) {
      try {
        require("./scripts/" + file)(this);
      }
      catch (err) {
        console.warn(err);
        console.warn(file + " does not appear to be a valid command");
      }
    }
    // create a new client 
    this.client = new irc.Client(settings.server, settings.botname, {
      channels: settings.channels,
      port: settings.port || 6667,
      autoConnect: !this.debug,
      showErrors: this.debug,
      userName: settings.userName || 'awesom0',
      realName: settings.realName || 'AWESOM-0'
    });
    // bind all events
    this.client.addListener('connect', this.onconnect.bind(this));
    this.client.addListener('kick', this.onkick.bind(this));
    this.client.addListener('message', this.onmessage.bind(this));
    this.client.addListener('error', this.onerror.bind(this));
    // if in debug mode, define our own say function and a function that makes
    // testing commands easier
    if (this.debug) {
      this.client = {
        say: function(channel, msg) {
          console.log(chalk.green("Response (via " + channel + "):"), msg);
        },
        opt : this.client.opt
      };
      this.testMsg = function(msg) {
        this.onmessage("TestUser", "#test", msg);
      }
    }
  },

  // scripts call this method to register their commands, callbacks, and usage
  respond: function(match, usage, callback) {
    // if usage is a function, then it's probably supposed to be the callback
    // and there isn't a usage defined
    if (typeof usage == 'function') {
      callback = usage;
      usage = null;
    }
    this.commands.push({ match: match, command: callback, usage: usage });
  },

  hear: function(match, usage, callback) {
    if (typeof usage == 'function') {
      callback = usage;
      usage = null;
    }
    this.sounds.push({ match: match, command: callback, usage: usage });
  },

  onconnect: function() {
    var opt = this.client.opt;
    //console.log("Connected to", opt.server, "port", opt.port, "on channels", opt.channels, "as", opt.nick);
  },

  onkick: function(channel, kickedUser, kickedBy) {
    // wait a second so the bot can reconnect before sending response
    setTimeout(function() {
      this.client.say(channel, "Fuck you " + kickedBy + "!");
    }.bind(this), 1000);
  },

  onmessage: function(from, channel, message) {
    if (this.debug)
      console.log(chalk.yellow('Message (' + from + ' via ' + channel + '):'), message);

    // check if pm. if so, set channel to nick sending the pm
    if (channel == settings.botname) {
      channel = from;
    }

    if (/^help$/i.test(message)) {
      this.printHelp(channel, from);
      return;
    }
    // check if message is directed at our bot
    if (message.split(" ")[0].indexOf(settings.botname) > -1) {
      // remove the name of the bot from the message
      var tokens = message.split(" ")
      tokens.splice(0, 1)
      message = tokens.join(" ")

      // loop through all commands checking if there's a match
      for (var i = 0, match, j = this.commands.length; i < j; i++) {
        match = message.match(this.commands[i]['match']);
        if (match && match.length) {
          var msg = {
            match: match,
            from: from,
            message: message,
            channel: channel
          };
          this.commands[i].command(msg);
        }
      }
    }
    else {
      // loop through all commands checking if there's a match
      for (var i = 0, match, j = this.sounds.length; i < j; i++) {
        match = message.match(this.sounds[i]['match']);
        if (match && match.length) {
          var msg = {
            match: match,
            from: from,
            message: message,
            channel: channel
          };
          this.sounds[i].command(msg);
        }
      }
    }
  },

  onerror: function(error) {
    console.log(chalk.red("Error: "), error);
  },

  printHelp: function(channel, from) {
    var response = (typeof settings.help === 'undefined') ? "" : settings.help;
    response += "Here is a list of my available commands:\n";
    // loop through all commands and print their help, if it's been defined
    for (var i = 0, command; command = this.commands[i]; i++) {
      if (typeof command.usage !== 'undefined' && command.usage != null)
        response += command.usage + "\n";
    }

    this.client.say(from, response);
  }

};

// create and start the bot
Awesom0.init();

module.exports = Awesom0;
