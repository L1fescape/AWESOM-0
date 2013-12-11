module.exports = function(bot) {
  bot.hear(/\w+\+\+$|\w+--$/i, "<user>++ or <user>-- : Record karma", function(msg) {
    var person = msg.message.match(/\w+\+\+$|\w+--/)[0].replace(/\+\+$|--$/,"")

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

  });
};
