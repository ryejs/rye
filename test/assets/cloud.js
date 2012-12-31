/**
 * Listen to `runner` events to populate a global
 * `.mochaResults` var which may be used by selenium
 * to report on results.
 *
 *    cloud(mocha.run());
 *
 * @param {Runner} runner
 * @api public
 */

window.cloud = function(runner){
  var failed = [];

  runner.on('fail', function(test, err){
    failed.push({
      title: test.title,
      fullTitle: test.fullTitle(),
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  });

  runner.on('end', function(){
    runner.stats.failed = failed;
    global.mochaResults = runner.stats;
  });
};