var request = require('request');

module.exports = function(bot) {

  bot.hear(/!btc/i, "!btc - display current bitcoin price.", function(msg) {
    request("https://btc-e.com/api/2/btc_usd/ticker", function (error, response, body) {
      var results = JSON.parse(body);
      if (results["ticker"].length == 0)
        bot.client.say(msg.channel, "Unavailable");
      else {
        var price = results["ticker"]["avg"];
        bot.client.say(msg.channel, "BTC-E: " + price + " USD/BTC");
      }
    });
    request("https://www.bitstamp.net/api/ticker/", function (error, response, body) {
      var results = JSON.parse(body);
      if (results["last"].length == 0)
        bot.client.say(msg.channel, "Unavailable");
      else {
        var price = results["last"];
        bot.client.say(msg.channel, "Bitstamp: " + price + " USD/BTC");
      }
    });
  });

}
