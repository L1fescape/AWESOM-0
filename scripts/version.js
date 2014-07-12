module.exports = function(bot) {

	bot.respond(/^version/i, 'version - Display current AWESOM-0 version', function(msg) {
		var p, v;
		try {
			p = require('../package');
			v = 'I\'m on version ' + p.version;
			bot.client.say(msg.channel, v);
		}
		catch (error){
			throw 'Unable to load ../package.json.';
		}

	});

};
