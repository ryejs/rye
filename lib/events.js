Rye.define('EventEmitter', function(){

    var util = Rye.require('Util')
      , _slice = Array.prototype.slice

    function EventEmitter () {
        this.events = {}
        this.proxied = {}
    }

    // Adds a handler to the events list
    EventEmitter.prototype.addListener = function (event, handler) {
        var events = this.events[event] || (this.events[event] = [])
        events.push(handler)
    }

    // Alias due to public demand
    EventEmitter.prototype.on = EventEmitter.prototype.addListener

    // Add a handler that can only get called once
    EventEmitter.prototype.once = function (event, handler) {
        function suicide() {
            handler.apply(this, arguments)
            this.removeListener(event, suicide)
        }
        this.on(event, suicide)
    }

    // Removes a handler from the events list
    EventEmitter.prototype.removeListener = function(event, handler){
        if (handler) {
            var handlers = this.events[event]
            handlers.splice(handlers.indexOf(handler), 1)
            if (handlers.length === 0) {
                delete this.events[event]
            }
        } else if (event === '*') {
            this.events = {}
        } else {
            delete this.events[event]
        }
    }

    // Calls all handlers that match the event type
    EventEmitter.prototype.emit = function (event) {
        var handlers = this.events[event]
          , args = _slice.call(arguments, 1)
          , fn, i

        if (handlers && handlers.length > 0) {
            for (i = 0; fn = handlers[i++]; ){
                fn.apply(this, args)
            };
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
        var method = EventEmitter.prototype[method]
        EventEmitter.prototype.method = function(event){
            var args = _slice.call(arguments, 1)
            if (/\S/.test(event)){
                event.replace(/\S+/g, util.applier(method, this, args))
            } else {
                fn.apply(this, args)
            }
        }
    }

    ;['addListener', 'once', 'removeListener', 'emit'].forEach(acceptMultipleEvents)

    // Global event bus / pub-sub
    var EE = new EventEmitter

    Rye.subscribe   = EE.addListener.bind(EE)
    Rye.unsubscribe = EE.removeListener.bind(EE)
    Rye.publish     = EE.emit.bind(EE)

    // Export the constructor
    return EventEmitter

})
