assert = chai.assert

$ = Rye

Events = Rye.require('Events')
EventEmitter = Events.EventEmitter

suite 'EventEmitter', ->

    test 'add listener', ->
        x = new EventEmitter
        x.on 'click', ->
        assert x.events['click'].length is 1, "Event added to .events"

        x.on 'click.foo', ->
        assert x.events['click.foo'].length is 1, "Event added to .events"

    test 'remove listener', ->
        x = new EventEmitter
        fn = -> 123

        x.on 'click', fn
        x.removeListener 'click', fn
        assert x.events['click'] is undefined, "Event removed by reference"

        x.on 'click', fn
        x.removeListener 'click'
        assert x.events['click'] is undefined, "Event removed by name"

        x.on 'click.foo', fn
        x.removeListener 'click.foo'
        assert x.events['click.foo'] is undefined, "Event removed by name && ns"

        x.on 'click.foo', fn
        x.removeListener '.foo'
        assert x.events['click.foo'] is undefined, "Event removed by ns"

    test 'remove namespaced event', (done) ->
        x = new EventEmitter
        x.on 'test.foo', ->
            assert false, "Event shouldn't be emmited"
        x.removeListener '.foo'
        x.emit 'test'
        setTimeout ->
            done()
        , 0

    test 'emit event', (done) ->
        x = new EventEmitter
        x.on 'click', (arg) ->
            assert arg is 55, "Argument received"
            done()
        x.emit 'click', 55

    test 'emit namespaced event', (done) ->
        x = new EventEmitter
        x.on 'click.foo', (arg) ->
            assert arg is 33, "Argument received"
            done()
        x.emit '.foo', 33

    test 'emit name and namespaced event', (done) ->
        x = new EventEmitter
        x.on 'click.foo', (arg) ->
            assert arg is 4, "Argument received"
            done()
        x.emit 'click.foo', 4

    test 'emit once', (done) ->
        x = new EventEmitter
        x.once 'click', (arg) ->
            assert arg is 4, "Argument received"
        x.emit 'click', 4
        x.emit 'click', 5
        
        setTimeout ->
            assert x.events['click'] is undefined, "Event removed"
            done()


suite 'PubSub', ->

    test 'subscribe publish', (done) ->
        $.subscribe 'sign', (arg) ->
            assert arg is 55, "Argument received"
            done()
        Events.publish 'sign', 55

    test 'unsubscribe', (done) ->
        $.subscribe 'sign', ->
            assert false, "Event shouldn't be emmited"
        Events.unsubscribe 'sign'
        $.publish 'sign'
        setTimeout ->
            done()
        , 0



