assert = chai.assert

$ = Rye

DOMEvents = Rye.require('DOMEvents')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

suite 'DOMEvents', ->

    test 'create event', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert event.data is 55, "Argument received"
            done()

        DOMEvents.on div, 'click', false, fn

        event = DOMEvents.createEvent('click')
        DOMEvents.dispatchEvent div, event, 55

    test 'on', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert event.data is 55, "Argument received"
            done()

        DOMEvents.on div, 'click', false, fn
        DOMEvents.dispatchEvent div, 'click', 55

    test 'on with namespace', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert event.data is 55, "Argument received"
            done()

        DOMEvents.on div, 'click.foo', false, fn
        DOMEvents.dispatchEvent div, 'click', 55

    test 'remove nothing', ->
        div = makeElement('div')
        DOMEvents.removeListener div, 'foo'

    test 'remove', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"
        bar = (event) -> assert true, "Bar"

        DOMEvents.on div, 'foo', false, foo
        DOMEvents.on div, 'bar', false, bar
        DOMEvents.removeListener div, 'foo'

        DOMEvents.dispatchEvent div, 'bar'
        DOMEvents.dispatchEvent div, 'foo'

        setTimeout (-> done()), 0

    test 'remove with namespace', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"
        bar = (event) -> assert true, "Bar"

        DOMEvents.on div, 'click.foo', false, foo
        DOMEvents.on div, 'click.bar', false, bar
        DOMEvents.removeListener div, '.foo'

        DOMEvents.dispatchEvent div, 'click'

        setTimeout (-> done()), 0

    test 'remove selector', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"
        bar = (event) -> assert true, "Bar"

        DOMEvents.on div, 'click', 'div', foo
        DOMEvents.on div, 'click', 'a', bar
        DOMEvents.removeListener div, 'click', 'div'

        DOMEvents.dispatchEvent div, 'click'

        setTimeout (-> done()), 0    

    test 'remove selector with namespace', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"
        bar = (event) -> assert true, "Bar"

        DOMEvents.on div, 'click.foo', 'div', foo
        DOMEvents.on div, 'click', 'div', bar
        DOMEvents.removeListener div, 'click.foo', 'div'

        DOMEvents.dispatchEvent div, 'click'

        setTimeout (-> done()), 0

    test 'remove handler', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"
        bar = (event) -> assert true, "Bar"

        DOMEvents.on div, 'click', false, foo
        DOMEvents.on div, 'click', false, bar
        DOMEvents.removeListener div, '*', false, foo

        DOMEvents.dispatchEvent div, 'click'

        setTimeout (-> done()), 0

    test 'remove all', (done) ->
        div = makeElement('div')
        foo = (event) -> assert false, "Foo"

        DOMEvents.on div, 'click', false, foo
        DOMEvents.on div, 'focus.space', false, foo
        DOMEvents.on div, 'blur.space', false, foo
        DOMEvents.removeListener div, '*'

        DOMEvents.dispatchEvent div, 'click focus blur'

        setTimeout (-> done()), 0

    test 'delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        fn = (event) ->
            assert.equal event.currentTarget, item, "Argument received"

        DOMEvents.on document, 'click', '.a', fn

        DOMEvents.dispatchEvent item, 'click'
        DOMEvents.dispatchEvent list, 'click'
        DOMEvents.dispatchEvent document, 'click'

        setTimeout (-> done()), 0





