fs    = require 'fs'
flour = require 'flour'

sources = [
    'lib/intro.js'
    'lib/core/intro.js'
    'lib/core/rye.js'
    'lib/core/modules.js'
    'lib/core/elements.js'
    'lib/core/selector.js'
    'lib/core/outro.js'
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