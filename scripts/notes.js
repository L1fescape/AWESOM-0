var moment = require('moment'),
    redis = require("redis"),
    client = redis.createClient();


module.exports = function(bot) {

  function addNote(user, note, callback) {
    getNotes(user, function(notes) {
      notes.notes.push(note);
      notes.seen = false;
      setNotes(user, notes);
      callback();
    });
  }

  function getNotes(user, callback) {
    client.get(user, function(err, notes) {
      try {
        notes = JSON.parse(notes);
      }
      catch (err) {
        notes = {
          seen: true,
          notes: []
        };
      }
      if (notes === null)
        notes = {
          seen: true,
          notes: []
        };
      setNotes(user, notes);

      callback(notes);
    });
  }

  function setNotes(user, notes) {
    notes = JSON.stringify(notes)
    client.set(user, notes, redis.print);
  }

  function checkSeenNotes(msg) {
    var user = (typeof msg.from !== 'undefined') ? msg.from.toLowerCase() : msg.nick.toLowerCase();
    getNotes(user, function(notes) {
      if (notes.seen === false) {
        bot.client.say(msg.channel, user + ", you have notes!");
        notes.seen = true;
      }

      setNotes(user, notes);
    });
  }

  bot.userJoin(checkSeenNotes);

  bot.hear(/.*/i, checkSeenNotes);


  bot.respond(/^notes$/i, "notes - Display notes left for you", function(msg) {
    var response = "";
    var user = msg.from.toLowerCase();
    getNotes(user, function(userNotes) {
      for (var i = 0; i < userNotes.notes.length; i++) {
        var note = userNotes.notes[i];
        response += note.from + " @ " + moment(note.time).fromNow() + ": " + note.msg + "\n";
      }
      userNotes.notes = [];
      
      if (!response)
        response = "No new notes.";
      
      userNotes.seen = true;

      setNotes(user, userNotes);

      bot.client.say(msg.channel, response);
    });
  });


  bot.respond(/^note (.*)?/i, "note <user> <message> - Leave a note for a user", function(msg) {
    var tokens = msg.match[1].split(" ");
    var user = tokens.splice(0, 1).toString().toLowerCase();
    var note = {from: msg.from, time: new Date(), msg: tokens.join(" ")};

    addNote(user, note, function() {
      var confirmations = [
        "Okie dokes!",
        "Done.",
        "Saved.",
        "Got it!"
      ];
      response = confirmations[Math.floor(Math.random()*confirmations.length)];
      bot.client.say(msg.channel, response);
    });
  });

};
