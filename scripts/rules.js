module.exports = function(bot) {

  bot.respond(/(what are )?the (three |3 )?(rules|laws)/i, 'the rules - Print the rules', function(msg) {
    var response = '',
      rules = [
        '1. A robot may not injure a human being or, through inaction, allow a human being to come to harm.',
        '2. A robot must obey any orders given to it by human beings, except where such orders would conflict with the First Law.',
        '3. A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.'
      ];

    for (var i = 0, j = rules.length; i < j; i++) {
      response += rules[i] + '\n';
    }
    
    bot.client.say(msg.channel, response);
  });

};
