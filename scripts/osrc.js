var request = require('request');

module.exports = function (bot) {
  bot.hear(/!osrc /i, "!osrc <username> - get information on a user's open source report card.", function (msg) {
    var user = msg.message.split(" ")[1];
    request("http://osrc.dfm.io/" + user + ".json", function (error, response, body) {
      var osrc = JSON.parse(body),
        langs = [],
        msg = "";

      if (osrc.hasOwnProperty("message")) {
        bot.client.say(msg.channel, user + " is either not a github user or is a very shitty one");
      }
      else {
        msg += osrc.name;
        langs = osrc.usage.languages;
        langs.sort(function (prev, next) {
          return next.count - prev.count;
        });

        langs = langs.slice(0, 2);

        if (langs.length) {
          msg += " really likes to use " + langs.reduce(function (msg, lang) {
            return msg + lang.language + " (" + lang.count + ") and ";
          }, "").replace(/ and $/, "");
        }
        else {
            msg += " doesn't like any languages."
        }

        bot.client.say(msg.channel, msg);
      }
    });
  });
};
