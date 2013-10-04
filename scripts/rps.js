module.exports = function (bot) {
  bot.respond(/^rps (\w+)/, "rps - Play rock/paper/scissors", function (msg) {
      bot.client.whois(msg.match[1], function (user) {
          if (!user.user) {
              bot.client.say(msg.channel, msg.match[1] + " is not online!");
          }
          else if (user.nick === msg.from) {
              bot.client.say(msg.channel, "You can't play with yourself!");
          }
          else {
              
          }
      });
  });
};
