var $ = Rye
  , EventEmitter = $.require('Events').EventEmitter


Benchmark.prototype.onError = function (e) {
    throw e.target.error
}

Benchmark.prototype.setup = function() {
    var bb  = _.extend({}, Backbone.Events)
      , rye = new EventEmitter

    var numEvents = 3
      , numListeners = 100
      , objs = [bb, rye]

    _.times(numEvents, function (n) {
        _.times(numListeners, function () {
            _.invoke(objs, 'on', 'event' + n, function () {})
        })
    })
}


var suite = new Benchmark.Suite('Event triggering')

var next = 0

function setRunning(idx){
    $('#test-' + idx).find('p')
        .addClass('running')
        .text('Running...')
}

suite
.add('Rye', function(){
    for (var i = 0; i < numEvents; i++) {
        rye.emit('event'+i, 1, 2, 3)
    }
})
.add('Backbone', function(){
    for (var i = 0; i < numEvents; i++) {
        bb.trigger('event'+i, 1, 2, 3)
    }
})
.on('start', function(){
    var results = $('#results')
    this.forEach(function(target){
        var id = 'test-' + target.id
        results.append(
            '<li id="' + id + '">' +
                '<h2>' + target.name + '</h2>' +
                '<p>...</p>' +
            '</li>'
        )
    })
    setRunning(++next)
})
.on('cycle', function(e){
    setRunning(++next)
    var target = e.target
    $('#test-' + target.id).find('p')
        .text(target.toString().replace(target.name + ' x ', ''))
        .addClass('done')

    console.log(target.toString())
})
.on('complete', function(){
    var fastest = this.filter('fastest')
    $('#test-' + fastest.id).addClass('fastest')
})
.run({ async: true })
