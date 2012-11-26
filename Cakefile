fs    = require 'fs'
cp    = require 'child_process'
flour = require 'flour'

sources = [
    'lib/rye.js'
    'lib/util.js'
    'lib/eventemitter.js'
    'lib/data.js'
    'lib/selector.js'
    'lib/collection.js'
    'lib/manipulation.js'
    'lib/style.js'
]

task 'build', ->
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.min.js'

task 'build:dev', ->
    flour.minifiers.js = null
    bundle sources, 'dist/rye.js'

task 'build:test', ->
    bundle 'test/*.coffee', 'test/spec.js'

task 'watch:test', ->
    invoke 'build:dev'
    invoke 'build:test'

    watch 'test/index.html', -> invoke 'build:test'
    watch 'test/*.coffee', -> invoke 'build:test'

    watch 'lib/*.js', -> invoke 'build:dev'

task 'test:browser', ->
    cp.exec 'open test/index.html'

task 'test:cov', ->
    # requires http://github.com/visionmedia/node-jscoverage
    flour.minifiers.js = null
    bundle sources, 'dist/rye.js', ->
        try fs.unlinkSync '.coverage/rye.js'
        try fs.unlinkSync '.coverage/rye.min.js'
        try fs.rmdirSync '.coverage'
        cp.exec 'jscoverage dist .coverage', ->
            cp.exec 'open test/coverage.html'

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

