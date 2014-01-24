var request = require('request');

module.exports = function (bot) {
  bot.hear(/!osrc /i, "!osrc <username> - get information on a user's open source report card.", function (msg) {
    var user = msg.message.split(" ")[1];
    request("http://osrc.dfm.io/" + user + ".json", function (error, response, body) {
      var osrc = JSON.parse(body);

      console.log("http://osrc.dfm.io/" + user + ".json");

      if (osrc.hasOwnProperty("message")) {
          console.log(osrc.message);
          bot.client.say(msg.channel, user + " is either not a github user or is a very shitty one");
      }
    });
  });
};
