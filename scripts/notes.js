var moment = require('moment'),
    _ = require('underscore');


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
    bot.store.get("notes " + user, function(notes) {
      if (!notes || _.isEmpty(notes))
        notes = {
          seen: true,
          notes: []
        };

      setNotes(user, notes);

      callback(notes);
    });
  };

  function setNotes(user, notes) {
    bot.store.set("notes " + user, notes);
  }

  bot.userJoin(function(msg) {
    var user = (typeof msg.from !== 'undefined') ? msg.from.toLowerCase() : msg.nick.toLowerCase();
    getNotes(user, function(notes) {
      if (notes.seen === false) {
        bot.client.say(msg.channel, user + ", you have notes!");
        notes.seen = true;
      }

      setNotes(user, notes);
    });
  });

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
