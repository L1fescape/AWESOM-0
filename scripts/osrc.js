var request = require('request');

module.exports = function (bot) {
  bot.hear(/!osrc /i, "!osrc <username> - get information on a user's open source report card.", function (msg) {
    var user = msg.message.split(" ")[1];
    request("http://osrc.dfm.io/" + user + ".json", function (error, response, body) {
      var osrc = JSON.parse(body),
        langs = [],
        output = "";

      if (osrc.hasOwnProperty("message")) {
        bot.client.say(msg.channel, user + " is either not a github user or is a very shitty one");
      }
      else {
        output += osrc.name;
        langs = osrc.usage.languages;
        langs.sort(function (prev, next) {
          return next.count - prev.count;
        });

        langs = langs.slice(0, 2);

        if (langs.length) {
          output += " really likes to use " + langs.reduce(function (msg, lang) {
            return msg + lang.language + " (" + lang.count + ") and ";
          }, "").replace(/ and $/, "");
        }
        else {
            output += " doesn't like any languages."
        }

        bot.client.say(msg.channel, output);

        if (osrc.connected_users.length) {
          bot.client.say(msg.channel, "Their favorite github users are obviously "
            + osrc.connected_users[0].username + " and " + osrc.connected_users[1].username
          );
        }
        else {
          bot.client.say(msg.channel, "They don't get along with any github users");
        }
      }
    });
  });
};
