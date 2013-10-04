/**
 * Play a game of rock paper scissors with another user through PMs
 * or with AWESOM-0 himself
 */

// keeps track of named games
var games = {},
  irc = require("irc"),

    /**
     * winner is determined by comparator[attempt][challenge]
     * returns whether attempt wins
     */
    comparator = {
        "r": {"s": true, "p": false},
        "s": {"p": true, "r": false},
        "p": {"r": true, "s": false}
    },
    names = {"r": "rock", "p": "paper", "s": "scissors"}
;

module.exports = function (bot) {
  bot.respond(/^rps ([\w-]+)$/, "rps - Play rock/paper/scissors", function (msg) {
    var gameName,
      opponent = msg.match[1];
    // check whether user is on and determine what to do
    bot.client.whois(opponent, function (user) {
      if (!user.user) {
        bot.client.say(msg.channel, opponent + " is not online!");
        return;
      }
      else if (user.nick === msg.from) {
        bot.client.say(msg.channel, "You can't play with yourself!");
        return;
      }
      else if (bot.client.nick === opponent) {
        bot.client.say(msg.channel, "If you want to play against me, tell me"
          + "\"rps throw (rock|paper|scissors)\"");
        return;
      }

      // game identified by random two-letter string that is unique
      // to the current game list
      do {
        gameName = Math.random().toString(36).substring(16);
      }
      // games grow stale after 30 minutes
      while (gameName.length !== 2 || (games.hasOwnProperty(gameName) &&
        games[gameName].initiated > (new Date).getTime() - 500000));
      games[gameName] = {
          player: msg.from,
          opponent: opponent,
          initiated: (new Date).getTime()
      };
      bot.client.say(msg.channel, "Okay, tell me \"rps play " + gameName + "\"");
    });
  });

  bot.respond(/^rps throw (r.*|p.*|s.*)/, "rps - Play with AWESOME-O", function (msg) {
    // user throw / bot throw
    var uthrow, bthrow;
      uthrow = msg.match[1][0];
      bthrow = ["r", "p", "s"];
      bthrow = bthrow[Math.floor(Math.random() * 3)];

    if (uthrow === bthrow) {
      irc.colors.wrap("yellow", bot.client.say(msg.channel, "We both threw "
        + names[uthrow] + ".  Try again."));
    }
    else if (comparator[uthrow][bthrow]) {
      bot.client.say(msg.channel, irc.colors.wrap("light_green", "Your " + names[uthrow]
        + " has defeated my " + names[bthrow]
        + ".  Well done!"));
    }
    else {
      bot.client.say(msg.channel, irc.colors.wrap("light_red", "My " + names[bthrow]
        + " has defeated your " + names[uthrow]
        + ".  You lose."));
    }
  });
};
