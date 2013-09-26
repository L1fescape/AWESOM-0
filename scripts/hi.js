exports.regx = /hi/
exports.command = function(from, command, message, channel, client) {
  var response = "Hi " + from + "!"
  client.say(channel, response);
}
