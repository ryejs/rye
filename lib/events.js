Rye.define('Events', function(){

    var util = Rye.require('Util')
      , query = Rye.require('Query')
      , _slice = Array.prototype.slice
      , emitterUid = 0

    // General-purpose event emitter
    // -----------------------------

    function EventEmitter () {
        this.events = {}
        this.context = null
        this.listeners = {}
        this.buckets = { events: true }
        this.uid = ++emitterUid + ''
    }

    EventEmitter.prototype.defaultBucket = 'events'

    EventEmitter.prototype.getBucket = function (bucket) {
        if (bucket && bucket !== 'events') {
            bucket = 'events_' + bucket
            this.buckets[bucket] = true
            this[bucket] || (this[bucket] = {})
            return bucket
        }
        return this.defaultBucket
    }

    // Adds a handler to the events list
    EventEmitter.prototype.addListener = function (event, handler, bucket) {
        var bucket = this.getBucket(bucket)
          , handlers = this[bucket][event] || (this[bucket][event] = [])

        handlers.push(handler)
        return this
    }

    // Add a handler that can only get called once
    EventEmitter.prototype.once = function (event, handler, bucket) {
        var self = this
        function suicide () {
            handler.apply(this, arguments)
            self.removeListener(event, suicide, bucket)
        }
        return this.addListener(event, suicide, bucket)
    }

    // Removes a handler from the events list
    EventEmitter.prototype.removeListener = function (event, handler, bucket) {
        var self = this
          , bucket = this.getBucket(bucket)
          , handlers = this[bucket][event]

        if (event === '*') {
            if (!handler && bucket === this.defaultBucket) {
                util.each(this.buckets, function(n, bucket){
                    self[bucket] = {}
                })
            } else if (!handler) {
                this[bucket] = {}
            } else {
                util.each(this[bucket], function(handlers, event){
                    self.removeListener(event, handler, bucket)
                })
            }
        } else if (handler && handlers) {
            handlers.splice(handlers.indexOf(handler), 1)
            if (handlers.length === 0) {
                delete this[bucket][event]
            }
        } else {
            delete this[bucket][event]
        }
        return this
    }

    // Calls all handlers that match the event type
    EventEmitter.prototype.emit = function (event) {
        var self = this
          , args = _slice.call(arguments, 1)
          , context = this.context || this

        util.each(this.buckets, function(n, bucket){
            util.each(self[bucket][event], function(fn) {
                fn.apply(context, args)
            })
        })

        return this
    }

    EventEmitter.prototype.proxy = function (event) {
        return util.applyLeft(this, this.emit, [event])
    }

    EventEmitter.prototype.listenTo = function (target, event, handler) {
        var uid = target.uid || (target.uid = util.uid('ee'))
        this.listeners[uid] = target
        target.addListener(event, handler, this.uid)
        return this
    }

    EventEmitter.prototype.stopListening = function (target, event, handler) {
        var listeners = target ? [target] : this.listeners
          , event = event || '*'
          , bucket = this.uid

        util.each(listeners, function(target){
            target.removeListener(event, handler, bucket)
        })

        return this
    }


    // Utility methods
    // -----------------------------

    var emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new DOMEventEmitter(element))
    }

    function getType (event) {
        var index = event.indexOf(' ')
        return index > 0 ? event.substr(0, index) : event
    }

    function getSelector (event) {
        var index = event.indexOf(' ')
        return index > 0 ? event.substr(index) : ''
    }

    function createEvent (type, properties) {
        if (typeof type != 'string') {
            type = type.type
        }
        var isMouse = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(type) != -1
          , event = document.createEvent(isMouse ? 'MouseEvent' : 'Event')
        if (properties) {
            util.extend(event, properties)
        }
        event.initEvent(type, true, true)
        return event
    }

    // DOM event emitter
    // -----------------------------

    /*
        Creates one event emitter per element, proxies DOM events to it. This way
        we can keep track of the functions so that they can be removed from the
        elements by reference when you call .removeListener() by event name.
    */

    function DOMEventEmitter (element) {
        EventEmitter.call(this)
        this.element = element
        this.proxied = {}
    }

    util.inherits(DOMEventEmitter, EventEmitter)

    DOMEventEmitter.prototype._proxy = function (event) {
        return function (DOMEvent) {
            var selector = getSelector(event)
              , context = this.element
            // delegate behavior
            if (selector) {
                context = DOMEvent.target
                while (context && !query.matches(context, selector)) {
                    context = context !== this.element && context.parentNode
                }
                if (!context || context == this.element) {
                    return
                }
            }
            this.context = context
            this.emit(event, DOMEvent, this.element)
        }.bind(this)
    }

    DOMEventEmitter.prototype.proxy = function (event) {
        return this.proxied[event] || (this.proxied[event] = this._proxy(event))
    }

    DOMEventEmitter.prototype.addListener = function (event, handler) {
        EventEmitter.prototype.addListener.call(this, event, handler)
        if (!this.proxied[event]) {
            this.element.addEventListener(getType(event), this.proxy(event), false)
        }
        return this
    }

    DOMEventEmitter.prototype.removeListener = function (event, handler) {
        if (event.indexOf('*') >= 0) {
            var self = this
              , re = new RegExp('^' + event.replace('*', '\\b'))
            // *      : remove all events
            // type * : remove delegate events
            // type*  : remove delegate and undelegate
            util.each(this.events, function(handlers, event){
                if (re.test(event)) {
                    self.removeListener(event, handler)
                }
            })
        } else {
            var proxy = this.proxied[event]
            EventEmitter.prototype.removeListener.call(this, event, handler)
            if (!this.events[event] && proxy) {
                this.element.removeEventListener(getType(event), proxy, false)
                delete this.proxied[event]
            }
        }
        return this
    }

    function acceptMultipleEvents (method) {
        var _method = DOMEventEmitter.prototype[method]
        DOMEventEmitter.prototype[method] = function (event, handler) {
            var self = this
            if (typeof event !== 'string') {
                util.each(event, function(handler, event){
                    _method.call(self, event, handler)
                })
            } else {
                _method.call(self, event, handler)
            }
            return self
        }
    }

    ;['addListener', 'once', 'removeListener'].forEach(acceptMultipleEvents)

    DOMEventEmitter.prototype.destroy = function () {
        return this.removeListener('*')
    }

    DOMEventEmitter.prototype.trigger = function (event, data) {
        if (!(event instanceof window.Event)) {
            event = createEvent(event)
        }
        event.data = data
        this.element.dispatchEvent(event)
        return this
    }

    // Exported methods
    // -----------------------------

    var exports = {}

    function emitterProxy (method, element, event, handler) {
        getEmitter(element)[method](event, handler)
    }

    ;['addListener', 'removeListener', 'once', 'trigger'].forEach(function(method){
        // Create a function proxy for the method
        var fn = util.curry(emitterProxy, method)
        // Exports module and rye methods
        exports[method] = fn
        this[method] = this.iterate(fn)
    }.bind(this))

    // Aliases
    // -----------------------------

    ;[EventEmitter.prototype, DOMEventEmitter.prototype, this].forEach(function(obj){
        obj.on = obj.addListener
    })

    // Global event bus / pub-sub
    // -----------------------------

    var EE = new EventEmitter

    Rye.subscribe   = EE.addListener.bind(EE)
    Rye.unsubscribe = EE.removeListener.bind(EE)
    Rye.publish     = EE.emit.bind(EE)


    return {
        EventEmitter    : EventEmitter
      , DOMEventEmitter : DOMEventEmitter
      , getEmitter      : getEmitter
      , createEvent     : createEvent
      , addListener     : exports.addListener
      , once            : exports.once
      , removeListener  : exports.removeListener
      , trigger         : exports.trigger
    }
})
