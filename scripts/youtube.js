var request = require('request');

module.exports = function(bot) {

  bot.respond(/(youtube|yt) (.*)/i, 'youtube <query> - Seach youtube for a video', function(msg) {
    var query = msg.match[2];
    // google image search base url
    var url = 'https://gdata.youtube.com/feeds/api/videos?q=' + query + '&orderby=viewCount&v=2&max-results=10&alt=json';
    // make the request
    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // grab the actual search results out of the response
        var results = JSON.parse(body);
        var entries = results.feed.entry;
        if (!entries || !entries.length) {
          bot.client.say(msg.channel, 'No results.');
          return;
        }
        var video = entries[Math.round(Math.random()*entries.length)];
        bot.client.say(msg.channel, video.link[0].href);
      }
    });
  });

};
