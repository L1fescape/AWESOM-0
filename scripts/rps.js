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
  bot.respond(/^rps$/, "rps - instructions", function (msg) {
    bot.client.say(msg.channel,
      "Rock Paper Scissors help:\n"
      + "\"rps throw (rock|paper|scissors)\" -- play against me\n"
      + "\"rps vs (user)\" -- initiate a game against this user \n"
      + "\"rps play (two_char_game_id) (throw)\" -- record your throw for the game"
    );
  });

  bot.respond(/^rps vs ([\w-]+)$/, "rps - Play rock/paper/scissors", function (msg) {
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
          player: {
            name: msg.from,
            "throw": null
          },
          opponent: {
              name: opponent,
              "throw": null
          },
          initiated: (new Date).getTime(),
          channel: msg.channel
      };
      bot.client.say(msg.channel, "Okay, " + msg.from + " and " + opponent
        + ", pm me \"rps play " + gameName + " (rock|paper|scissors)\"");
    });
  });

  // Play a named game
  bot.respond(/^rps play (..) (r.*|p.*|s.*)/, "rps - Play with a person", function (msg) {
      var game, participant, opposition,
        gameName = msg.match[1],
        uthrow = msg.match[2];
      if (!games.hasOwnProperty(gameName)) {
        bot.client.say(msg.channel, irc.colors.wrap("light_red",
          "That rock/paper/scissors game does not exist"));
        return;
      }

      game = games[gameName];

      if (game.player.name != msg.from && game.opponent.name != msg.from) {
        bot.client.say(msg.channel, irc.colors.wrap("light_red",
          "You are not a participant in that game"));
        return;
      }

      // Determine whether the game initiator (player) or recipient
      // (opponent) has sent the message
      if (game.player.name == msg.from) {
        participant = game.player;
        opposition = game.opponent;
      }
      else {
        participant = game.opponent;
        opposition = game.player;
      }

      if (participant.throw) {
        bot.client.say(msg.channel, irc.colors.wrap("light_red",
          "Your throw of " + names[participant.throw] + " has already been recorded"));
        return;
      }

      participant.throw = msg.match[2][0];

      if (opposition.throw) {
        bot.client.say(msg.channel, "Check the original channel for the results!");
        bot.client.say(game.channel, irc.colors.wrap("dark_green",
          "Rock Paper Scissors battle: " + game.player.name
            + " challenges " + game.opponent.name));
        bot.client.say(game.channel, irc.colors.wrap("white",
          game.player.name + " throws " + names[game.player.throw]));
        bot.client.say(game.channel, irc.colors.wrap("black",
          game.opponent.name + " throws " + names[game.opponent.throw]));

        // Determine winner
        if (game.player.throw == game.opponent.throw) {
            bot.client.say(game.channel, "Tied! The game is still open.");
            game.player.throw = null;
            game.opponent.throw = null;
            return;
        }
        else if (comparator[game.player.throw][game.opponent.throw]) {
            bot.client.say(game.channel, game.player.name + " has won!");
        }
        else {
            bot.client.say(game.channel, game.opponent.name + " has won!");
        }
        delete games[gameName];
      }
      else {
        bot.client.say(msg.channel, irc.colors.wrap("light_green",
          "Okay, I've recorded your throw.  Waiting for your opponent to respond."));
      }
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
