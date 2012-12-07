fs     = require 'fs'
cp     = require 'child_process'
flour  = require 'flour'
rimraf = require 'rimraf'

# Build tasks
# ===========

sources = [
    'lib/rye.js'
    'lib/util.js'
    'lib/data.js'
    'lib/query.js'
    'lib/collection.js'
    'lib/manipulation.js'
    'lib/style.js'
    'lib/events.js'
    'lib/dom-events.js'
]

task 'build', ->
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.min.js'

task 'build:dev', ->
    flour.minifiers.js = null
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.js'

# Testing
# =======

task 'build:test', ->
    bundle 'test/*.coffee', 'test/spec.js'

task 'build:cov', ->
    rimraf.sync '.coverage'
    cp.exec 'jscoverage lib .coverage', (err) ->
        if err?.code is 127
            console.log 'cov requires github.com/visionmedia/node-jscoverage'
            return
        cov_sources = sources.map (f) -> f.replace('lib/', '.coverage/')
        flour.minifiers.js = null
        bundle cov_sources, '.coverage/rye.instrumented.js'

# Open test harness in a browser so we don't have
# to run a server or know the absolute URL
task 'cov', ->
    invoke 'build:cov'
    cp.exec 'open test/assets/coverage.html'

task 'test', ->
    invoke 'build:test'
    cp.exec 'open test/assets/index.html'

# Development
# ===========

task 'watch', ->
    invoke 'build:dev'
    invoke 'build:test'

    watch 'test/assets/index.html', -> invoke 'build:test'
    watch 'test/*.coffee', -> invoke 'build:test'

    watch 'lib/*.js', -> invoke 'build:dev'

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
        Rye      : true

    lint 'lib/*.js'
