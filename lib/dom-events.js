Rye.define('DOMEventEmitter', function(){

    var util = Rye.require('Util')
      , EventEmitter = Rye.require('EventEmitter')
      , query = Rye.require('Query')
      , emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new DOMEventEmitter(element))
    }

    function parseName (name) {
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

    var DOMEventEmitter = util.inherits(function(element){
        EventEmitter.call(this)
        this.element = element
        this.proxied = {}
    }, EventEmitter)

    DOMEventEmitter.prototype._proxy = function (name) {
        return function (event) {
            var selector = parseName(name).selector
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
            this.element.addEventListener(parseName(name).event, this.proxy(name), false)
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
                this.element.removeEventListener(parseName(name).event, proxy, false)
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

    function emitter (method, element, a, b) {
        getEmitter(element)[method](a, b)
    }

    var methods = {
        addListener    : ['on']
      , once           : ['one']
      , removeListener : ['off']
      , trigger        : null
    }

    // Export all methods and aliases
    Object.keys(methods).forEach(function(method){
        var self = this 
          , aliases = methods[method]
          , fn = util.curry(emitter, method)

        DOMEventEmitter[method] = fn
        self[method] = self.iterate(fn)

        aliases && aliases.forEach(function(alias){
            DOMEventEmitter.prototype[alias] = DOMEventEmitter.prototype[method]
            DOMEventEmitter[alias] = fn
            self[alias] = self[method]
        })
    }.bind(this))

    DOMEventEmitter.getEmitter  = getEmitter
    DOMEventEmitter.createEvent = createEvent

    // Export the constructor
    return DOMEventEmitter

})
