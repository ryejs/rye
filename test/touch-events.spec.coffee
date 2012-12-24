assert = chai.assert

$ = Rye

events = Rye.require('Events')
touchEvents = Rye.require('TouchEvents')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

fire = (type, element, x, y) ->
    event = document.createEvent('Event')
    touch = pageX: x or 0, pageY: y or 0, target: element

    event.initEvent('touch' + type, true, true)
    event.touches = [touch]

    element.dispatchEvent event

down = (element, x, y) -> fire 'start', element, x, y
move = (element, x, y) -> fire 'move', element, x, y
up = (element) -> fire 'end', element

class Number.Counter
    constructor: (@index = 0) ->
    valueOf: -> @index
    toString: -> @index.toString()
    step: => ++@index

suite 'TouchEvents', ->

    test 'tap', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'tap', counter.step
        down(element, 10, 10)
        up(element)

        setTimeout ->
            assert.equal counter, 1
            events.removeListener element, '*'
            done()
        , 0

    test 'tap textnode', (done) ->
        element = $('.a').get(0)
        text = element.childNodes[0]

        events.addListener element, 'tap', (event) ->
            assert.equal event.target, element
            events.removeListener element, '*'
            done()
        down(text, 10, 10)
        up(text)

    test 'tap twice', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'tap', counter.step
        down(element, 10, 10)
        up(element)

        setTimeout ->
            down(element, 10, 10)
            up(element)

            setTimeout ->
                assert.equal counter, 2
                events.removeListener element, '*'
                done()
            , 0
        , 200

    test 'single tap', (done) ->
        element = $('.a').get(0)
        counterSingle = new Number.Counter
        counterDouble = new Number.Counter

        events.addListener element, 'singletap', counterSingle.step
        events.addListener element, 'doubletap', counterDouble.step

        down(element, 10, 10)
        up(element)

        setTimeout ->
            assert.equal counterSingle, 1
            assert.equal counterDouble, 0
            events.removeListener element, '*'
            done()
        , 300

    test 'double tap', (done) ->
        element = $('.a').get(0)
        counterSingle = new Number.Counter
        counterDouble = new Number.Counter

        events.addListener element, 'singletap', counterSingle.step
        events.addListener element, 'doubletap', counterDouble.step

        down(element, 10, 10)
        up(element)

        setTimeout ->
            down(element, 12, 12)
            up(element)

            setTimeout ->
                assert.equal counterSingle, 0
                assert.equal counterDouble, 1
                events.removeListener element, '*'
                done()
            , 100
        , 100

    test 'long tap', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'longtap', counter.step
        down(element, 10, 10)

        setTimeout ->
            up(element)
            assert.equal counter, 1
            events.removeListener element, '*'
            done()
        , 900

    test 'a move cancels long tap', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'longtap', counter.step
        down(element, 10, 10)

        setTimeout ->
            move(element, 50, 10)
            setTimeout ->
                up(element)
                assert.equal counter, 0
                events.removeListener element, '*'
                done()
            , 450
        , 450

    test 'swipe', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'swipe', counter.step
        down(element, 10, 10)

        setTimeout ->
            move(element, 70, 10)
            up(element)

            setTimeout ->
                assert.equal counter, 1
                events.removeListener element, '*'
                done()
            , 0
        , 50

    [
        ['left',    0,  50]
        ['right', 100,  50]
        ['up',     50,   0]
        ['down',   50, 100]
    ].forEach ([direction, x, y]) ->
        test "swipe #{direction}", (done) ->
            element = $('.a').get(0)
            counter = new Number.Counter

            events.addListener element, "swipe#{direction}", counter.step
            down(element, 50, 50)

            setTimeout ->
                move(element, x, y)
                up(element)

                setTimeout ->
                    assert.equal counter, 1
                    events.removeListener element, '*'
                    done()
                , 0
            , 50


    test 'cancel', (done) ->
        element = $('.a').get(0)
        counter = new Number.Counter

        events.addListener element, 'swipe', counter.step
        down(element, 10, 10)

        setTimeout ->
            move(element, 70, 10)
            fire('cancel', element)
            up(element)

            setTimeout ->
                assert.equal counter, 0
                events.removeListener element, '*'
                done()
            , 0
        , 50
