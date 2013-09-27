var questions = [
  {
    question: /who is going to win the super bowl next year?/,
    answer: "The New Orleans Saints."
  },
  {
    question: /what's the best site on the internet?/,
    answer: "tar-tar.org"
  }
];

exports.match = /question/
exports.command = function(from, message, channel, client) {
  var question = message;
  var response = "";

  for (var i = 0, j = questions.length; i < j; i++) {
    if (questions[i].question.test(question))
      response = questions[i].answer;
  }

  if (response)
    client.say(channel, response);
}
