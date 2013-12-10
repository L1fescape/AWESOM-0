var request = require('request');

module.exports = function(bot) {

  bot.hear(/!btc/i, function(msg) {
    var url = "https://btc-e.com/api/2/btc_usd/ticker"
    request(url, function (error, response, body) {
      var results = JSON.parse(body);
      if (results["ticker"].length == 0)
        bot.client.say(msg.channel, "Unavailable");
      else {
        var price = results["ticker"]["avg"];
        bot.client.say(msg.channel, price + " USD/BTC");
      }
    });
  });

}
