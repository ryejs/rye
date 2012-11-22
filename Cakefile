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

task 'lint', ->
    flour.linters.js.options =
        forin    : true
        immed    : true
        latedef  : true
        newcap   : true
        nonew    : true
        undef    : true
        unused   : true
        asi      : true
        boss     : true
        curly    : true
        eqnull   : true
        laxbreak : true
        laxcomma : true
        browser  : true

    flour.linters.js.globals =
        Rye: true

    lint 'lib/*.js'