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
    'lib/touch-events.js'
    'lib/ajax.js'
]

[minifiers, flour.minifiers.js] = [flour.minifiers.js, null]

task 'build:lib', ->
    try fs.mkdirSync 'dist'
    bundle sources, 'dist/rye.js', ->
        flour.minifiers.js = minifiers
        bundle sources, 'dist/rye.min.js', ->
            flour.minifiers.js = null            

# Development
# ===========

task 'watch', ->
    invoke 'build:lib'
    invoke 'build:test'

    watch 'test/assets/index.html', -> invoke 'build:test'
    watch 'test/*.coffee', -> invoke 'build:test'

    watch 'lib/*.js', -> invoke 'build:lib'

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
# =======

option '-b', '--browser [BROWSER]', 'Browser for test tasks'
option '-q', '--quick', 'Skip slow tests'
option '-p', '--port', 'Server port'

task 'build:test', ->
    bundle 'test/*.coffee', 'test/spec.js'

task 'test', (options) ->

    invoke 'build:test'

    port = options.port || 3000
    url = "http://localhost:#{port}/"

    testServer = require('./test-server')
    testServer.listen port

    ###
    Examples:
        cake test (open default browser and run all tests)
        cake -q test (run in Chrome, skip slow tests)
        cake -q -b Safari (run in Safari, skip slow tests)
    Browsers: 'Google Chrome', 'Firefox', 'Safari'
    ###
    
    testScript = require('./test-browsers')
    browser = options.browser or 'Google Chrome'
    test_url = "#{url}test/assets/index.html?grep=TouchEvents&invert=true"

    if not options.browser and not options.quick
        cp.exec """open '#{test_url}'"""
    else if process.platform is 'darwin'
        osa = cp.spawn 'osascript', []
        osa.stdin.write testScript browser, test_url
        osa.stdin.end()
    else
        cp.exec """open -a "#{browser}" '#{test_url}'"""

# Coverage
# =======

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
