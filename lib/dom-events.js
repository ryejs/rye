Rye.define('DOMEvents', function(){

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
        this.context = element
        this.proxied = {}
    }, EventEmitter)

    DOMEventEmitter.prototype.delegateProxy = function (name) {
        return function (event) {
            var selector = parseName(name).selector
              , matched = query.getClosestNode(event.target || this.element, 'parentNode', selector)
            if ((matched && matched !== document) || query.matches(event.target, selector)){
                this.context = matched
                this.emit(name, event, this.element)
            }
        }.bind(this)
    }

    DOMEventEmitter.prototype.proxy = function (name) {
        var selector = parseName(name).selector
        return this.proxied[name] || (this.proxied[name] =
            selector
              ? this.delegateProxy(name)
              : EventEmitter.prototype.proxy.call(this, name)
        )
    }

    DOMEventEmitter.prototype.addListener = function (name, handler) {
        EventEmitter.prototype.addListener.call(this, name, handler)
        if (!this.proxied[name]) {
            this.element.addEventListener(parseName(name).event, this.proxy(name), false)
        }
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
    }

    DOMEventEmitter.prototype.destroy = function () {
        this.removeListener('*')
    }

    DOMEventEmitter.prototype.trigger = function (event, data) {
        if (!(event instanceof window.Event)) {
            event = createEvent(event)
        }
        event.data = data
        this.element.dispatchEvent(event)
    }

    function emitter (mode, element, a, b) {
        getEmitter(element)[mode](a, b)
    }

    var addListener    = util.curry(emitter, 'addListener')
      , removeListener = util.curry(emitter, 'removeListener')
      , trigger        = util.curry(emitter, 'trigger')

    this.addEventListener    = this.iterate(addListener)
    this.removeEventListener = this.iterate(removeListener)
    this.trigger             = this.iterate(trigger)
    // Aliases
    this.on  = this.addEventListener
    this.off = this.removeEventListener

    return {
        getEmitter     : getEmitter
      , addListener    : addListener
      , removeListener : removeListener
      , trigger        : trigger
      , createEvent    : createEvent
    }

})
