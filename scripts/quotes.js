
module.exports = function(bot) {


  bot.respond(/^quotes/i, "quotes [<user>] - retrieve all quotes or a specific user's quotes", function(msg) {
    var response = "";
    var user = msg.message.split(" ")[1];
   
    bot.db.get("quotes", function(quotes) {
      if (!quotes)
        quotes = {};

      if (user) {
        // if there are no quotes for a user
        if (typeof quotes[user] === 'undefined' || quotes[user].length == 0)
          resonse = "There are no quotes for this user.";

        // else print all that user's quotes
        else {
          for (var i = 0, j = quotes[user].length; i < j; i++) {
            response += quotes[user][i] + "\n"; 
          }
        }
      }

      // else get all quotes for all users
      else {
        for (var user in quotes) {
          if (quotes[user].length) {
            response += user + "'s quotes: \n";
            for (var i = 0, j = quotes[user].length; i < j; i++) {
              response += quotes[user][i] + "\n";
            }
          }
        }
      } 

      bot.client.say(msg.channel, response);
    });
  });
      

  bot.respond(/^(remember|quote) \w+/i, "quote <user> <quote> - remember/retrieve quotes", function(msg) {
    var response = "";
    var text = msg.message.replace(/^(remember|quote)\ /,"").split(" ");
    
    bot.db.get("quotes", function(quotes) {
      if (!quotes)
        quotes = {};

      if (text.length > 1) {
        var quote = text.splice(1).join(" ");
        var user = text;

        if (typeof quotes[user] === 'undefined')
          quotes[user] = [];

        quotes[user].push(quote);

        bot.db.set("quotes", quotes);

        response = "quoting " + user + " with " + quote
      }
      else {
        response = "Please include a quote."
      }

      bot.client.say(msg.channel, response);
    });
  });
};
