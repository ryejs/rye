Rye.define('Events', function(){

    var util = Rye.require('Util')
      , query = Rye.require('Query')
      , _slice = Array.prototype.slice

    // General-purpose event emitter
    // -----------------------------

    function EventEmitter () {
        this.events = {}
        this.context = null
    }

    // Adds a handler to the events list
    EventEmitter.prototype.addListener = function (event, handler) {
        var handlers = this.events[event] || (this.events[event] = [])
        handlers.push(handler)
        return this
    }

    // Add a handler that can only get called once
    EventEmitter.prototype.once = function (event, handler) {
        var self = this
        function suicide () {
            handler.apply(this, arguments)
            self.removeListener(event, suicide)
        }
        return this.on(event, suicide)
    }

    // Removes a handler from the events list
    EventEmitter.prototype.removeListener = function (event, handler) {
        var self = this
          , handlers = this.events[event]
        if (event === '*') {
            if (!handler) {
                this.events = {}
            } else {
                Object.keys(this.events).forEach(function(event){
                    self.removeListener(event, handler)
                })
            }
        } else if (handler && handlers) {
            handlers.splice(handlers.indexOf(handler), 1)
            if (handlers.length === 0) {
                delete this.events[event]
            }
        } else {
            delete this.events[event]
        }
        return this
    }

    // Calls all handlers that match the event type
    EventEmitter.prototype.emit = function (event) {
        var handlers = this.events[event]
          , args = _slice.call(arguments, 1)
          , fn, i

        if (handlers) {
            for (i = 0; fn = handlers[i++]; ){
                fn.apply(this.context || this, args)
            }
        }
        return this
    }

    EventEmitter.prototype.proxy = function (event) {
        return util.applier('left', this.emit, this, [event])
    }

    // Alias due to public demand
    EventEmitter.prototype.on = EventEmitter.prototype.addListener


    // Utility methods
    // -----------------------------

    var emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new DOMEventEmitter(element))
    }

    function parseEvent (name) {
        var index = name.indexOf(' ')
        return {
            event    : index > 0 ? name.substr(0, index) : name
          , selector : index > 0 ? name.substr(index) : ''
        }
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

    DOMEventEmitter.prototype._proxy = function (name) {
        return function (event) {
            var selector = parseEvent(name).selector
              , context = this.element
            // delegate behavior
            if (selector) {
                context = event.target
                while (context && !query.matches(context, selector)) {
                    context = context !== this.element && context.parentNode
                }
                if (!context || context == this.element) {
                    return
                }
            }
            this.context = context
            this.emit(name, event, this.element)
        }.bind(this)
    }

    DOMEventEmitter.prototype.proxy = function (name) {
        return this.proxied[name] || (this.proxied[name] = this._proxy(name))
    }

    DOMEventEmitter.prototype.addListener = function (name, handler) {
        EventEmitter.prototype.addListener.call(this, name, handler)
        if (!this.proxied[name]) {
            this.element.addEventListener(parseEvent(name).event, this.proxy(name), false)
        }
        return this
    }

    DOMEventEmitter.prototype.removeListener = function (name, handler) {
        if (name.indexOf('*') >= 0) {
            var self = this
              , re = new RegExp('^' + name.replace('*', '\\b'))
            // *      : remove all events
            // type * : remove delegate events
            // type*  : remove delegate and undelegate
            Object.keys(this.events).forEach(function(name){
                if (re.test(name)) {
                    self.removeListener(name, handler)
                }
            })
        } else {
            var proxy = this.proxied[name]
            EventEmitter.prototype.removeListener.call(this, name, handler)
            if (!this.events[name] && proxy) {
                this.element.removeEventListener(parseEvent(name).event, proxy, false)
                delete this.proxied[name]
            }
        }
        return this
    }

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

    function acceptMultipleEvents (method) {
        var _method = DOMEventEmitter.prototype[method]
        DOMEventEmitter.prototype[method] = function (name, handler) {
            var self = this
            if (typeof name !== 'string') {
                Object.keys(name).forEach(function(key){
                    _method.call(self, key, name[key])
                })
            } else {
                _method.call(self, name, handler)
            }
            return self
        }
    }

    ;['addListener', 'once', 'removeListener'].forEach(acceptMultipleEvents)

    // alias
    DOMEventEmitter.prototype.on = DOMEventEmitter.prototype.addListener

    // Exported methods
    // -----------------------------

    function emitter (method, element, a, b) {
        getEmitter(element)[method](a, b)
    }
    var addListener    = util.curry(emitter, 'addListener')
      , once           = util.curry(emitter, 'once')
      , removeListener = util.curry(emitter, 'removeListener')
      , trigger        = util.curry(emitter, 'trigger')

    // Rye methods
    // -----------------------------

    this.addListener    = this.iterate(addListener)
    this.once           = this.iterate(once)
    this.removeListener = this.iterate(removeListener)
    this.trigger        = this.iterate(trigger)
    
    this.on = this.addListener

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
      , addListener     : addListener
      , once            : once
      , removeListener  : removeListener
      , trigger         : trigger
    }
})
