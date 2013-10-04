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
    }
;

module.exports = function (bot) {
  bot.respond(/^rps ([\w-]+)$/, "rps - Play rock/paper/scissors", function (msg) {
      var gameName,
        // whether you are playing with AWESOM-0 or not
        isbot = false,
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
              bot.client.say(msg.channel, "I suppose I will play with you");
              isbot = true;
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
              isbot: isbot,
              initiated: (new Date).getTime()
          };
          // FIXME include instructions for throw choice when playing bot
          bot.client.say(msg.channel, "Okay, tell me \"rps play " + gameName + "\"");
      });
  });

  /**
   * Respond to a game throw
   * This has to be a bot game as including your choice in chat would be
   * kind of pointless
   */
  bot.respond(/^rps play (..) (r.*|p.*|s.*)/, "rps - Play an existing game", function (msg) {
    // user throw / bot throw
    var uthrow, bthrow,
      names = {"r": "rock", "p": "paper", "s": "scissors"};
      gameName = msg.match[1];
    if (!games.hasOwnProperty(gameName)) {
      bot.client.say(msg.channel, "That game isn't going on right now");
    }
    else {
        if (!games[gameName].isbot) {
          bot.client.say(msg.channel, "This game is against a person, so "
            + "pm me your throw instead of saying it here");
        }
        else {
          uthrow = msg.match[2][0];
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
            delete games[gameName];
          }
          else {
            bot.client.say(msg.channel, irc.colors.wrap("light_red", "My " + names[bthrow]
              + " has defeated your " + names[uthrow]
              + ".  You lose."));
          }
        }
    }
  });
};
