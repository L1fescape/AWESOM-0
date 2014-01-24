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
        osrc.usage.languages.forEach(function (elem) {
          if (langs[0] && elem.count > langs[0].count) {
            langs[0] = elem;
          }
          else if (langs[1] && elem.count > langs[1].count) {
            langs[1] = elem;
          }
          else if (!langs[0]) {
            langs[0] = elem;
          }
          else if (!langs[1]) {
              langs[1] = elem;
          }
        });

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
