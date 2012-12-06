Rye.define('Event', function(){

    function _parseEvent(event) {
        var i = event.lastIndexOf('.')
        return {
            name      : (i < 0 ? event : event.substring(0, i))
          , namespace : (i < 0 ? ''    : event.substring(i + 1))
        }
    }

    function _fire(array, context, args) {
        for (var i = 0, ln = array.length; i < ln; i++) {
            array[i].apply(context, args)
        }
    }

    // - `on` | `addEventListener`
    // - `off` | `removeEventListener`
    // - `trigger` | `emit` | `dispatchEvent`
    // - `hasEventListener`

    function EventEmitter () {
        this.events = {}
    }

    EventEmitter.prototype.on = function(event, handler){
        (this.events[event] || (this.events[event] = [])).push(handler)
    }

    EventEmitter.prototype.removeListener = function(event, handler){
        var events = this.events
          , p = _parseEvent(event)

        if (handler){
            var array = events[event]
            array.splice(array.indexOf(handler), 1)
            if (array.length === 0) {
                delete this.events[event]
            }

        } else if (p.name && p.namespace) {
            delete this.events[event]

        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (_parseEvent(e)[part] === p[part]) {
                    delete this.events[e]
                }
            }
        }
    }

    EventEmitter.prototype.emit = function(event){
        var events = this.events
          , p = _parseEvent(event)
          , args = [].slice.call(arguments, 1)

        if (p.name && p.namespace) {
            _fire(events[event], this, args)
        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (_parseEvent(e)[part] === p[part]) {
                    _fire(events[e], this, args)
                }
            }
        }
    }

    EventEmitter.prototype.once = function(event, handler){
        function suicide() {
            handler.apply(this, arguments)
            this.removeListener(event, suicide)
        }
        this.on(event, suicide)
    }


    return {
        emitter: EventEmitter
    }

})
