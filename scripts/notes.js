var moment = require('moment');

var notes = {};

exports.match = /(note|notes)/
exports.command = function(from, message, channel, client) {
  console.log(message)
  var response = "";
  var tokens = message.split(" ")
  var command = tokens.splice(0, 1).toString()
  message = tokens.join(" ")

  if (command == "notes") {
    if (notes[from] && notes[from].length != 0) {
      for (var i = 0, j = notes[from].length; i < j; i++) {
        var note = notes[from][i];
        response += note.from + " @ " + moment(note.time).fromNow() + ": " + note.message + "\n";
      }
      notes[from] = [];
    }
    else {
      response = "No notes.";
    }
  }
  else if (command == "note") {
    var tokens = message.split(" ");
    var user = tokens.splice(0, 1).toString();
    if (!notes[user])
      notes[user] = [];
    notes[user].push({from: from, time: new Date(), message: tokens.join(" ")});
    var confirmations = [
      "Okie dokes!",
      "Done.",
      "Saved.",
      "Fine.",
    ];
    response = confirmations[Math.floor(Math.random()*confirmations.length)];
  }
  client.say(channel, response);
}
