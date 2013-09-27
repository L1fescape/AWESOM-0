var 
  // libraries
  irc = require('irc'),
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request'),

  // import settings
  settings = require("./settings"),

  // irc variables
  channels = settings.channels,
  botname = settings.botname,
  server = settings.server,

  // debug
  debug = settings.debug;


var Awesom0 = {
  commands: [],
  client: {},
  
  init: function() {
    // array of commands
    this.commands = [];
    // create a new client 
    this.client = new irc.Client(server, botname, {
      channels: channels,
    });
    // loop through all scripts enabled in settings, import them and storing them
    // in the commands array
    for (var i = 0, j = settings.commands.length; i < j; i++) {
      var file = settings.commands[i];
      var script = require("./scripts/" + file);
      this.commands.push({ match: script.match, command: script.command });
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
    console.log(from + ' => ' + channel + ': ' + message);
    // check if message is directed at our bot
    if (message.split(" ")[0].indexOf(botname) == -1)
      return;
    // process the message
    this.processMessage(from, channel, message);
  },

  onpm: function(from, message) {
    console.log(from + ' => pm: ' + message);
    // process the message
    this.processMessage(from, from, message);
  },

  processMessage: function(from, channel, message) {
    // remove the name of the bot from the message
    var tokens = message.split(" ")
    tokens.splice(0, 1)
    message = tokens.join(" ")
    // loop through all commands checking if there's a match
    for (var i = 0, j = this.commands.length; i < j; i++) {
      if (this.commands[i].match.test(message)) {
        this.commands[i].command(from, message, channel, this.client);
      }
    }
  },

  onerror: function(error) {
    console.log("Error:", error);
  }
};

// create and start the bot
Awesom0.init();
