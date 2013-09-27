exports.match = /^(hi|hello)/
exports.command = function(from, message, channel, client) {
  var greetings = [
    "Howdy " + from,
    "Hi " + from + "!",
    "How's it going " + from + "?",
    "Hi there " + from + "!"
  ];
  var response = greetings[Math.floor(Math.random()*greetings.length)];
  client.say(channel, response);
}
