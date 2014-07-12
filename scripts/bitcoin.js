var request = require('request');

module.exports = function(bot) {

  bot.hear(/!btc/i, '!btc - display current bitcoin price.', function(msg) {
    request('https://www.bitstamp.net/api/ticker/', function (error, response, body) {
      if( response.statusCode !== 200 ){
        bot.client.say(msg.channel, 'Unavailable');
      } else {
        var results = JSON.parse(body);
        if( results.last.length === 0 ){
          bot.client.say(msg.channel, 'Unavailable');
        } else {
          var price = results.last;
          bot.client.say(msg.channel, 'Bitstamp: ' + price + ' USD/BTC');
        }
      }
    });
  });
};
