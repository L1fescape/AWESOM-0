var Sandbox = require("sandbox")

module.exports = function(bot) {
  bot.respond(/^(eval)/i, "eval - run code", function(msg) {
    var code = msg.message.replace(/^eval\ /,"")
    var s = new Sandbox()
    s.run(code, function(output){
      bot.client.say(msg.channel, output.result);
    })
  });
};
