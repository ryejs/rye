Rye.define('EventEmitter', function(){

    var util = Rye.require('Util')
      , _slice = Array.prototype.slice
      , _hasOwnProperty = Object.hasOwnProperty

    function EventEmitter () {
        this.events = {}
        this.proxied = {}
    }

    // Adds a handler to the events list
    EventEmitter.prototype.addListener = function (event, handler) {
        var handlers = this.events[event] || (this.events[event] = [])
        handlers.push(handler)
    }

    // Add a handler that can only get called once
    EventEmitter.prototype.once = function (event, handler) {
        function suicide () {
            handler.apply(this, arguments)
            this.removeListener(event, suicide)
        }
        this.on(event, suicide)
    }

    // Removes a handler from the events list
    EventEmitter.prototype.removeListener = function (event, handler) {
        if (event === '*') {
            if (handler) {
                for (event in this.events) {
                    if (_hasOwnProperty.call(this.events, event)){
                        this.removeListener(event, handler)
                    }
                }
            } else {
                this.events = {}
            }
        } else if (handler) {
            var handlers = this.events[event]
            if (handlers) {
                handlers.splice(handlers.indexOf(handler), 1)
                if (handlers.length === 0) {
                    delete this.events[event]
                }
            }
        } else {
            delete this.events[event]
        }
    }

    // Calls all handlers that match the event type
    EventEmitter.prototype.emit = function (event) {
        var handlers = this.events[event]
          , args = _slice.call(arguments, 1)
          , fn, i

        if (handlers) {
            for (i = 0; fn = handlers[i++]; ){
                fn.apply(this, args)
            }
        }
    }

    EventEmitter.prototype.proxy = function (event) {
        var proxy = this.proxied[event]
        if (!proxy) {
            return this.proxied[event] = util.applierLeft(this.emit, this, [event])
        }
        return proxy
    }

    function acceptMultipleEvents (method) {
        var _method = EventEmitter.prototype[method]
        EventEmitter.prototype[method] = function(event){
            var args = _slice.call(arguments, 0)
              , self = this
            if (/\s/.test(event)){
                event.replace(/\S+/g, function(event){
                    args[0] = event
                    _method.apply(self, args)
                })
            } else {
                _method.apply(self, args)
            }
        }
    }

    ;['addListener', 'once', 'removeListener', 'emit'].forEach(acceptMultipleEvents)

    // Alias due to public demand
    EventEmitter.prototype.on = EventEmitter.prototype.addListener

    // Global event bus / pub-sub
    var EE = new EventEmitter

    Rye.subscribe   = EE.addListener.bind(EE)
    Rye.unsubscribe = EE.removeListener.bind(EE)
    Rye.publish     = EE.emit.bind(EE)

    // Export the constructor
    return EventEmitter

})
