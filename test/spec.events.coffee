assert = chai.assert

$ = Rye

EventEmitter = Rye.require('EventEmitter')

suite 'EventEmitter', ->

    test 'add listener', ->
        x = new EventEmitter
        x.on 'click', ->
        assert x.events['click'] isnt null, "Event added to .events"
