assert = chai.assert

$ = Rye

domEvents = Rye.require('DOMEvents')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

do_not_call = (event) ->
    assert.ok false, "Function shouldn't be called"

class Number.Counter
    constructor: (@index = 0) ->
    valueOf: -> @index
    toString: -> @index.toString()
    step: => ++@index

suite 'DOMEvents', ->

    test 'addListener', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert.equal event.data, 55
            done()

        domEvents.addListener div, 'click', fn
        domEvents.trigger div, 'click', 55

    test 'remove listener', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        domEvents.addListener div, 'foo', do_not_call
        domEvents.addListener div, 'bar', counter.step
        domEvents.removeListener div, 'foo'

        domEvents.trigger div, 'bar'
        domEvents.trigger div, 'foo'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove listener in element without emitter', ->
        div = makeElement('div')
        domEvents.removeListener div, 'foo'
        assert.ok true

    test 'remove listener trought selector', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        domEvents.addListener div, 'click div', counter.step
        domEvents.addListener div, 'click a', do_not_call
        domEvents.removeListener div, 'click a'

        domEvents.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove listener trought handler', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        domEvents.addListener div, 'click', do_not_call
        domEvents.addListener div, 'click', counter.step
        domEvents.removeListener div, '*', do_not_call

        domEvents.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove all listeners', (done) ->
        div = makeElement('div')

        domEvents.addListener div, 'click', do_not_call
        domEvents.addListener div, 'focus', do_not_call
        domEvents.addListener div, 'blur', do_not_call
        domEvents.removeListener div, '*'

        domEvents.trigger(div, 'click')
        domEvents.trigger(div, 'focus')
        domEvents.trigger(div, 'blur')

        setTimeout (-> done()), 0

    test 'destroy listener', (done) ->
        div = makeElement('div')

        domEvents.addListener div, 'click', do_not_call
        domEvents.addListener div, 'focus', do_not_call
        domEvents.addListener div, 'blur',  do_not_call
        domEvents.getEmitter(div).destroy()

        domEvents.trigger(div, 'click')
        domEvents.trigger(div, 'focus')
        domEvents.trigger(div, 'blur')

        setTimeout (-> done()), 0

    test 'create event', ->
        event = domEvents.createEvent type: 'click'
        assert.equal event.type, 'click'

        event = domEvents.createEvent 'click', prop: 'value'
        assert.equal event.prop, 'value'

    test 'delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        counter = new Number.Counter
        fn = (event) ->
            counter.step()
            assert.equal event.currentTarget, document
            assert.equal event.target, item

        domEvents.addListener document, 'click .a', fn

        domEvents.trigger item, 'click'
        domEvents.trigger list, 'click'
        domEvents.trigger document, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)

        domEvents.addListener document, 'click .a', do_not_call

        domEvents.removeListener document, 'click .a'
        domEvents.trigger item, 'click'

        setTimeout ->
            done()
        , 0

    test 'Rye on', (done) ->
        itens = $('.list li')
        fn = (event) ->
            assert event.data is 55, "Argument received"
            done()

        itens.on 'click', fn
        itens.eq(2).trigger 'click', 55

    test 'Rye off', (done) ->
        itens = $('.list li')

        itens.on('blur', do_not_call).off 'blur'
        itens.trigger 'blur'

        setTimeout (-> done()), 0


