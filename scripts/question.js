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


module.exports = function(bot) {


  bot.respond(/question/i, "question <question> - Ask a question", function(msg) {
    var response = "";
    for (var i = 0, j = questions.length; i < j; i++) {
      if (questions[i].q.test(msg.message))
        response = questions[i].a;
    }

    if (response)
      bot.client.say(msg.channel, response);
    else {
      var message = msg.message.replace(new RegExp(" ", 'g'), "%20");
      bot.client.say(msg.channel, "http://lmgtfy.com/?q="+message);
    }
  });


};
