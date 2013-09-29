var 
  // libraries
  vsprint = require("sprintf-js").vsprintf, 
  request = require('request')

exports.match = /(youtube|yt)/i
exports.command = function(from, message, channel, client) {
  var query = message.replace(exports.match, "")
  // google image search base url
  var base_url = 'https://gdata.youtube.com/feeds/api/videos?q=%s&orderby=viewCount&v=2&max-results=10&alt=json'
  // sub in our query and pagination start and make the request 
  var url = vsprint(base_url, [query])
  // make the request
  request((url), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // grab the actual search results out of the response
      var results = JSON.parse(body)
      var entries = results.feed.entry;
      if (entries.length == 0) {
        client.say(channel, "No results.");
        return;
      }
      var video = entries[Math.round(Math.random()*entries.length)];
      client.say(channel, video.link[0].href);
    }
  })
};
exports.usage = "youtube <query> - Seach youtube for a video"
