#!/usr/bin/env node
repl = require("repl");

require("node-getopt").create([
  ["h", "help", "display this message"]
]).bindHelp().setHelp(
  "Usage: debug.js [-h|--help] [<AWESOM-O_variable_name>]\n\nIf no name is provided, 'a' is used\n\n"
  + "Debug AWESOM-O by sending it a message via `<name>.testMsg(msg)`"
)
.parseSystem();

var name = "a";

if ("undefined" !== typeof process.argv[2]) {
  name = process.argv[2];
}

try {
    global[name] = require("./awesom0");
    global[name].init();

    console.log("To see the current settings, simply type AWESOM-0's name, '" + name + "'");

    repl.start({prompt: "Debugging AWESOM-0 > "})
}
catch (error) {
    console.log("Unable to load AWESOM-0 due to error:");
    console.log(error);
}
