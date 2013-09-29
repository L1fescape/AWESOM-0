var 
  // libraries
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request')

exports.match = /(pugme|pug me|pugbomb|pug bomb)/i
exports.command = function(from, message, channel, client) {
  if (/(pugme|pug me)/i.test(message)) {
    var url = 'http://pugme.herokuapp.com/random'
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var response = JSON.parse(body)['pug']
        client.say(channel, response);
      }
    })
  }
  else {
    var count = 20;
    var url = 'http://pugme.herokuapp.com/bomb?count=' + count
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var pugs = JSON.parse(body)['pugs']
        var response = "";
        for (var i = 0, j = pugs.length; i < j; i++) {
          response += pugs[i] + "\n";
        }
        client.say(channel, response);
      }
    })
  }
}
exports.usage = "pugme - Receive a pug"
