var 
  // libraries
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request');

module.exports = function(bot) {


  bot.respond(/(pugme|pug me)/i, "pugme - Receive a pug", function(msg) {
    var url = 'http://pugme.herokuapp.com/random'
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var response = JSON.parse(body)['pug']
        bot.client.say(msg.channel, response);
      }
    })
  });


  bot.respond(/(pugbomb|pug bomb)( (\d+))?/i, function(msg) {
    var count = msg.match[3] || 5;
    var url = 'http://pugme.herokuapp.com/bomb?count=' + count
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var pugs = JSON.parse(body)['pugs']
        var response = "";
        for (var i = 0, j = pugs.length; i < j; i++) {
          response += pugs[i] + "\n";
        }
        bot.client.say(msg.channel, response);
      }
    })
  });


};
