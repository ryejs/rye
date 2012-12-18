assert = chai.assert

$ = Rye

EventEmitter = Rye.require('EventEmitter')

suite 'EventEmitter', ->

    test 'add listener', ->
        x = new EventEmitter
        x.on 'click', ->
        assert x.events['click'].length is 1, "Event added to .events"

    test 'remove listener', ->
        x = new EventEmitter
        fn = -> 123

        x.on 'click', fn
        x.removeListener 'click', fn
        assert x.events['click'] is undefined, "Event removed by reference"

        x.on 'click', fn
        x.removeListener 'click'
        assert x.events['click'] is undefined, "Event removed by name"

    test 'emit event', (done) ->
        x = new EventEmitter
        x.on 'click', (arg) ->
            assert.equal arg, 55
            done()
        x.emit 'click', 55

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
        $.publish 'sign', 55

    test 'unsubscribe', (done) ->
        $.subscribe 'sign', ->
            assert false, "Event shouldn't be emmited"
        $.unsubscribe 'sign'
        $.publish 'sign'
        setTimeout ->
            done()
        , 0



