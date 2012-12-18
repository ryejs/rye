assert = chai.assert

$ = Rye

DOMEvents = Rye.require('DOMEvents')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

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
        assert true

    test 'remove listener', (done) ->
        div = makeElement('div')
        count = 0
        foo = (event) -> assert false, "Foo"
        bar = (event) -> count++

        DOMEvents.addListener div, 'foo', foo
        DOMEvents.addListener div, 'bar', bar
        DOMEvents.removeListener div, 'foo'

        DOMEvents.trigger div, 'bar'
        DOMEvents.trigger div, 'foo'

        setTimeout ->
            assert.equal count, 1
            done()
        , 0

    test 'remove selector', (done) ->
        div = makeElement('div')
        count = 0
        foo = -> assert false
        bar = -> count++

        DOMEvents.addListener div, 'click', 'div', bar
        DOMEvents.addListener div, 'click', 'a', foo
        DOMEvents.removeListener div, 'click', 'a'

        DOMEvents.trigger div, 'click'

        setTimeout ->
            assert.equal count, 1
            done()
        , 0

    test 'remove handler', (done) ->
        div = makeElement('div')
        count = 0
        foo = (event) -> assert false, "Foo"
        bar = (event) -> count++

        DOMEvents.addListener div, 'click', false, foo
        DOMEvents.addListener div, 'click', false, bar
        DOMEvents.removeListener div, '*', false, foo

        DOMEvents.trigger div, 'click'

        setTimeout ->
            assert.equal count, 1
            done()
        , 0

    test 'remove all', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"

        DOMEvents.addListener div, 'click', false, foo
        DOMEvents.addListener div, 'focus', false, foo
        DOMEvents.addListener div, 'blur', false, foo
        DOMEvents.removeListener div, '*'

        DOMEvents.trigger div, 'click focus blur'

        setTimeout (-> done()), 0

    test 'delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        count = 0
        fn = (event) ->
            count++
            assert.equal event.currentTarget, document
            assert.equal event.target, item

        DOMEvents.addListener document, 'click', '.a', fn

        DOMEvents.trigger item, 'click'
        DOMEvents.trigger list, 'click'
        DOMEvents.trigger document, 'click'

        setTimeout ->
            assert.equal count, 1
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
        foo = (event) -> assert false, "Foo"

        itens.on 'blur', foo
        itens.off 'blur'
        itens.trigger 'blur'

        setTimeout (-> done()), 0


