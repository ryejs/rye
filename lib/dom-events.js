Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , EventEmitter = Rye.require('EventEmitter')
      , query = Rye.require('Query')
      , emitters = {}

    function getEmitter (element) {
        var id = util.getUid(element)
        return emitters[id] || (emitters[id] = new EventEmitter)
    }

    function addHandler (element, event, handler) {
        var emitter = getEmitter(element)
        emitter.addListener(event, handler)
        if (!emitter.proxied[event]){
            element.addEventListener(event, emitter.proxy(event), false)
        }
    }

    function removeHandler (element, event, handler) {
        var emitter = getEmitter(element)
        emitter.removeListener(event, handler)
        if (emitter.events[event].length === 0) {
            element.removeListener(event, emitter.proxy(event), false)
        }
    }

    function addListener (element, event, selector, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector, selector = null;
        }
        // Can't directly send to emitter because of proxy name in addHandler
        event.replace(/\S+/g, function (event) {
            addHandler(element, event, callback)
        })
    }

    function removeListener (element, event, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector, selector = null;
        }

        var emitter = getEmitter(element)
        emitter.removeListener(event)
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
