fs    = require 'fs'
cp    = require 'child_process'
flour = require 'flour'

sources = [
    'lib/rye.js'
    'lib/util.js'
    'lib/selector.js'
    'lib/manipulation.js'
]

task 'build', ->
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.min.js'

task 'build:dev', ->
    flour.minifiers.js = null
    bundle sources, 'dist/rye.js'

task 'build:test', ->
    compile 'test/spec.coffee', 'test/spec.js'

task 'watch:test', ->
    invoke 'build:dev'
    invoke 'build:test'

    watch [
        'test/spec.coffee'
        'index.html'
    ], -> invoke 'build:test'

    watch 'lib/*.js', -> invoke 'build:dev'

task 'test:browser', ->
    cp.exec 'open test/index.html'


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
    