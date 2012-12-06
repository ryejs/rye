assert = chai.assert

$ = Rye

list = -> $('.list')

events = Rye.require('Events')
EventEmitter = events.EventEmitter

suite 'EventEmitter', ->

    test 'add listener', ->
        x = new EventEmitter
        x.addEventListener 'click', ->
        assert x.events['click'].length is 1, "Event added to .events"

        x.addEventListener 'click.foo', ->
        assert x.events['click.foo'].length is 1, "Event added to .events"

    test 'remove listener', ->
        x = new EventEmitter
        fn = -> 123

        x.addEventListener 'click', fn
        x.removeListener 'click', fn
        assert x.events['click'] is undefined, "Event removed by reference"

        x.addEventListener 'click', fn
        x.removeListener 'click'
        assert x.events['click'] is undefined, "Event removed by name"

        x.addEventListener 'click.foo', fn
        x.removeListener 'click.foo'
        assert x.events['click.foo'] is undefined, "Event removed by name && ns"

        x.addEventListener 'click.foo', fn
        x.removeListener '.foo'
        assert x.events['click.foo'] is undefined, "Event removed by ns"

    test 'remove namespaced event', (done) ->
        x = new EventEmitter
        x.addEventListener 'test.foo', ->
            assert false, "Event shouldn't be emmited"
        x.removeListener '.foo'
        x.emit 'test'
        setTimeout ->
            done()
        , 0

    test 'emit event', (done) ->
        x = new EventEmitter
        x.addEventListener 'click', (arg) ->
            assert arg is 55, "Argument received"
            done()
        x.emit 'click', 55

    test 'emit namespaced event', (done) ->
        x = new EventEmitter
        x.addEventListener 'click.foo', (arg) ->
            assert arg is 33, "Argument received"
            done()
        x.emit '.foo', 33

    test 'emit name and namespaced event', (done) ->
        x = new EventEmitter
        x.addEventListener 'click.foo', (arg) ->
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
        events.publish 'sign', 55

    test 'unsubscribe', (done) ->
        $.subscribe 'sign', ->
            assert false, "Event shouldn't be emmited"
        events.unsubscribe 'sign'
        $.publish 'sign'
        setTimeout ->
            done()
        , 0



