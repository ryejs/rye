Rye.define('DOMEvents', function(){

    var util = Rye.require('Util')
      , events = Rye.require('Events')
      , query = Rye.require('Query')
      , listeners = {}
      , environmentMap = {}
      , eventIgnoreProperties = /^([A-Z]|layer[XY]$)/

    function callHandler (element, DOMEvent, handler) {
        var event = DOMEvent
          , matched
        
        if (handler.selector != '*') {
            matched = DOMEvent.target
            while (matched && !query.matches(matched, handler.selector)) {
                matched = matched !== element && matched !== document && matched.parentNode
            }
            if (!matched) {
                return
            }
            event = createEventProxy(event)
            event.currentTarget = matched
        }
        handler.callback.apply(element, [event].concat(DOMEvent.data))
    }

    function addEvent (element, event) {
        var id = util.getUid(element)
          , evt = events.parseEvent(event)
          , eventType = (listeners[id] || (listeners[id] = {}))[evt.name]

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
            element.addEventListener(evt.name, eventType.proxy, false)
            return listeners[id][evt.name] = eventType
        }
    }

    function removeEvent (element, event) {
        var id = util.getUid(element)
          , evt = events.parseEvent(event)
          , eventType = listeners[id] && listeners[id][evt.name]

        if (!eventType) {
            return
        }
        element.removeEventListener(evt.name, eventType.proxy, false)
        delete listeners[id][evt.name]
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

    function createEventProxy (DOMEvent) {
        var proxy = { DOMEvent: DOMEvent }
          , returnTrue = function(){ return true }
          , returnFalse = function(){ return false }
          , methods = {
                preventDefault: 'isDefaultPrevented'
              , stopImmediatePropagation: 'isImmediatePropagationStopped'
              , stopPropagation: 'isPropagationStopped'
            }

        for (var key in DOMEvent) {
            if (!eventIgnoreProperties.test(key) && DOMEvent[key] !== undefined) {
                proxy[key] = DOMEvent[key]
            }
        }

        for (var name in methods) {
            proxy[name] = function(){
                this[methods[name]] = returnTrue
                return DOMEvent[name].apply(DOMEvent, arguments)
            }
            proxy[methods[name]] = returnFalse
        }
        return proxy
    }

    function addHandler (element, event, selector, callback) {
        var id = util.getUid(element)
          , evt = events.parseEvent(event)
          , eventType = listeners[id] && listeners[id][evt.name]
          , handlers = eventType && eventType.handlers
          , handler = {
                evt: evt
              , selector: selector || '*'
              , callback: callback
            }

        if (!handlers) {
            handlers = addEvent(element, evt).handlers
        }

        handlers.push(handler)
    }

    function removeHandler (element, event, selector, callback) {
        var id = util.getUid(element)
          , evt = events.parseEvent(event)
          , listener = listeners[id] || {}

        if (evt && evt.name) {
            var eventType = listener && listener[evt.name],
                handlers = eventType && eventType.handlers
            
            if (handlers) {
                handlers.forEach(function (handler, i) {
                    if (
                        (!evt.namespace || handler.evt.namespace == evt.namespace)
                     && (!selector || handler.selector == selector)
                     && (!callback || handler.callback == callback)
                    ) {
                        handlers.splice(i, 1)
                    }
                })

                if (!handlers.length) {
                    removeEvent(element, evt)
                }
            }

        } else {
            for (var key in listener) {
                removeHandler(element, { name: key, namespace: evt && evt.namespace}, selector, callback)
            }
        }
    }
    

    function on (element, event, selector, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector;
            selector = null;
        }

        event.replace(/\S+/g, function (event) {
            var evt = events.parseEvent(event, environmentMap)
            addHandler(element, evt, selector, callback)
        })
    }

    function removeListener (element, event, selector, callback) {
        if (!callback && typeof(selector) == 'function') {
            callback = selector;
            selector = null;
        }

        if (!event || event == '*') {
            removeHandler(element, '', selector, callback)
        } else {
            event.replace(/\S+/g, function (event) {
                var evt = events.parseEvent(event, environmentMap)
                removeHandler(element, evt, selector, callback)
            })
        }
    }

    function dispatchEvent (element, event, data) {
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


    this.on = function (event, selector, callback) {
        return this.each(function(element){
            on(element, event, selector, callback)
        })
    }

    this.off = function (event, selector, callback) {
        return this.each(function(element){
            removeListener(element, event, selector, callback)
        })
    }

    this.trigger = function (event, data) {
        return this.each(function(element){
            dispatchEvent(element, event, data)
        })
    }

    // alias
    this.addEventListener = this.on
    this.removeEventListener = this.off
    this.dispatchEvent = this.trigger

    return {
        environmentMap : environmentMap
      , createEvent    : createEvent
      , on             : on
      , removeListener : removeListener
      , dispatchEvent  : dispatchEvent
    }

})
