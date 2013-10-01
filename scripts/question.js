var questions = [
  {
    q: /(who (is going to|will) )?win the (super bowl|superbowl) next year/i,
    a: "The New Orleans Saints."
  },
  {
    q: /(what'?s the )?best site( on the internet)/i,
    a: "tar-tar.org"
  }
];


module.exports = function(bot) {


  bot.respond(/^question (.*)/i, "question <question> - Ask a question", function(msg) {
    var response = "";
    var query = msg.match[1];
    console.log(query);
    for (var i = 0, j = questions.length; i < j; i++) {
      if (query.match(questions[i].q)) {
        if (typeof questions[i].a == 'object')
          response = questions[i].a[Math.round(Math.random()*questions[i].a.length)];
        else
          response = questions[i].a;
      }
    }

    if (response)
      bot.client.say(msg.channel, response);
    else {
      query = query.replace(new RegExp(" ", 'g'), "%20");
      bot.client.say(msg.channel, "http://lmgtfy.com/?q="+query);
    }
  });


};
