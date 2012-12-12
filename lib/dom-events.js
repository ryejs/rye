Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , events = Rye.require('Events')
      , query = Rye.require('Query')
      , listeners = {}
      , eventIgnoreProperties = /^([A-Z]|layer[XY]$)/

    function callHandler (element, DOMEvent, handler) {
        var eventProxy = { DOMEvent: DOMEvent }
          , matched
        
        if (handler.selector != '*') {
            matched = DOMEvent.target
            while (matched && !query.matches(matched, handler.selector)) {
                matched = matched !== element && matched !== document && matched.parentNode
            }
            if (!matched) {
                return
            }
        }

        for (var key in DOMEvent) {
            if (!eventIgnoreProperties.test(key) && DOMEvent[key] !== undefined) {
                eventProxy[key] = DOMEvent[key]
            }
        }

        if (matched) {
            eventProxy.currentTarget = matched
        }
        handler.callback.apply(element, [eventProxy].concat(event.data))
    }

    function addEvent (element, event) {
        var id = util.getUid(element)
          , eventType = (listeners[id] || (listeners[id] = {}))[event.name]

        if (!eventType) {
            var handlers = []
            eventType = {
                handlers: handlers
              , proxy: function (nativeEvent) {
                    handlers.forEach(function (handler) {
                        callHandler(element, nativeEvent, handler)
                    })
                }
            }
            element.addEventListener(event.name, eventType.proxy, false)
            return listeners[id][event.name] = eventType
        }
    }

    function removeEvent (element, event) {
        var id = util.getUid(element)
          , eventType = listeners[id] && listeners[id][event.name]

        if (!eventType) {
            return
        }
        element.removeEventListener(event.name, eventType.proxy, false)
        delete listeners[id][event.name]
    }

    function createEvent (type, properties) {
        if (typeof type != 'string') {
            data = type
            type = data.type
        }
        var isMouse = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(type) != -1
          , event = document.createEvent(isMouse ? 'MouseEvent' : 'Event')
        if (properties) {
            util.extend(event, properties)
        }
        event.initEvent(type, true, true)
        return event
    }

    function addHandler (element, event, selector, callback) {
        var id = util.getUid(element)
          , eventType = listeners[id] && listeners[id][event.name]
          , handlers = eventType && eventType.handlers
          , handler = {
                event: event
              , selector: selector || '*'
              , callback: callback
            }

        if (!handlers) {
            handlers = addEvent(element, event).handlers
        }

        handlers.push(handler)
    }

    function removeHandler (element, event, selector, callback) {
        var id = util.getUid(element)
          , listener = listeners[id] || {}

        if (event && event.name) {
            var eventType = listener && listener[event.name],
                handlers = eventType && eventType.handlers
            
            if (handlers) {
                handlers.forEach(function (handler, i) {
                    if (
                        (!event.namespace || handler.event.namespace == event.namespace)
                     && (!selector || handler.selector == selector)
                     && (!callback || handler.callback == callback)
                    ) {
                        handlers.splice(i, 1)
                    }
                })

                if (!handlers.length) {
                    removeEvent(element, event)
                }
            }

        } else {
            for (var key in listener) {
                removeHandler(element, { name: key, namespace: event && event.namespace}, selector, callback)
            }
        }
    }
    

    function on (element, event, selector, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector;
            selector = null;
        }

        event.replace(/\S+/g, function (event) {
            event = events.parseEvent(event)
            addHandler(element, event, selector, callback)
        })
    }

    function removeListener (element, event, selector, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector;
            selector = null;
        }

        if (!event || event == '*') {
            removeHandler(element, {}, selector, callback)
        } else {
            event.replace(/\S+/g, function (event) {
                event = events.parseEvent(event)
                removeHandler(element, event, selector, callback)
            })
        }
    }

    function dispatchEvent (element, event, data) {
        if (event instanceof Event) {
            event.data = data
            element.dispatchEvent(event)  
        } else {
            event.replace(/\S+/g, function (event) {
                event = createEvent(event)
                event.data = data
                element.dispatchEvent(event)  
            })
        }
    }


    return {
        createEvent    : createEvent
      , on             : on
      , removeListener : removeListener
      , dispatchEvent  : dispatchEvent
    }

})
