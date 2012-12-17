Rye.define('Events', function(){

    var util = Rye.require('Util')

    function parseEvent (event, map) {
        if (typeof event != 'string') {
            return event
        }
        var i = event.lastIndexOf('.')
          , name = i < 0 ? event : event.substring(0, i)
          
        return {
            name      : (map && map[name]) || name
          , namespace : (i < 0 ? ''    : event.substring(i + 1))
        }        
    }

    function fire (array, context, args) {
        for (var i = 0, ln = array.length; i < ln; i++) {
            array[i].apply(context, args)
        }
    }

    function EventEmitter () {
        this.events = {}
    }

    EventEmitter.prototype.on = function (event, handler) {
        (this.events[event] || (this.events[event] = [])).push(handler)
    }

    EventEmitter.prototype.removeListener = function(event, handler){
        var events = this.events
          , evt = parseEvent(event)

        if (handler){
            var array = events[event]
            array.splice(array.indexOf(handler), 1)
            if (array.length === 0) {
                delete this.events[event]
            }

        } else if (evt.name && evt.namespace) {
            delete this.events[event]

        } else {
            var part = evt.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (parseEvent(e)[part] === evt[part]) {
                    delete this.events[e]
                }
            }
        }
    }

    EventEmitter.prototype.emit = function (event) {
        var events = this.events
          , evt = parseEvent(event)
          , args = [].slice.call(arguments, 1)

        if (evt.name && evt.namespace) {
            fire(events[event], this, args)
        } else {
            var part = evt.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (parseEvent(e)[part] === evt[part]) {
                    fire(events[e], this, args)
                }
            }
        }
    }

    EventEmitter.prototype.once = function (event, handler) {
        function suicide() {
            handler.apply(this, arguments)
            this.removeListener(event, suicide)
        }
        this.on(event, suicide)
    }

    var pubsub = new EventEmitter()

    return {
        parseEvent   : parseEvent
      , fire         : fire
      , EventEmitter : EventEmitter
      , subscribe    : Rye.subscribe   = pubsub.on.bind(pubsub)
      , unsubscribe  : Rye.unsubscribe = pubsub.removeListener.bind(pubsub)
      , publish      : Rye.publish     = pubsub.emit.bind(pubsub)
    }

})