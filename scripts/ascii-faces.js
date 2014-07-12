var cool = require('cool-ascii-faces')

module.exports = function(bot) {

  bot.hear(/!face( (\d+))?/i, '!face - show an ascii face https://gist.github.com/akenn/f87636a6bb5b9343674e', function(msg) {
    var faceIndex = msg.match[2] || null;
    if( faceIndex != null && faceIndex < cool.faces.length ){
      bot.client.say(msg.channel, cool.faces[faceIndex]);
    }else{
      bot.client.say(msg.channel, cool());
    }
  });
  
};
