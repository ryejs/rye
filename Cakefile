fs     = require 'fs'
cp     = require 'child_process'
flour  = require 'flour'
rimraf = require 'rimraf'

# Build tasks
# ===========

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
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.js'

# Testing
# =======

task 'build:test', ->
    bundle 'test/spec/*.coffee', 'test/spec.js'

task 'build:cov', ->
    rimraf.sync '.coverage'
    cp.exec 'jscoverage lib .coverage', ->
        cov_sources = sources.map (f) -> f.replace('lib/', '.coverage/')
        flour.minifiers.js = null
        bundle cov_sources, '.coverage/rye.instrumented.js'

# Open test harness in a browser so we don't have
# to run a server or know the absolute URL
task 'cov', ->
    invoke 'build:cov'
    cp.exec 'open test/coverage.html'

task 'test', ->
    invoke 'build:test'
    cp.exec 'open test/index.html'

# Development
# ===========

task 'watch', ->
    invoke 'build:dev'
    invoke 'build:test'

    watch 'test/index.html', -> invoke 'build:test'
    watch 'test/spec/*.coffee', -> invoke 'build:test'

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
