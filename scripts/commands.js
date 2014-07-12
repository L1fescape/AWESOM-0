module.exports = function (bot) {
  bot.hear(/!commands/i, 'commands - list what commands are currently enabled.', function (msg) {
      bot.client.say(msg.channel, 'I can perform the following commands:');
      bot.client.say(msg.channel, bot.settings.commands.join(', '));
  });
};
