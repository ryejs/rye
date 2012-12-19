Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , EventEmitter = Rye.require('EventEmitter')
      , query = Rye.require('Query')
      , emitters = {}

    function DOMEventEmitter (element) {
        EventEmitter.call(this)
        this.element = element
        this.proxied = {}
    }

    util.inherits(DOMEventEmitter, EventEmitter)

    DOMEventEmitter.prototype.delegateProxy = function (event_id, selector) {
        return function (evt) {
            var match = query.getClosestNode(evt.target || this.element, 'parentNode', selector)
            if ((match && match !== document) || query.matches(evt.target, selector)){
                this.emit(event_id, evt)
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

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new DOMEventEmitter(element))
    }

    function eventID (event, selector) {
        return selector ? event + '@' + selector : event
    }

    function addHandler (element, event, selector, handler) {
        var emitter = getEmitter(element)
          , event_id = eventID(event, selector)

        emitter.addListener(event_id, handler)

        if (!emitter.proxied[event_id]) {
            element.addEventListener(event, emitter.proxy(event_id, selector), false)
        }
    }

    function removeHandler (element, event, selector, handler) {
        var emitter = getEmitter(element)
          , event_id = eventID(event, selector)
          , proxy = emitter.proxied[event_id]

        emitter.removeListener(event_id, handler)

        if (!emitter.events[event_id] || emitter.events[event_id].length === 0) {
            element.removeEventListener(event, proxy, false)
            emitter.proxied[event_id] = null
        }
    }

    function addListener (element, event, selector, handler) {
        if (!handler && typeof(selector) == 'function') {
            handler = selector, selector = null
        }
        // Can't directly send to emitter because of proxy name in addHandler
        event.replace(/\S+/g, function (event) {
            addHandler(element, event, selector, handler)
        })
    }

    function removeListener (element, event, selector, handler) {
        if (!handler && typeof(selector) == 'function') {
            handler = selector, selector = null
        }
        removeHandler(element, event, selector, handler)
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

    function trigger (element, event, data) {
        if (event instanceof Event) {
            event.data = data
            element.dispatchEvent(event)
        } else {
            event.replace(/\S+/g, function (event) {
                var DOMEvent = createEvent(event)
                DOMEvent.data = data
                element.dispatchEvent(DOMEvent)
            })
        }
    }

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
