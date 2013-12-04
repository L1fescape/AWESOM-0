var moment = require('moment');

var notes = {};
var seenNotes = {};

module.exports = function(bot) {

  bot.userJoin(function(msg) {
    var user = msg.nick.toLowerCase();
    if (seenNotes[user] === false) {
      bot.client.say(msg.channel, msg.nick + ", you have notes!");
      seenNotes[user] = true;
    }
  });


  bot.hear(/.*/i, function(msg) {
    var user = msg.from.toLowerCase();
    if (seenNotes[user] === false) {
      bot.client.say(msg.channel, msg.from + ", you have notes!");
      seenNotes[user] = true;
    }
  });


  bot.respond(/^notes$/i, "notes - Display notes left for you", function(msg) {
    var response = "";
    var user = msg.from.toLowerCase();
    if (notes[user] && notes[user].length) {
      for (var i = 0, note; note = notes[user][i]; i++) {
        response += note.from + " @ " + moment(note.time).fromNow() + ": " + note.msg + "\n";
      }
      notes[user] = [];
    }
    else 
      response = "No new notes.";

    bot.client.say(msg.channel, response);
  });


  bot.respond(/^note (.*)?/i, "note <user> <message> - Leave a note for a user", function(msg) {
    var tokens = msg.match[1].split(" ");
    var user = tokens.splice(0, 1).toString().toLowerCase();
    if (typeof notes[user] === 'undefined')
      notes[user] = [];
    notes[user].push({from: msg.from, time: new Date(), msg: tokens.join(" ")});
    seenNotes[user] = false; 
    var confirmations = [
      "Okie dokes!",
      "Done.",
      "Saved.",
      "Got it!"
    ];
    response = confirmations[Math.floor(Math.random()*confirmations.length)];
    bot.client.say(msg.channel, response);
  });


}

