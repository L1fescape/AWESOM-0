var
  // libraries
  irc = require('irc'),
  chalk = require('chalk');


module.exports = Awesom0 = {
  init: function(settings) {
    // import settings
    try {
        this.settings = settings || require("./settings");
    }
    catch (error) {
        throw "Unable to load ./settings.js.  This file must exist and export AWESOM-0's\n"
            + "required settings.  You can probably just copy ./settings.js.sample";
    }

    // check if redis is enabled. If it is, attempt to connect to a redis server.
    this.redis = (typeof this.settings.redis !== 'undefined') ? this.settings.redis : false;
    console.log(this.settings.redis)
    if (this.redis) {
      var redis = require("redis"),
          maxAttempts = 3;
      this.redisClient = redis.createClient(
        this.settings.redisPort || 6379, 
        this.settings.redisHost || "127.0.0.1", 
        {
          "max_attempts": maxAttempts
        }
      );
      this.redisClient.on("error", function (err) {
        if (!maxAttempts--) {
          console.log(chalk.red("Error: Could not connect to redis server."), "Is redis running? Defaulting to temporary storage.");
          console.log(chalk.blue("Note:"), "If you don't want to use redis, you can disable in settings.js");
          this.redis = false;
        }
      }.bind(this));
    }

    // 
    this.triggers = {
      oncommand : [],
      onhear : [],
      onjoin : []
    };

    // loop through all scripts enabled in settings, importing them and storing them
    // in the commands array
    for (var i = 0, file; file = this.settings.commands[i]; i++) {
      try {
        require("./scripts/" + file)(this);
      }
      catch (err) {
        console.warn(err);
        console.warn(file + " does not appear to be a valid command");
      }
    }

    // determine whether or not we should be in debug mode
    this.debug = (typeof this.settings.debug !== 'undefined') ? this.settings.debug : false;

    // create a new client
    this.client = new irc.Client(this.settings.server, this.settings.botname, {
      channels: this.settings.channels,
      port: this.settings.port || 6667,
      autoConnect: !this.debug,
      showErrors: this.debug,
      userName: this.settings.userName || 'awesom0',
      realName: this.settings.realName || 'AWESOM-0'
    });

    // bind all events
    this.client.addListener('connect', this.onconnect.bind(this));
    this.client.addListener('kick', this.onkick.bind(this));
    this.client.addListener('message', this.onmessage.bind(this));
    this.client.addListener('join', this.onjoin.bind(this));
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
    if (typeof usage == 'function') {
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
    //console.log("Connected to", opt.server, "port", opt.port, "on channels", opt.channels, "as", opt.nick);
  },

  onjoin: function(channel, nick, message) {
    for (var i = 0, j = this.triggers.onjoin.length; i < j; i++) {
      this.triggers.onjoin[i]({channel: channel, nick: nick, message:message});
    }
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
    if (channel == this.settings.botname) {
      channel = from;
      this.checkCommands(from, channel, message);
    }

    // check if message is directed at our bot
    if (message.split(" ")[0].indexOf(this.settings.botname) > -1) {
      // remove the name of the bot from the message
      var tokens = message.split(" ")
      tokens.splice(0, 1)
      message = tokens.join(" ");
      this.checkCommands(from, channel, message);
    }

    this.checkListens(from, channel, message);
  },

  checkCommands: function(from, channel, message) {
    // commands
    for (var i = 0, match, j = this.triggers.oncommand.length; i < j; i++) {
      match = message.match(this.triggers.oncommand[i]['match']);
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
      match = message.match(this.triggers.onhear[i]['match']);
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
    console.log(chalk.red("Error: "), error);
  },

  // help is always returned as a private message to the user who issued the command
  printHelp: function(from) {
    var response = (typeof this.settings.help === 'undefined') ? "" : this.settings.help;
    response += "Here is a list of my available commands:\n";
    // loop through all commands and print their help, if it's been defined
    for (var i = 0, command; command = this.triggers.oncommand[i]; i++) {
      if (typeof command.usage !== 'undefined' && command.usage != null)
        response += command.usage + "\n";
    }
    response += "Note: Generally if a command has a bang (!) in front of it, the bot is listening for ";
    response += "for that string. The command doesn't need to have the botname before it.";

    this.client.say(from, response);
  },

  // simple key/value store for AWESOM-0 that uses redis if enabled or an
  // instance variable if it is not.
  db : {
    values: {},

    get: function(key, callback) {
      var self = Awesom0;
      if (self.redis) {
        self.redisClient.get(key, function(err, value) {
          try {
            value = JSON.parse(value);
          }
          catch (err) {
            value = {};
          }
          callback(value);
        });
      }
      else {
        callback(self.db.values[key]);
      }
    },

    set: function(key, value, callback) {
      var self = Awesom0;
      if (self.redis) {
        if (typeof value !== 'string')
          value = JSON.stringify(value);

        self.redisClient.set(key, value);
      }
      else {
        self.db.values[key] = value;
      }
    },
  }

};

// if calling awesom0.js directly this usually means we're running it from the command line
// and should therefore be initialized
// TODO: fix this. temporary fix until command line args are supported.
if (process.argv && process.argv.length > 1 && process.argv[1].indexOf("awesom0.js") > -1)
  Awesom0.init();
