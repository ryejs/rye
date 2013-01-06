mocha.reporter(function(runner){

    var colors = { pass: 32, fail: 31, trace: 90 }
      , color = function (str, type) {
            return (colors[type] && '\u001b[' + colors[type] + 'm' + str + '\u001b[0m') || str
        }
      , logger = function (test, type) {
            logger.n++
            logger[type]++

            var msg = color(type === 'fail' ? 'not ok ' : 'ok ', type)
            msg += logger.n + ' ' + test.fullTitle().replace(/#/g, '')
            type == 'pending' && (msg += ' # SKIP -')

            console.log(msg)
        }
    logger.n = 0

    ;['pass', 'fail', 'pending'].forEach(function(type){
        logger[type] = 0
        runner.on(type, function(test){
            logger(test, type)
        })
    })

    runner.on('start', function(){
        console.log('1..' + runner.grepTotal(runner.suite))
    })

    runner.on('fail', function(test, err){
        var trace = err.stack.replace(/^/gm, '    ')
        console.log(color(trace, 'trace'))
    })

    runner.on('end', function(){
        console.log('# tests ' + (logger['pass'] + logger['fail']))
        console.log('# pass ' + logger['pass'])
        console.log('# fail ' + logger['fail'])
        window.callPhantom(logger['fail'])
    })
})