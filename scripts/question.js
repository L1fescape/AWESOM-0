var questions = [
  {
    q: /who is going to win the super bowl next year/,
    a: "The New Orleans Saints."
  },
  {
    q: /what's the best site on the internet/,
    a: "tar-tar.org"
  }
];

exports.match = /question/
exports.command = function(from, message, channel, client) {
  message = message.replace(exports.match, "");
  var response = "";

  for (var i = 0, j = questions.length; i < j; i++) {
    if (questions[i].q.test(message))
      response = questions[i].a;
  }

  if (response)
    client.say(channel, response);
  else {
    message = message.replace(new RegExp(" ", 'g'), "%20");
    client.say(channel, "http://lmgtfy.com/?q="+message);
  }
}
