var request = require('request'),
  limit = 10;

module.exports = function(bot) {

  bot.hear(/!u /i, '!u <term> - look something up on urban dictionary.', function(msg) {
    var term = msg.message.replace('!u ', ''),
      url = 'http://api.urbandictionary.com/v0/define?term=' + term;

    request(url, function (error, response, body) {
      var results = JSON.parse(body);
      if (results.list.length === 0){
        bot.client.say(msg.channel, 'No results for ' + term);
      } else {
        var definition = results.list[0].definition;
        definition = definition.split('\n').slice(0, limit).join('\n');
        var example = results.list[0].example;
        example = example.split('\n').slice(0, limit).join('\n');
        bot.client.say(msg.channel, definition + ((example) ? '\nExample: ' + results.list[0].example : ''));
      }
    });
  });

};
