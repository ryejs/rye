assert = chai.assert

$ = Rye

DOMEvents = Rye.require('DOMEvents')

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

    test 'on', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert.equal event.data, 55
            done()

        DOMEvents.addListener div, 'click', fn
        DOMEvents.trigger div, 'click', 55

    test 'remove nothing', ->
        div = makeElement('div')
        DOMEvents.removeListener div, 'foo'
        assert.ok true

    test 'remove listener', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        DOMEvents.addListener div, 'foo', do_not_call
        DOMEvents.addListener div, 'bar', counter.step
        DOMEvents.removeListener div, 'foo'

        DOMEvents.trigger div, 'bar'
        DOMEvents.trigger div, 'foo'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove selector', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        DOMEvents.addListener div, 'click', 'div', counter.step
        DOMEvents.addListener div, 'click', 'a', do_not_call
        DOMEvents.removeListener div, 'click', 'a'

        DOMEvents.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove handler', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        DOMEvents.addListener div, 'click', false, do_not_call
        DOMEvents.addListener div, 'click', false, counter.step
        DOMEvents.removeListener div, '*', false, do_not_call

        DOMEvents.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove all', (done) ->
        div = makeElement('div')

        DOMEvents.addListener div, 'click', false, do_not_call
        DOMEvents.addListener div, 'focus', false, do_not_call
        DOMEvents.addListener div, 'blur', false, do_not_call
        DOMEvents.removeListener div, '*'

        DOMEvents.trigger div, 'click focus blur'

        setTimeout (-> done()), 0

    test 'delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        counter = new Number.Counter
        fn = (event) ->
            counter.step()
            assert.equal event.currentTarget, document
            assert.equal event.target, item

        DOMEvents.addListener document, 'click', '.a', fn

        DOMEvents.trigger item, 'click'
        DOMEvents.trigger list, 'click'
        DOMEvents.trigger document, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test.skip 'remove delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        foo = (event) -> assert false, "Foo"

        DOMEvents.addListener document, 'click', '.a', foo

        DOMEvents.removeListener document, 'click'
        DOMEvents.trigger item, 'click'

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

        itens.on 'blur', do_not_call
        itens.off 'blur'
        itens.trigger 'blur'

        setTimeout (-> done()), 0


