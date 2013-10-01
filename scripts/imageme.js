var 
  // libraries
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request');


module.exports = function(bot) {

  
  bot.respond(/(image me|imageme) (.*)/i, "image me <term> - Search google for images of <term>", function(msg) {
    // google image search base url
    var base_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=%s&start=%s'
    // the best search term ever
    var query = msg.match[2]
    // google paginates their results, so let's pick a random result page to pull a pug from
    var start = Math.round(Math.random()*20)
    // sub in our query and pagination start and make the request 
    var url = vsprint(base_url, [query, start])
    // make the request
    request((url), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // grab the actual search results out of the response
        var results = JSON.parse(body)['responseData']['results'];
        if (!results || !results.length) {
          bot.client.say(msg.channel, "No results")
          return;
        }
        // google returns 4 results per page. pick a random result and grab the image url from it
        response = results[Math.round(Math.random()*3)]['url']
        bot.client.say(msg.channel, response);
      }
    })
  });


};
