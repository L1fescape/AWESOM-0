module.exports = function(bot) {
  bot.hear(/\w+\+\+$|\w+--$/i, "<user>++ | <user>-- - increment or decrement a user's karma.", function(msg) {
    var person = msg.message.match(/\w+\+\+$|\w+--/)[0].replace(/\+\+$|--$/,"")
    
    if (person != msg.from) {

      bot.db.get("karma " + person, function(karma) {
        if (!karma)
          karma = 0;
        if (/\w+\+\+$/.test(msg.message))
          ++karma
        else
          --karma
        bot.db.set("karma " + person, karma);

        var response = person + " ⇒ " + karma;
        bot.client.say(msg.channel, response);
      });
    }

    else {
      bot.client.say(msg.channel, "Sorry, you can't give yourself karma.");
    }

  });



  bot.respond(/^karma$/i, "karma - retreive karma level.", function(msg) {

    bot.db.get("karma " + msg.from, function(karma) {
      if (!karma)
        karma = 0;

      var response = msg.from + " ⇒ " + karma;
      bot.client.say(msg.channel, response);
    });
  });
};
