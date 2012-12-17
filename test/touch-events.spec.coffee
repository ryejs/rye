assert = chai.assert

$ = Rye

domEvents = Rye.require('DOMEvents')
touchEvents = Rye.require('TouchEvents')

fire = (type, element, x, y) ->
    event = document.createEvent('Event')
    touch = pageX: x, pageY: y, target: element

    event.initEvent('touch' + type, true, true)
    event.touches = [touch]

    element.dispatchEvent event

down = (element, x, y) -> fire 'start', element, x, y
move = (element, x, y) -> fire 'move', element, x, y
up = (element) -> fire 'end', element

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

suite 'TouchEvents', ->

    test 'tap', (done) ->
        element = $('.a').get(0)
        count = 0

        domEvents.on element, 'tap', -> count++
        down(element, 10, 10)
        up(element)

        setTimeout ->
            assert.equal count, 1
            domEvents.removeListener element, '*'
            done()
        , 0

    test 'tap textnode', (done) ->
        element = $('.a').get(0)
        text = element.childNodes[0]
        count = 0

        domEvents.on element, 'tap', (event) ->
            assert.equal event.target, element
            domEvents.removeListener element, '*'
            done()
        down(text, 10, 10)
        up(text)

    test 'tap twice', (done) ->
        element = $('.a').get(0)
        count = 0

        domEvents.on element, 'tap', (event) -> count++
        down(element, 10, 10)
        up(element)

        setTimeout ->
            down(element, 10, 10)
            up(element)

            setTimeout ->
                assert.equal count, 2
                domEvents.removeListener element, '*'
                done()
            , 0
        , 200

    test 'single tap', (done) ->
        element = $('.a').get(0)
        singleCount = 0; doubleCount = 0

        domEvents.on element, 'singletap', (event) -> singleCount++
        domEvents.on element, 'doubletap', (event) -> doubleCount++

        down(element, 10, 10)
        up(element)

        setTimeout ->
            assert.equal singleCount, 1
            assert.equal doubleCount, 0
            domEvents.removeListener element, '*'
            done()
        , 300

    test 'double tap', (done) ->
        element = $('.a').get(0)
        singleCount = 0; doubleCount = 0

        domEvents.on element, 'singletap', (event) -> singleCount++
        domEvents.on element, 'doubletap', (event) -> doubleCount++

        down(element, 10, 10)
        up(element)

        setTimeout ->
            down(element, 12, 12)
            up(element)

            setTimeout ->
                assert.equal singleCount, 0
                assert.equal doubleCount, 1
                domEvents.removeListener element, '*'
                done()
            , 100
        , 100

    test 'long tap', (done) ->
        element = $('.a').get(0)
        count = 0

        domEvents.on element, 'longtap', -> count++
        down(element, 10, 10)

        setTimeout ->
            up(element)
            assert.equal count, 1
            domEvents.removeListener element, '*'
            done()
        , 900

    test 'a move cancels long tap', (done) ->
        element = $('.a').get(0)
        count = 0

        domEvents.on element, 'longtap', -> count++
        down(element, 10, 10)

        setTimeout ->
            move(element, 50, 10)
            setTimeout ->
                up(element)
                assert.equal count, 0
                domEvents.removeListener element, '*'
                done()
            , 450
        , 450

    test 'swipe', (done) ->
        element = $('.a').get(0)
        count = 0

        domEvents.on element, 'swipe', -> count++
        down(element, 10, 10)

        setTimeout ->
            move(element, 70, 10)
            up(element)

            setTimeout ->
                assert.equal count, 1
                domEvents.removeListener element, '*'
                done()
            , 0
        , 50
