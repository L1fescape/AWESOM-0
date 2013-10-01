var moment = require('moment');

var notes = {};

module.exports = function(bot) {


  bot.respond(/^notes$/i, "notes - Display notes left for you", function(msg) {
    var response = "";
    var user = msg.from;
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
    var user = tokens.splice(0, 1).toString();
    if (!notes[user])
      notes[user] = [];
    notes[user].push({from: msg.from, time: new Date(), msg: tokens.join(" ")});
    var confirmations = [
      "Okie dokes!",
      "Done.",
      "Saved.",
      "Fine.",
      "Got it!"
    ];
    response = confirmations[Math.floor(Math.random()*confirmations.length)];
    bot.client.say(msg.channel, response);
  });


}
