var moment = require('moment'),
    start = new Date();

module.exports = function(bot) {


  bot.respond(/^(uptime|up time)/i, "uptime - Display how long bot has been running", function(msg) {
    bot.client.say(msg.channel, "I was started " + moment(start).fromNow());
  });


};
