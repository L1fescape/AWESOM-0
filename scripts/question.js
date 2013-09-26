var questions = [
  {
    question: "who is going to win the super bowl next year?",
    answer: "The New Orleans Saints."
  },
  {
    question: "what's the best site on the internet?",
    answer: "tar-tar.org"
  }
];

exports.regx = /question/
exports.command = function(from, command, message, channel, client) {
  var tokens = message.split(" ");
  var question = message;
  var response = "";

  for (var i = 0, j = questions.length; i < j; i++) {
    if (question == questions[i].question)
      response = questions[i].answer;
  }

  if (response)
    client.say(channel, response);
}
