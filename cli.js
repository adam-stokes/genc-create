"use strict";

var promise = require("bluebird");
var moment = require("moment");
var meow = require("meow");
var isDir = require("is-dir-promise");
var fs = require("mz/fs");
var path = require("path");
var editor = promise.promisify(require("editor"));
var co = require("co");

var cli = meow({
    help: ["Usage",
           " postc new <title> [options]",
           "", "options:",
           " -d --directory [folder]      Specify a folder to write to",
           " -t --tags [comma,seperated]  Comma seperated list of tags"]
});

var action = cli.input[0];
var title = cli.input[1];
var outputDir = cli.flags.directory || cli.flags.d;
var tags = cli.flags.tags || cli.flags.t;

if (!((action != null) && (title != null) && (outputDir != null))) {
    throw Error("Missing args, see --help");
}

if (tags != null) {
  tags = "[" + tags + "]";
} else {
  tags = "[]";
}

var fullPath = path.join(outputDir, title + ".md");
var timestamp = moment.utc().format();
var template = "---\ntitle: " +
    title +
    "\ndate: " +
    timestamp +
    "\ntags: " +
    tags +
    "\n---\n\n# Write your post here\n\nFill in whatever blogish topic you want.";
console.log("Creating new file in %s", fullPath);

co(function*(){
    if (yield isDir(outputDir)){
        yield fs.writeFile("" + fullPath, template);
        yield editor(fullPath);
    }
}).catch(function(e) {
    throw Error(e);
});
