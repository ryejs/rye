system  = require 'system'
webpage = require 'webpage'

page = webpage.create()
url = system.args[1]

page.onError = (msg, trace) ->
    console.log "    #{msg}"
    if trace then trace.forEach (t) ->
        console.log "        at #{t.file}:#{t.line} #{if t.function then " (in function '#{t.function}')" else ''}"
    phantom.exit 1

page.onConsoleMessage = (msg) ->
    console.log msg

page.onCallback = (code) ->
    phantom.exit code

page.open url
