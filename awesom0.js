var 
  // libraries
  irc = require('irc'),

  // import settings
  settings = require("./settings"),

  // debug
  debug = settings.debug;


var Awesom0 = {
  init: function() {
    // array to store commands
    this.commands = [];
    // create a new client 
    this.client = new irc.Client(settings.server, settings.botname, {
      channels: settings.channels,
    });
    // loop through all scripts enabled in settings, import them and storing them
    // in the commands array
    for (var i = 0, file, script; file = settings.commands[i]; i++) {
      script = require("./scripts/" + file);
      this.commands.push({ match: script.match, command: script.command, usage: script.usage });
    }
    // bind all events
    this.client.addListener('connect', this.onconnect.bind(this));
    this.client.addListener('kick', this.onkick.bind(this));
    this.client.addListener('message', this.onmessage.bind(this));
    this.client.addListener('pm', this.onpm.bind(this));
    this.client.addListener('error', this.onerror.bind(this));
  },

  onconnect: function() {
    console.log("connect");
  },

  onkick: function(channel, kickedUser, kickedBy) {
    // wait a second so the bot can reconnect before sending response
    setTimeout(function() {
      Awesom0.client.say(channel, "Fuck you " + kickedBy + "!");
    }, 1000);
  },

  onmessage: function(from, channel, message) {
    if (debug)
      console.log(from + ' => ' + channel + ': ' + message);
    // check if message is directed at our bot
    if (message.split(" ")[0].indexOf(settings.botname) == -1)
      return;
    // remove the name of the bot from the message
    var tokens = message.split(" ")
    tokens.splice(0, 1)
    message = tokens.join(" ")
    // process the message
    this.processMessage(from, channel, message);
  },

  onpm: function(from, message) {
    if (debug)
      console.log(from + ' => pm: ' + message);
    // process the message
    this.processMessage(from, from, message);
  },

  processMessage: function(from, channel, message) {
    if (/^help$/i.test(message)) {
      this.printHelp(channel);
      return;
    }
    // loop through all commands checking if there's a match
    for (var i = 0, j = this.commands.length; i < j; i++) {
      if (this.commands[i].match.test(message)) {
        this.commands[i].command(from, message, channel, this.client);
      }
    }
  },

  onerror: function(error) {
    console.log("Error:", error);
  },

  printHelp: function(channel) {
    var response = (typeof settings.help === 'undefined') ? "" : settings.help;
    response += "Here is a list of my available commands:\n";
    // loop through all commands and print their help
    for (var i = 0, j = this.commands.length; i < j; i++) {
      response += this.commands[i].usage + "\n";
    }

    this.client.say(channel, response);
  }

};

// create and start the bot
Awesom0.init();
