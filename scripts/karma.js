var karma = {}

module.exports = function(bot) {
  bot.respond(/\w+\+\+$|\w+--$/i, "Keep track of people's karma", function(msg) {
    var doInc =  msg.message.match(/\w+\+\+$/) !== null;
    var person = msg.message.match(/\w+\+\+$|\w+--/)[0].replace(/\+\+$|--$/,"")
    var oldKarma = karma[person] === undefined ? 0 : karma[person]
    karma[person] = doInc ? ++oldKarma : --oldKarma

    var response = person + " ⇒ " + karma[person];
    bot.client.say(msg.channel, response);
  });
};
