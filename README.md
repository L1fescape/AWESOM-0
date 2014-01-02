# AWESOM-0 [![Build Status](https://travis-ci.org/L1fescape/AWESOM-0.png?branch=master)](https://travis-ci.org/L1fescape/AWESOM-0)
> Hey there have you heard about my robot friend? He's metal and small and doesn't judge me at all.

Meet AWESOM-0, you're friendly neighborhood IRC bot! Similar to [Hubot](http://hubot.github.com/), AWESOM-0 responds to a variety of commands that are defined in a folder called <code>scripts</code>.

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

Create a file called <code>settings.js</code> (you can copy
from the existing <code>settings.js.sample</code>).

Commands can be enabled and disabled by adding or removing them from the <code>commands</code> array.

## Running

From the command line:

```
node awesom0.js
```

With [forever](https://github.com/nodejitsu/forever) (note you'll need to install forever globally):

```
forever start awesom0.js
```

Using it inside another Nodejs file:

```
var a = require("./awesom0")
a.init({ commands: ["hi"], botname: "AWESOM0" });
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

## Debugging

If you want to test scripts without connecting to an IRC srever, you're in luck! In `settings.js` you can set the value of `debug` to true. This will display errors, show messages the irc bot receives, and will print responses triggered by vaious commands. Setting debug mode to true will also define a function called `testMsg(msg)` which is an alias for `onmessage("TestUser", "#test", msg)`. This makes testing commands a little easier as you don't need to define the user and channel a message was sent from/to every time.

In order to test a script (in this case, the "it's a trap" script), do the following:

```js
$ node
//=> 

> a = require("./awesom0").init()
//=>

> a.printHelp()
//=> Hi I'm AWESOM-0. Here is a list of my available commands:
//=> hi - Send greetings
//=> it's a trap - Display an Admiral Ackbar piece of wonder
//=> image me <term> - Search google for images of <term>
//=> ... more commands ...

> a.testMsg("its a trap")
//=> Message (TestUser via #test): its a trap

> a.testMsg("AWESOM-0 its a trap")
//=> Message (TestUser via #test): AWESOM-0 its a trap
//=> Response (via #test): http://31.media.tumblr.com/tumblr_lqrrkpAqjf1qiorsyo1_500.jpg

> a.onmessage("AwesomeUser", "#AwesomeChannel", "AWESOM-0 its a trap")
//=> Message (AwesomeUser via #AwesomeChannel): AWESOM-0 its a trap
//=> Response (via #AwesomeChannel): http://farm6.staticflickr.com/5250/5216539895_09f963f448_z.jpg

```


## TODO

- Write more tests
- Document using redis

## Issues or Questions

If there's a feature you'd like supported or a bug in the code, create an [issue on GitHub](https://github.com/L1fescape/AWESOM-0/issues). If you have any questions, join us on IRC. We're at `#AWESOM-0` on Freenode.

## Acknowledgements

- [Hubot](http://hubot.github.com/) - A TON of inspiration. AWESOM-0 initially [did things much differently](https://github.com/L1fescape/AWESOM-0/blob/43b84d4dd9edbf31a8f6de8071300410f869a556/awesom0.js#L56). Just looking at the format of [Hubot Scripts](https://github.com/github/hubot-scripts) got me thinking of how to get something like that to work.
- [Node IRC](https://github.com/martynsmith/node-irc) - Super simple, awesome npm package that made writing this bot a breeze. Thanks @martynsmith!

## License

MIT License • © [Andrew Kennedy](https://github.com/L1fescape)
