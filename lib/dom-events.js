Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , EventEmitter = Rye.require('EventEmitter')
      , query = Rye.require('Query')
      , emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new DOMEventEmitter(element))
    }

    function eventID (event, selector) {
        return selector ? event + '@' + selector : event
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

    DOMEventEmitter.prototype.delegateProxy = function (event_id, selector) {
        return function (event) {
            var matched = query.getClosestNode(event.target || this.element, 'parentNode', selector)
            if ((matched && matched !== document) || query.matches(event.target, selector)){
                this.context = matched
                this.emit(event_id, event, this.element)
            }
        }.bind(this)
    }

    DOMEventEmitter.prototype.proxy = function (event_id, selector) {
        return this.proxied[event_id] || (this.proxied[event_id] =
            selector
              ? this.delegateProxy(event_id, selector)
              : EventEmitter.prototype.proxy.call(this, event_id)
        )
    }

    DOMEventEmitter.prototype.addListener = function (event, selector, handler) {
        var event_id = eventID(event, selector)

        EventEmitter.prototype.addListener.call(this, event_id, handler)
        if (!this.proxied[event_id]) {
            this.element.addEventListener(event, this.proxy(event_id, selector), false)
        }
    }

    DOMEventEmitter.prototype.removeListener = function (event, selector, handler) {
        var self = this
          , event_id = eventID(event, selector)
          , proxy = this.proxied[event_id]

        if (event === '*') {
            Object.keys(this.events).forEach(function(event){
                self.removeListener(event, selector, handler)
            })
        } else {
            EventEmitter.prototype.removeListener.call(this, event_id, handler)
            if (!this.events[event_id] && proxy) {
                this.element.removeEventListener(event, proxy, false)
                this.proxied[event_id] = null
            }
        }
    }

    DOMEventEmitter.prototype.trigger = function (event, data) {
        if (!(event instanceof window.Event)) {
            event = createEvent(event)
        }
        event.data = data
        this.element.dispatchEvent(event)
    }

    function listener (mode, element, event, selector, handler) {
        if (!handler && typeof(selector) == 'function') {
            handler = selector, selector = null
        }
        getEmitter(element)[mode + 'Listener'](event, selector, handler)
    }

    function trigger (element, event, data) {
        getEmitter(element).trigger(event, data)
    }

    var addListener    = util.curry(listener, 'add')
      , removeListener = util.curry(listener, 'remove')

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
