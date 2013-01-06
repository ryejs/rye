exports = {}

if typeof chai is 'undefined'
    assert = require('chai').assert
else
    assert = chai.assert
exports.assert = assert

exports.$ = Rye

#
# Utils
#

exports.list_items = -> $('.list li')

exports.escape = (v) -> v.replace /[[\]]/g, (v) -> ('[': '%5B', ']': '%5D')[v]

class Number.Countdown
    constructor: (@index = 0, @done) ->
    valueOf: -> @index
    toString: -> @index.toString()
    fire: => @done() unless --@index

class Number.Counter
    constructor: (@index = 0) ->
    valueOf: -> @index
    toString: -> @index.toString()
    step: => ++@index

exports.makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

exports.do_not_call = (event) ->
    assert.ok false, "Function shouldn't be called"

# touch events

exports.fire = (type, element, x, y) ->
    event = document.createEvent('Event')
    touch = pageX: x or 0, pageY: y or 0, target: element

    event.initEvent('touch' + type, true, true)
    event.touches = [touch]

    element.dispatchEvent event

exports.down = (element, x, y) -> fire 'start', element, x, y
exports.move = (element, x, y) -> fire 'move', element, x, y
exports.up = (element) -> fire 'end', element

#
# Server
#
do ->
    query = Mocha.utils.parseQuery window.location.search or ''
    exports.server = window.server or query.server or ''

#
# Template
#

do ->
    test = document.createElement('section')
    test.id = 'test'
    document.body.appendChild(test)

    setup ->
        test.innerHTML = """
            <header>
                <h2>This is the test area</h2>
            </header>
            <div class="content">
                <p id="hello">Hello</p>
                <ul class="list">
                    <li class="a">One</li>
                    <li class="b">Two</li>
                    <li class="c">Three</li>
                </ul>
            </div>
        """

#
# Rye modules
#

exports.util            = Rye.require('Util')
exports.data            = Rye.require('Data')
exports.events          = Rye.require('Events')
exports.EventEmitter    = Rye.require('Events').EventEmitter
exports.DOMEventEmitter = Rye.require('Events').DOMEventEmitter
exports.touchEvents     = Rye.require('TouchEvents')
exports.request         = Rye.require('Request')
exports.style           = Rye.require('Style')

#
# Exports
#

exports.util.extend window, exports