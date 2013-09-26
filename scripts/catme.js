var 
  // libraries
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request')

exports.regx = /catme/
exports.command = function(from, command, message, channel, client) {
  // google image search base url
  var base_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=%s&start=%s'
  // the best search term ever
  var query = 'kitten'
  // google paginates their results, so let's pick a random result page to pull a pug from
  var start = Math.round(Math.random()*20)
  // sub in our query and pagination start and make the request 
  var url = vsprint(base_url, [query, start])
  // make the request
  request((url), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // grab the actual search results out of the response
      var pug_results = JSON.parse(body)['responseData']['results']
      // google returns 4 results per page. pick a random result and grab the image url from it
      response = pug_results[Math.round(Math.random()*3)]['url']
      client.say(channel, response);
    }
  })
}
