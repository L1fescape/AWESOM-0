var _ = require('lodash');

module.exports = function(bot) {

  bot.respond(/^quotes/i, 'quotes [<user>] - retrieve all quotes or a specific user\'s quotes', function(msg) {
    var response = '',
      notesForUser = msg.message.split(' ')[1];

    bot.db.get('quotes', function(quotes) {
      if (!quotes) {
        quotes = {};
      }

      if (notesForUser) {
        if (typeof quotes[notesForUser] === 'undefined' || quotes[notesForUser].length === 0) {
          // if there are no quotes for a user
          response = 'There are no quotes for this user.';
        } else {
          // else print all that user's quotes
          _.each(quotes[notesForUser], function(quote){
            response += quote + '\n';
          });
        }
      }

      // else get all quotes for all users
      else {
        _.each(quotes, function(user) {
          if (quotes[user].length) {
            response += user + '\'s quotes: \n';
            _.each(quotes[user], function(quote){
              response += quote + '\n';
            });
          }
        });
      }

      bot.client.say(msg.channel, response);
    });
  });


  bot.respond(/^(remember|quote) \w+/i, 'quote <user> <quote> - remember/retrieve quotes', function(msg) {
    var response = '',
      text = msg.message.replace(/^(remember|quote)\ /, '').split(' ');

    bot.db.get('quotes', function(quotes) {
      if( !quotes ){
        quotes = {};
      }

      if (text.length > 1) {
        var quote = text.splice(1).join(' ');
        var user = text;

        if (typeof quotes[user] === 'undefined'){
          quotes[user] = [];
        }

        quotes[user].push(quote);

        bot.db.set('quotes', quotes);

        response = 'quoting ' + user + ' with ' + quote;
      }
      else {
        response = 'Please include a quote.';
      }

      bot.client.say(msg.channel, response);
    });
  });
};
