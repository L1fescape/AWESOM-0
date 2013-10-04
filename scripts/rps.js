module.exports = function (bot) {
  bot.respond(/^rps ([\w-]+)/, "rps - Play rock/paper/scissors", function (msg) {
      var opponent = msg.match[1];
      bot.client.whois(opponent, function (user) {
          if (!user.user) {
              bot.client.say(msg.channel, opponent + " is not online!");
          }
          else if (user.nick === msg.from) {
              bot.client.say(msg.channel, "You can't play with yourself!");
          }
          else if (bot.client.nick === opponent) {
              bot.client.say(msg.channel, "I suppose I will play with you");
          }
      });
  });
};
