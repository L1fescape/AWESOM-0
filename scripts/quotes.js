var quotes = {}

module.exports = function(bot) {
  bot.respond(/^(remember|quote) \w+/i, "remember quotes", function(msg) {
    var response
    var text = msg.message.replace(/^(remember|quote)\ /,"").split(/\ /g)
    var key = text[0]
    //either store or recall depending on the amount of spaces i.e. "quote akenn" means to retrieve
    //while "quote akenn lol babes are k3wl" means to store a message
    if (text.length > 1){
      //store message
      var rest = text.slice(1).join(" ")
      quotes[key]=rest
      response = "quoting "+key+" with "+rest
    }else{
      response = key+": "+quotes[key]
    }

    bot.client.say(msg.channel, response);
  });
};
