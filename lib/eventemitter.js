Rye.define('evententEmitter', function(){

    var util = Rye.require('util')

    function evententEmitter () {
        this.eventents = {}
    }

    function parseeventent (event) {
        var i = event.lastIndexOf('.')
        return {
            name      : (i < 0 ? event : event.substring(0, event.lastIndexOf('.')))
          , namespace : (i < 0 ? '' : event.substring(event.lastIndexOf('.')+1))
        }
    }

    evententEmitter.prototype.on = function (event, handler) {
        ;(this.eventents[event] || (this.eventents[event] = [])).push(handler)
    }

    evententEmitter.prototype.removeListener = function (event, handler) {
        var eventents = this.eventents
          , p = parseeventent(event)

        if (handler){
            var arr = eventents[event]
            arr.splice(arr.indexOf(handler), 1)
            if (arr.length === 0) {
                delete this.eventents[event]
            }

        } else if (p.name && p.namespace) {
            delete this.eventents[event]

        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in eventents) {
                if (parseeventent(e)[part] === p[part]) {
                    delete this.eventents[e]
                }
            }
        }
    }

    function fire (arr, context, args) {
        for (var i = 0, ln = arr.length; i < ln; i++) {
            arr[i].apply(context, args)
        }
    }

    evententEmitter.prototype.emit = function (event) {
        var eventents = this.eventents
          , p = parseeventent(event)
          , args = [].slice.call(arguments, 1)
          , matches = []

        if (p.name && p.namespace) {
            fire(eventents[event], this, args)
        } else {
            var part = p.namespace ? 'namespace' : 'name'
            for (var e in eventents) {
                if (parseeventent(e)[part] === p[part]) {
                    fire(eventents[e], this, args)
                }
            }
        }
    }

    evententEmitter.prototype.once = function (event, handler) {
        function suicide () {
            handler.apply(this, arguments)
            this.removeListener(event, remover)
        }
        this.on(event, suicide)
    }

    return evententEmitter

})
