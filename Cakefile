fs             = require 'fs'
cp             = require 'child_process'
flour          = require 'flour'
async          = require 'cake-async'
rimraf         = require 'rimraf'
util           = require 'util'

flour.minifiers.disable 'js'

cc = (n) -> "\x1B[#{n}m"
console.log """#{cc 32}
  ██ ███  ██    ██   █████         ██   ████  
  ███     ██    ██  ██   ██        ██  ██     
  ██       ██  ██   ███████        ██   ███   
  ██        ████    ██             ██     ██  
  ██         ██      █████  ██  ████   ████   
            ██                                
          ██                                  
#{cc 33}#{cc 7}
#{process.argv[2..].map((s,i)->"#{cc 35-i} #{s.toUpperCase()} ").join("#{cc 39} ")}
#{cc 27}#{cc 36}
"""

# Config
# ==============

sources_base = [
    'lib/rye.js'
    'lib/util.js'
    'lib/data.js'
    'lib/query.js'
    'lib/collection.js'
    'lib/manipulation.js'
    'lib/events.js'
    'lib/style.js'
]

sources_full = sources_base.concat [
    'lib/touch-events.js'
    'lib/promises.js'
    'lib/request.js'
]

option '-l', '--light', 'Light version'

getSources = (o) ->
    if o.light then sources_base else sources_full

getDist = (o, min) ->
    dest = if o.light then 'dist/rye-base' else 'dist/rye'
    dest += if min then '.min.js' else '.js'

# Build & Watch
# ==============

async task 'build:prod', (o, done) ->
    try fs.mkdirSync 'dist'
    flour.minifiers.enable 'js'
    bundle getSources(o), getDist(o, true), ->
        flour.minifiers.disable 'js'
        done()

async task 'build:dev', (o, done) ->
    try fs.mkdirSync 'dist'
    bundle getSources(o), getDist(o), done

async task 'build:test', (o, done) ->
    bundle 'test/*.coffee', 'test/spec.js', done

task 'build', ->
    invoke async 'build:prod'
    invoke async 'build:dev'
    invoke async 'build:test'

task 'watch', ->
    invoke async 'build:dev'
    invoke async 'build:test'
    async.end ->
        watch 'test/*.coffee', -> invoke 'build:test'
        watch 'lib/*.js', -> invoke 'build:dev'

# Clear
# ==============

task 'clear', ->
    rimraf.sync 'dist'
    try fs.unlinkSync 'test/spec.js'

# Lint
# ==============

async task 'lint', (o, done) ->
    flour.linters.js.options =
        forin    : true
        immed    : true
        # indent   : true
        latedef  : true
        newcap   : true
        noarg    : true
        noempty  : true
        nonew    : true
        quotmark : 'single'
        undef    : true
        unused   : true
        asi      : true
        boss     : true
        curly    : true
        eqnull   : true
        laxbreak : true
        laxcomma : true
        sub      : true
        supernew : true
        browser  : true

    flour.linters.js.globals =
        Rye      : true

    lint 'lib/*.js', done

# Testing
# ==============

option '-b', '--browser [BROWSER]', 'Browser for test tasks'
option '-q', '--quick', 'Skip slow tests'
option '-p', '--port', 'Server port'
option '-g', '--grep [STRING]', 'Grep test'

###
    Examples:
        cake test (open default browser and run all tests)
        cake -q test (run in Chrome, skip slow tests)
        cake -q -b Safari (run in Safari, skip slow tests)
    Browsers: 'Google Chrome', 'Firefox', 'Safari', 'PhantomJS'
###
async task 'test', (o, done) ->
    invoke 'build:dev'
    invoke 'build:test'

    assets = "/test/assets/"
    port = o.port || 3000
    if o.quick
        url = "file:///#{process.cwd()}#{assets}index.html?grep=(slow)&invert=true"
    else
        url = "http://localhost:#{port}#{assets}"
        url += "?grep=#{o.grep}" if o.grep

    # server
    unless o.quick
        server = require ".#{assets}server"
        server.listen port
    
    # browser
    browser = o.browser or 'Google Chrome'

    if browser is 'PhantomJS'
        phantomjs = cp.spawn 'phantomjs', [".#{assets}phantomjs.coffee", url]
        phantomjs.stdout.pipe process.stdout
        phantomjs.on 'exit', (code) ->
            done()
            process.exit(code)

    else
        if process.platform is 'darwin'
            browsers = require ".#{assets}browsers-osx"
            osa = cp.spawn 'osascript'
            osa.stdin.write browsers browser, url
            osa.stdin.end()
        else
            cp.exec "open -a '#{browser}' '#{url}'"
        done()

# Coverage
# ==============

task 'build:cov', ->
    rimraf.sync '.coverage'
    cp.exec 'jscoverage lib .coverage', (err) ->
        if err?.code is 127
            console.log 'cov requires github.com/visionmedia/node-jscoverage'
            return
        cov_sources = sources_full.map (f) -> f.replace('lib/', '.coverage/')
        flour.minifiers.disable 'js'
        bundle cov_sources, '.coverage/rye.instrumented.js'

# Open test harness in a browser so we don't have
# to run a server or know the absolute URL
task 'cov', ->
    invoke 'build:cov'
    cp.exec 'open test/assets/coverage.html'
