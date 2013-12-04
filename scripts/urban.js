var request = require('request');

module.exports = function(bot) {

  bot.hear(/!u /i, function(msg) {
    var term = msg.message.replace("!u ", "");
    var url = "http://api.urbandictionary.com/v0/define?term=" + term
    request(url, function (error, response, body) {
      var results = JSON.parse(body);
      if (results["list"].length == 0)
        bot.client.say(msg.channel, "No results for " + term);
      else
        bot.client.say(msg.channel, results["list"][0]["definition"]);
    });
  });

}
