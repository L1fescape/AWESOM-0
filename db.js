var chalk = require('chalk'),
  setupRedis;

setupRedis = function(bot, settings){
  var redis = require('redis'),
    port = settings.redisPort || 6379,
    host = settings.redisHost || '127.0.0.1',
    maxAttempts = 3;

  bot.redisClient = redis.createClient(port, host, {
    'max_attempts': maxAttempts
  });

  bot.redisClient.on('error', function(){
    maxAttempts--;
    if (!maxAttempts) {
      console.log(chalk.red('Error: Could not connect to redis server.'), 'Is redis running? Defaulting to temporary storage.');
      console.log(chalk.blue('Note:'), 'If you don\'t want to use redis, you can disable in settings.js');
      settings.redis = false;
    }
  });
};


module.exports = function(bot){
  var settings = bot.settings;

  if (settings.redis) {
    this.setupRedis(bot, settings);
  }

  // simple key/value store for AWESOM-0 that uses redis if enabled or an
  // instance variable if it is not.
  return {
    values: {},

    get: function(key, callback) {
      if (settings.redis) {
        bot.redisClient.get(key, function(err, value) {
          try {
            value = JSON.parse(value);
          }
          catch( error ){
            if( this.debug ){
              console.log(error);
            }
            value = {};
          }
          callback(value);
        });
      }
      else {
        callback(bot.db.values[key]);
      }
    },

    set: function(key, value, callback){
      if (settings.redis) {
        if (typeof value !== 'string')
          value = JSON.stringify(value);

        bot.redisClient.set(key, value);
      }
      else {
        bot.db.values[key] = value;
      }

      if( callback ){
        callback();
      }
    }
  };
};
