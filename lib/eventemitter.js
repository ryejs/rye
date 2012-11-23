Rye.define('EventEmitter', function(){

    var util = require('util')

    function EventEmitter(){
        this.events = {}
    }

    function parseEvent (ev) {
        var i = ev.lastIndexOf('.')
        return {
            name: i < 0 ? ev : ev.substring(0, ev.lastIndexOf('.'))
          , namespace: i < 0 ? '' : ev.substring(ev.lastIndexOf('.')+1)
        }
    }

    EventEmitter.prototype.on = function (ev, handler) {
        ;(this.events[ev] || (this.events[ev] = []).push(handler)
    }

    EventEmitter.prototype.removeListener = function (ev, handler) {
        var events = this.events
          , p = parseEvent(ev)

        if (handler){
            var arr = events[ev]
            arr.splice(arr.indexOf(handler), 1)

        } else if (p.name && p.namespace) {
            delete this.events[ev]

        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (parseEvent(e)[part] === p[part]) {
                    delete this.events[e]
                }
            }
        }
    }

    function fire (arr, context, args) {
        for (var i = 0, ln = arr.length; i < ln; i++) {
            arr[i].apply(context, args)
        }
    }

    EventEmitter.prototype.emit = function (ev) {
        var events = this.events
          , p = parseEvent(ev)
          , args = [].slice.call(arguments, 1)
          , matches = []

        if (p.name && p.namespace) {
            var arr = events[ev]
            fire(events[ev], this, args)
        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in events) {
                if (parseEvent(e)[part] === p[part]) {
                    fire(events[e], this, args)
                }
            }
        }
    }

    EventEmitter.prototype.once = function (ev, handler) {

        function suicide () {
            handler.apply(this, arguments)
            this.removeListener(ev, remover)
        }

        this.on(ev, suicide)
    }

})