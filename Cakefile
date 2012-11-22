fs    = require 'fs'
flour = require 'flour'

sources = [
    'lib/rye.js'
    'lib/util.js'
    'lib/elements.js'
    'lib/selector.js'
    'lib/main.js'
]

task 'build', ->
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.min.js'

task 'build:test', ->
    flour.minifiers.js = null
    invoke 'build'

