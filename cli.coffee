Promise = require('bluebird')
moment = require('moment')
meow = require('meow')
fs = require('fs-extra-promise')
path = require('path')
editor = Promise.promisify(require('editor'))

cli = meow(
  help: [
    'Usage',
    ' postc new <title> [options]',
    '',
    'options:',
    ' -d --directory [folder]      Specify a folder to write to'
    ' -t --tags [comma,seperated]  Comma seperated list of tags'
  ].join('\n')
)

action = cli.input[0]
title = cli.input[1]
outputDir = cli.flags.directory || cli.flags.d

# Optional
tags = cli.flags.tags || cli.flags.t

unless action? and title? and outputDir?
  console.log "Missing args, see --help"
  process.exit 1

# do work
if tags?
  tags = "[#{tags}]"
else
  tags = "[]"
fullPath = path.join(outputDir, "#{title}.md")
timestamp = moment.utc().format()
template = """
  ---
  title: #{title}
  date: #{timestamp}
  tags: #{tags}
  ---

  # Write your post here

  Fill in whatever blogish topic you want.
"""

console.log "Creating new file in #{fullPath}"
fs.writeFileAsync("#{fullPath}", template)
  .then(-> return editor(fullPath))
  .catch((e) -> throw Error(e))
