Rye.define( 'Promises', function() {

    var util = Rye.require('Util')
      , tuples = [
        // [ promise method, deferred method, state ]
            [ 'done', 'fulfill', 'fulfilled' ]
          , [ 'fail', 'reject', 'rejected' ]
          , [ 'progress', 'notify' ]
        ]

    function create (func) {
        var state = 'pending'
          , handlers = {}
          , promise = {}
          , deferred = {}

        function fireSync(fns, value, context) {
            if (context == null) { context = promise }
            fns.forEach(function(fn) {
                if (util.is('function', fn)) {
                    fn.call(context, value, promise)
                }
            })
        }

        function fire(fns, value, context) {
            setTimeout(function () { fireSync(fns, value, context) }, 1)
        }

        tuples.forEach(function(tuple) {
            handlers[tuple[0]] = []
            handlers[tuple[0]+'Args'] = null
            promise[tuple[0]] = function(fns) {
                if (!util.is('array', fns)) { fns = [ fns ] }
                if (tuple[2] == null || state === 'pending') {
                    handlers[tuple[0]].push.apply(handlers[tuple[0]], fns)
                }
                else if (tuple[2] === state) {
                    fire(fns, handlers[tuple[0]+'Args'])
                }
                return this
            }
            deferred[tuple[1]+'With'] = function(context, args) {
                if (tuple[2] != null) {
                    if (state !== 'pending') { return this }
                    state = tuple[2]
                }
                if (args == null) { args = state }
                handlers[tuple[0]+'Args'] = args
                fireSync(handlers[tuple[0]], args, context)
                handlers[tuple[0]].length = 0
                return this
            }
            deferred[tuple[1]] = function(args) {
                return deferred[tuple[1]+'With'](this, args)
            }
        })

        promise.state = function () { return state }

        promise.always = function(fns) {
            return promise.done(fns).fail(fns)
        }

        promise.then = function(onFulfilled, onRejected, onNotified) {
            return create(function (newDef) {
                var wrapper = function (callback) {
                    var handler = function(value) {
                        var ret
                        try {
                            ret = callback(value)
                        }
                        catch (e) {
                            newDef.reject(e)
                            return // nothing
                        }
                        if (typeof ret !== 'undefined' && ret !== null) {
                            // Assume ret is a promise if a then method exists
                            if (util.is('function', ret.then)) {
                                ret.then(
                                    function(val) { newDef.fulfill(val) }
                                  , function(val) { newDef.reject(val) }
                                  , function(val) { newDef.notify(val) }
                                )
                                return // nothing
                            }
                            newDef.fulfill(ret)
                        }
                    }
                    return handler
                }
                if (util.is('function', onFulfilled)) { promise.done(wrapper(onFulfilled)) }
                if (util.is('function', onRejected)) { promise.fail(wrapper(onRejected)) }
                if (util.is('function', onNotified)) { promise.progress(onNotified) }
            }).promise()
        }

        promise.promise = function() { return promise }

        // For greater flexability alias resolve to fulfill.
        deferred.resolve = deferred.fulfill
        deferred.resolveWith = deferred.fulfillWith

        util.extend(deferred, promise)

        if (func != null) {
            func.call(deferred, deferred)
        }

        return deferred
    }

    function when (/* ... */) {
        var newDef = create()
          , doneCount = 0

        Array.prototype.forEach.call(arguments, function(promise) {
            doneCount++
            promise.done(function(value) {
                if (0 === --doneCount) {
                    newDef.fulfill(value)
                }
            })
            promise.fail(function(reason) { newDef.reject(reason) })
            promise.progress(function(stat) { newDef.notify(stat) })
        })

        return newDef.promise()
    }

    return {
        create   : create
      , when     : when
    }
})
