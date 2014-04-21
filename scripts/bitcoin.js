var request = require('request');

module.exports = function(bot) {

  bot.hear(/!btc/i, "!btc - display current bitcoin price.", function(msg) {
    request("https://blockchain.info/ticker", function (error, response, body) {
      var results = JSON.parse(body);
      if (results["USD"].length == 0)
        bot.client.say(msg.channel, "Unavailable");
      else {
        var price = results["USD"]["15m"];
        bot.client.say(msg.channel, "blockchain.info: " + price + " USD/BTC");
      }
    });
    request("http://btc.blockr.io/api/v1/exchangerate/current", function (error, response, body) {
      var results = JSON.parse(body);
      if (results["status"] != "success")
        bot.client.say(msg.channel, "Unavailable");
      else {
        var price = 1 / results["data"]["rates"]["BTC"];
        bot.client.say(msg.channel, "Bitstamp: " + price + " USD/BTC");
      }
    });
  });

}
