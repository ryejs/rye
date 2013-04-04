suite "Promises", ->

    promise_test = (obj) ->
        have_tuples = [ "then", "done", "fail", "progress", "always" ]
        not_have_tuples = [ "fulfill", "reject", "notify" ]
        assert.property(obj, tuple) for tuple in have_tuples
        assert.notProperty(obj, tuple) for tuple in not_have_tuples

    suite "methods", ->

        setup ->
            @callback_count = 0

        test "create", ->
            obj = promises.create()
            assert.property obj, "then" # Duck-typing
            obj = promises.create => @callback_count++
            assert.equal @callback_count, 1, "configure function was called"

        tuples = [
            # [ callback method, resolution method ]
            [ "done", "fulfill" ]
            [ "fail", "reject" ]
            [ "progress", "notify" ]
        ]
        for promise_tuple in tuples
            do (promise_tuple) ->
                test promise_tuple[0], (asyncDone) ->
                    obj = promises.create()
                    result = obj[promise_tuple[0]] => @callback_count++
                    assert.property result, "then" # Duck-typing
                    assert.equal @callback_count, 0, "callback should not be called"
                    obj[promise_tuple[0]] (value) =>
                        assert.equal @callback_count, 1, "callback should be called"
                        assert.equal value, "test_#{promise_tuple[1]}_value", "callback should be called with correct value"
                        asyncDone()
                    obj[promise_tuple[1]]("test_#{promise_tuple[1]}_value")

        test "always", ->
            for always_tuple in [ "fulfill", "reject" ]
                @callback_count = 0
                obj = promises.create()
                obj.always => @callback_count++
                assert.equal @callback_count, 0, "callback should not be called (#{always_tuple})"
                obj[always_tuple]()
                assert.equal @callback_count, 1, "callback should be called (#{always_tuple})"

        test "promise", -> promise_test promises.create().promise()

        test "resolve", ->
            obj = promises.create()
            assert.equal obj.resolve, obj.fulfill, "resolve should be an alias"

        test "resolveWith", ->
            obj = promises.create()
            assert.equal obj.resolveWith, obj.fulfillWith, "resolveWith should be an alias"

        for deferred_tuple in tuples
            do (deferred_tuple) ->
                test "#{deferred_tuple[1]}", ->
                    obj = promises.create()
                    obj[deferred_tuple[0]] (x) => @callback_count++
                    obj[deferred_tuple[1]]("test_#{deferred_tuple[1]}_args")
                    assert.equal @callback_count, 1, "callback should be called (#{deferred_tuple[1]})"
                test "#{deferred_tuple[1]}With", ->
                    obj = promises.create()
                    obj[deferred_tuple[0]] (x) -> @callback_count++
                    obj["#{deferred_tuple[1]}With"](@, "test_#{deferred_tuple[1]}With_args")
                    assert.equal @callback_count, 1, "callback should be called (#{deferred_tuple[1]}With)"
                return

        test "methods should chain properly", ->
            props = [ "fulfill", "reject", "notify" ]
            obj = promises.create()
                .fulfill()
                .reject()
                .notify()
                .done()
                .fail()
                .progress()
            assert.property(obj, prop) for prop in props
            obj = promises.create()
                .fulfill()
                .reject()
                .notify()
                .promise() # Returns a promise object instead of original
                .done()
                .fail()
                .progress()
            assert.notProperty(obj, prop) for prop in props
            return

    suite "Promise States", ->

        test "when pending, a promise may transition to either the fulfilled or rejected state", ->
            state_tuples = [
                [ "fulfill", "fulfilled" ]
                [ "reject", "rejected" ]
            ]
            for state_tuple in state_tuples
                obj = promises.create()
                assert.equal obj.state(), "pending", "should be pending"
                obj[state_tuple[0]]()
                assert.equal obj.state(), state_tuple[1], "should be #{state_tuple[1]}"
            return

        test "when in fulfilled, a promise must not transition to any other state", ->
            obj = promises.create()
                .fulfill()
                .reject()
            assert.equal obj.state(), "fulfilled", "state should not change"

        test "when in fulfilled, a promise must have a value, which must not change", ->
            fn = (value) => assert.equal value, "fulfilled"
            obj = promises.create()
                .fulfill()
                .done(fn)
                .reject()
                .done(fn)

        test "when in rejected, a promise must not transition to any other state", ->
            obj = promises.create()
                .reject()
                .fulfill()
            assert.equal obj.state(), "rejected", "state should not change"

        test "when in rejected, a promise must have a reason, which must not change", ->
            fn = (value) => assert.equal value, "rejected"
            obj = promises.create()
                .reject()
                .fail(fn)
                .fulfill()
                .fail(fn)

    suite "then", ->

        then_tuples = [
            [ "onFulfilled", "fulfill", 0 ]
            [ "onRejected", "reject", 1 ]
            [ "onNotified", "notify", 2 ]
        ]

        setup ->
            @then_args = ["not_a_function", "not_a_function", "not_a_function"]

        for then_tuple in then_tuples
            test "when #{then_tuple[0]} is not a function, it is ignored", ->
                p1 = promises.create()
                p2 = p1.then.apply(p1, @then_args)
                p1[then_tuple[1]]()
                assert.equal p2.state(), "pending"
            test "executes all #{then_tuple[0]} in order", ->
                callbacks = []
                p1 = promises.create()
                for index in [1..3]
                    @then_args[then_tuple[2]] = do (index) ->
                        -> callbacks.push(index)
                    p1.then.apply(p1, @then_args)
                p1[then_tuple[1]]()
                assert.deepEqual callbacks, [ 1, 2, 3 ], "callbacks should be called in order"

        test_callback_values = (asyncDone, desired_state, test_fn) ->
            delay = 10 # should be long enough for all other setTimeout's to finish
            counter = new Number.Counter
            done = -> asyncDone() if counter.step() is 4
            # onFulfilled
            do ->
                p1 = promises.create().fulfill()
                p2 = p1.then(->)
                setTimeout (->
                    assert.equal p2.state(), "pending"
                    done()
                ), delay
            do ->
                p1 = promises.create().fulfill()
                p2 = p1.then(test_fn)
                setTimeout (->
                    assert.equal p2.state(), desired_state, "onFulfilled failed"
                    done()
                ), delay
            # onRejected
            do ->
                p1 = promises.create().reject()
                p2 = p1.then(null, ->)
                setTimeout (->
                    assert.equal p2.state(), "pending"
                    done()
                ), delay
            do ->
                p1 = promises.create().reject()
                p2 = p1.then(null, test_fn)
                setTimeout (->
                    assert.equal p2.state(), desired_state, "onRejected failed"
                    done()
                ), delay

        test "returned promise is fulfilled when onFulfilled or onRejected returns a value", (asyncDone) ->
            test_callback_values(asyncDone, "fulfilled", -> "test_return_value")

        test "returned promise is rejected when onFulfilled or onRejected throws an exception", (asyncDone) ->
            test_callback_values(asyncDone, "rejected", -> throw "test_return_value")

        test "returned promise assumes state when onFulfilled returns a promise", (asyncDone) ->
            test_callback_values(asyncDone, "fulfilled", -> promises.create().fulfill())

        test "returned promise assumes state when onRejected returns a promise", (asyncDone) ->
            test_callback_values(asyncDone, "rejected", -> promises.create().reject())

        test "returns before onFulfilled, onRejected or onNotifed is called", ->
            callback_count = 0
            fn = ->
                callback_count++
                "this_would_fulfill_p2"
            p1 = promises.create().fulfill()
            p2 = p1.then(fn, fn, fn)
            # By checking the state now the setTimeout's have not had a chance
            # to run therefor keeping the state at pending and ensuring that
            # the then method returned before calling onFullfiled.
            assert.equal p2.state(), "pending", "p2 should not be fulfilled yet"
            assert.equal callback_count, 0, "callback should not have been called yet"

        test "can be called multiple times on same promise", (asyncDone) ->
            delay = 10
            callback_count = 0
            fn = ->
                callback_count++
                return
            p1 = promises.create()
            p1.then(fn)
            p1.then(fn, fn)
            p1.then(fn, fn, fn)
            p1.then(fn)
            p1.then(null, fn)
            p1.then(null, null, fn)
            p1.fulfill()
            setTimeout (->
                assert.equal callback_count, 4, "callback should have only been called 4 times"
                asyncDone()
            ), delay

        test "must return a promise", ->
            p1 = promises.create()
            p2 = p1.then()
            promise_test p2

    # These tests seem redundant even though they are part of the spec.
    # suite "onFulfilled callback", ->
    #     test "must be called after promise is fulfilled", ->
    #     test "is called with promises's fulfillment value", ->
    #     test "is only called once", ->
    #     test "is not called if onRejected has been called", ->
    #     test "when it returns a non-promise value, promise is fulfilled with a value", ->
    #     test "when it throws an exception, promise is rejected with a reason", ->
    # suite "onRejected callback", ->
    #     test "must be called after promise is rejected", ->
    #     test "is called with promises's rejected reason", ->
    #     test "is only called once", ->
    #     test "is not called if onFulfilled has been called", ->
    #     test "when it returns a non-promise value, promise is fulfilled with a value", ->
    #     test "when it throws an exception, promise is rejected with a reason", ->

    suite "when", ->

        test "returns a promise", -> promise_test promises.when()

        when_tuples = [
            {
                test: "when all sub-promises are fulfilled, returned promise is fulfilled"
                method: "fulfill"
                states: [ "fulfilled", "fulfilled", "fulfilled" ]
                reason: "all should be fulfilled"
            }
            {
                test: "when any sub-promise is rejected, returned promise is rejected"
                method: "reject"
                states: [ "fulfilled", "rejected", "rejected" ]
                reason: "last promise should be rejected"
            }
        ]
        state_array = -> obj.state() for obj in arguments
        for when_tuple in when_tuples
            test when_tuple.test, ->
                p1 = promises.create()
                p2 = promises.create()
                p3 = promises.when p1, p2
                assert.deepEqual state_array(p1,p2,p3), [ "pending", "pending", "pending" ], "all should be pending"
                p1.fulfill()
                assert.deepEqual state_array(p1,p2,p3), [ "fulfilled", "pending", "pending" ], "one should be fulfilled"
                p2[when_tuple.method]()
                assert.deepEqual state_array(p1,p2,p3), when_tuple.states, when_tuple.reason
