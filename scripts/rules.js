exports.match = /(what are )?the (three |3 )?(rules|laws)/
exports.command = function(from, message, channel, client) {
  var response = "";
  var rules = [
    "1. A robot may not injure a human being or, through inaction, allow a human being to come to harm.",
    "2. A robot must obey any orders given to it by human beings, except where such orders would conflict with the First Law.",
    "3. A robot must protect its own existence as long as such protection does not conflict with the First or Second Law."
  ]
  for (var i = 0, j = rules.length; i < j; i++) {
    response += rules[i] + "\n";
  }
  client.say(channel, response);
}
