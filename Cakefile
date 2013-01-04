fs             = require 'fs'
cp             = require 'child_process'
flour          = require 'flour'
rimraf         = require 'rimraf'
util           = require 'util'

sources = [
    'lib/rye.js'
    'lib/util.js'
    'lib/data.js'
    'lib/query.js'
    'lib/collection.js'
    'lib/manipulation.js'
    'lib/events.js'
    'lib/touch-events.js'
    'lib/request.js'
    'lib/style.js'
]

[minifiers, flour.minifiers.js] = [flour.minifiers.js, null]

# Builds & Watch
# ==============

build =
    prod: (options, cb) ->
        try fs.mkdirSync 'dist'
        flour.minifiers.js = minifiers
        bundle sources, 'dist/rye.min.js', ->
            flour.minifiers.js = null
            cb()

    dev: (options, cb) ->
        try fs.mkdirSync 'dist'
        bundle sources, 'dist/rye.js', cb

    test: (options, cb) ->
        bundle 'test/*.coffee', 'test/spec.js', cb


task 'build:prod', build.prod
task 'build:dev', build.dev
task 'build:test', build.test

task 'build', (options) -> 
    build.prod options, -> build.dev options, -> build.test options

task 'watch', ->
    invoke 'build:dev'
    invoke 'build:test'

    watch 'test/*.coffee', -> invoke 'build:test'
    watch 'lib/*.js', -> invoke 'build:dev'

# Clear
# ==============

task 'clear', ->
    rimraf.sync 'dist'
    try fs.unlinkSync 'test/spec.js'

# Lint
# ==============

task 'lint', ->
    flour.linters.js.options =
        forin    : true
        immed    : true
        latedef  : true
        newcap   : true
        nonew    : true
        undef    : true
        #unused   : true
        asi      : true
        boss     : true
        curly    : true
        eqnull   : true
        laxbreak : true
        laxcomma : true
        browser  : true
        supernew : true

    flour.linters.js.globals =
        Rye      : true

    lint 'lib/*.js'

# Testing
# ==============

option '-b', '--browser [BROWSER]', 'Browser for test tasks'
option '-q', '--quick', 'Skip slow tests'
option '-p', '--port', 'Server port'
option '-g', '--grep [STRING]', 'Grep test'

test =
    assets: "/test/assets/"
    require: (module) ->
        require ".#{this.assets}#{module}"
    url: (options) ->
        if options.quick
            url = "file:///#{process.cwd()}#{this.assets}index.html?grep=(slow)&invert=true"
        else
            url = "http://localhost:#{this.port(options)}#{this.assets}"
            url += "?grep=#{options.grep}" if options.grep
        url
    port: (options) ->
        options.port || 3000

task 'test:server', (options) ->
    server = test.require('server')
    server.listen test.port(options)

###
    Examples:
        cake test (open default browser and run all tests)
        cake -q test (run in Chrome, skip slow tests)
        cake -q -b Safari (run in Safari, skip slow tests)
    Browsers: 'Google Chrome', 'Firefox', 'Safari', 'PhantomJS'
###
task 'test', (options) ->
    invoke 'build:dev'
    invoke 'build:test'
    invoke 'test:server' unless options.quick
    
    url = test.url(options)
    browser = options.browser or 'Google Chrome'

    if browser is 'PhantomJS'
        mocha = cp.spawn './node_modules/.bin/mocha-phantomjs', [url]
        mocha.stdout.pipe process.stdout
        mocha.on 'exit', (code) ->
            process.exit(code)

    else
        if not options.browser and not options.quick
            cp.exec """open '#{url}'"""
        else if process.platform is 'darwin'
            browsers = test.require('browsers')
            osa = cp.spawn 'osascript', []
            osa.stdin.write browsers browser, url
            osa.stdin.end()
        else
            cp.exec """open -a "#{browser}" '#{url}'"""

# Coverage
# ==============

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
