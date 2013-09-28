exports.match = /^(hi|hello)/i
exports.command = function(from, message, channel, client) {
  var greetings = [
    "Howdy " + from,
    "Hi " + from + "!",
    "How's it going " + from + "?",
    "Hi there " + from + "!",
    "Hola " + from
  ];
  var response = greetings[Math.floor(Math.random()*greetings.length)];
  client.say(channel, response);
}
