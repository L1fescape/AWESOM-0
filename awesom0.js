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
      this.commands.push({ regx: script.regx, command: script.command });
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
    // split the message into an array
    var tokens = message.split(" ");
    // if the array doesn't contain a command, ignore it
    if (tokens.length <= 1)
      return;
    // remove the name of the bot
    tokens.splice(0, 1)
    // grab the command and remove it from the list of tokens
    var command = tokens.splice(0, 1).toString();
    // save everything after the command
    message = tokens.join(" ")
    // loop through all commands checking if there's a match
    for (var i = 0, j = this.commands.length; i < j; i++) {
      if (this.commands[i].regx.test(command)) {
        this.commands[i].command(from, command, message, channel, this.client);
      }
    }
  },

  onpm: function(from, message) {
    console.log(from + ' => pm: ' + message);
    // split the message into an array
    var tokens = message.split(" ");
    // grab the issued command
    var command = tokens.splice(0, 1).toString();
    // save everything after the command
    message = tokens.join(" ");
    // loop through all commands checking if there's a match
    for (var i = 0, j = this.commands.length; i < j; i++) {
      if (this.commands[i].regx.test(command))
        this.commands[i].command(from, command, message, from, this.client);
    }
  },

  onerror: function(error) {
    console.log("Error:", error);
  }
};

// create and start the bot
Awesom0.init();
