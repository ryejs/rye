assert = chai.assert

$ = Rye

ajax = Rye.require('Ajax')
escape = (v) -> v.replace /[[\]]/g, (v) -> ('[': '%5B', ']': '%5D')[v]

class Number.Countdown
    constructor: (@index = 0, @done) ->
    valueOf: -> @index
    toString: -> @index.toString()
    fire: => if --@index then @done()

suite 'Ajax', ->

    test 'get', (done) ->
        countdown = new Number.Countdown(2, done)
        ajax.request '/echo', (data) ->
            assert.equal data, 'get no data'
            countdown.fire()

        ajax.request url: '/echo', data: {fizz: 1, bar: 2}, callback: (data) ->
            assert.equal data, 'get 2'
            countdown.fire()


    test 'params', ->
        assert.equal ajax.param({foo: {one: 1, two: 2}}), escape 'foo[one]=1&foo[two]=2'

        assert.equal ajax.param({ids: [1,2,3]}), escape 'ids[]=1&ids[]=2&ids[]=3'
        
        assert.equal ajax.param({foo: 'bar', nested: {will: 'not be ignored'}}), escape 'foo=bar&nested[will]=not+be+ignored'

        assert.equal ajax.param([{name: 'foo', value: 'bar'}]), escape 'foo=bar'


