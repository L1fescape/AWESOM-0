module.exports = function(bot) {


  bot.respond(/^(hi|hello)/i, "hi - Send greetings", function(msg) {
    var greetings = [
      "Howdy " + msg.from,
      "Hi " + msg.from + "!",
      "How's it going " + msg.from + "?",
      "Hi there " + msg.from + "!",
      "Hola " + msg.from
    ];
    var response = greetings[Math.floor(Math.random()*greetings.length)];
    bot.client.say(msg.channel, response);
  });


};
