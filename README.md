# AWESOM-0
> Hey there have you heard about my robot friend? He's metal and small and doesn't judge me at all.

Meet AWESOM-0, you're friendly neighborhood irc bot! Similar to [Hubot](http://hubot.github.com/), AWESOM-0 responds to a variety of commands that are defined in a folder called <code>scripts</code>.

## Examples

```
L1fescape: AWESOM-0 hi
AWESOM-0: Hi L1fescape!

L1fescape: AWESOM-0 image me cats
AWESOM-0: http://www.rachelkasa.com/wp-content/uploads/2011/10/kitten.jpg

L1fescape: AWESOM-0 note Bjorn totally lame.
AWESOM-0: okie dokes!
... some time passes ...
Bjorn: AWESOM-0 notes
AWESOM-0: L1fescape @ about an hour ago: totally lame.
```

## Install

```
npm install
```

Create a file called <code>settings.js</code> with the following contents:

```js
var

  commands = ["ackbar", "grooveshark", "hi", "imageme", "notes", "pugme", "question", "rules", "youtube"],
  debug = true,

  channels = [<#channel>, <#channel>],
  botname = "AWESOM-0",
  server = '<server addr>',

  help = "Hi, I'm " + botname + ". "; // leave blank for no help message

exports.debug = debug
exports.commands = commands
exports.channels = channels
exports.server = server
exports.botname = botname
exports.help = help
```

Commands can be enabled and disabled by adding or removing them from the <code>commands</code> array.

## Running

```
node awesom0.js
```

## Writing Scripts

On init, the array of commands we've chosen to enable in `settings.js` is looped through by AWSOM-0 and each script is [imported](https://github.com/L1fescape/AWESOM-0/blob/master/awesom0.js#L24). The AWESOM-0 instance is also passed in to each script. This is so that each script can register what regular expression AWESOM-0 should listen to. 

The way registration is done is via the [`respond`](https://github.com/L1fescape/AWESOM-0/blob/master/awesom0.js#L34) function, which takes three params: a regular expression, (optional) how to use the command, and a callback function to run when there is a match in an IRC message. 

AWESOM-0 passes an object into the callback of a matched script with the following properties:

- `match`: array of the results of running `match` on the irc message (this is especially useful when a script needs to read in parameters).
- `from`: the user sending the message.
- `message`: the original message with the bot's name removed.
- `channel`: the channel the message was sent to.

For a good example of all of this, check out the [hi script](https://github.com/L1fescape/AWESOM-0/blob/master/scripts/hi.js).


## TODO

- Integrate calendar with google calendar
- Write more sick scripts!

## Contribute

If you have a feature you'd like to add or a gesture you'd like supported, submit an issue through GitHub or better yet, a pull request!

## Acknowledgements

- [Hubot](http://hubot.github.com/) - A TON of inspiration. AWESOM-0 initially [did things much differently](https://github.com/L1fescape/AWESOM-0/blob/43b84d4dd9edbf31a8f6de8071300410f869a556/awesom0.js#L56). Just looking at the format of [Hubot Scripts](https://github.com/github/hubot-scripts) got me thinking of how to get something like that to work.
- [Node IRC](https://github.com/martynsmith/node-irc) - Super simple, awesome npm package that made writing this bot a breeze. Thanks!

## License

MIT License • © [Andrew Kennedy](https://github.com/L1fescape)
