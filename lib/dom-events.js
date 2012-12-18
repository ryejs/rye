Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , EventEmitter = Rye.require('EventEmitter')
      , query = Rye.require('Query')
      , emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
          , emitter = emitters[id]
        if (!emitter) {
            emitter = emitters[id] = new EventEmitter
            emitter.proxies = {}
        }
        return emitter
    }

    function eventID (event, selector) {
        return selector ? event + '@' + selector : event
    }

    function delegateProxy (emitter, element, event, selector) {
        return function (evt) {
            var match = query.getClosestNode(evt.target || element, 'parentNode', selector)
            if ((match && match !== document) || query.matches(evt.target, selector)){
                emitter.emit(eventID(event, selector), evt)
            }
        }
    }

    function addHandler (element, event, selector, handler) {
        var emitter = getEmitter(element)
          , event_id = eventID(event, selector)
    
        emitter.addListener(event_id, handler)
        if (!emitter.proxies[event_id]) {
            // An emitter proxy is a function that calls emitter.emit(event).
            // The delegateProxy also checks for a selector match from the event.target
            var proxy = selector
                ? delegateProxy(emitter, element, event, selector)
                : emitter.proxy(event_id)

            emitter.proxies[event_id] = proxy
            element.addEventListener(event, proxy, false)
        }
    }

    function removeHandler (element, event, selector, handler) {
        var emitter = getEmitter(element)
          , event_id = eventID(event, selector)
          , proxy = emitter.proxies[event_id]

        emitter.removeListener(event_id, handler)
        if (!emitter.events[event_id] || emitter.events[event_id].length === 0) {
            element.removeEventListener(event, proxy, false)
        }
    }

    function addListener (element, event, selector, handler) {
        if (!handler && typeof(selector) == 'function') {
            handler = selector, selector = null;
        }
        // Can't directly send to emitter because of proxy name in addHandler
        event.replace(/\S+/g, function (event) {
            addHandler(element, event, selector, handler)
        })
    }

    function removeListener (element, event, selector, handler) {
        if (!handler && typeof(selector) == 'function') {
            handler = selector, selector = null;
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
