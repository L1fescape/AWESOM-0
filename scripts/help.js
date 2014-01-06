module.exports = function(bot) {

  bot.respond(/^help$/i, function(msg) {
    bot.printHelp(msg.from); 
  });

};
