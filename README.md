# AWESOM-0
> Hey there have you heard about my robot friend? He's metal and small and doesn't judge me at all.

Meet AWESOM-0, you're friendly neighborhood irc bot! Similar to [Hubot](http://hubot.github.com/), AWESOM-0 responds to a variety of commands that are defined in a folder called <code>scripts</code>.

## Examples

```
L1fescape: AWESOM-0 hi
AWESOM-0: Hi L1fescape!

L1fescape: AWESOM-0 catme
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

```
var

  commands = ["hi", "calendar", "pugme", "question", "notes", "catme"],
  debug = true,

  channels = [<#channel>, <#channel>],
  botname = "AWESOM-0",
  server = '<server addr>';

exports.debug = debug
exports.commands = commands
exports.channels = channels
exports.server = server
exports.botname = botname
```

Commands can be enabled and disabled by adding or removing them from the <code>commands</code> array.

## Running

```
node awesom0.js
```

## TODO

- Integrate calendar with google calendar
- Write more sick scripts!

## Contribute

If you have a feature you'd like to add or a gesture you'd like supported, submit an issue through GitHub or better yet, a pull request!

## License

MIT License • © [Andrew Kennedy](https://github.com/L1fescape)
