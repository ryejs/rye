assert = chai.assert

$ = Rye

util = Rye.require 'Util'

suite 'Util', ->

    test 'extend', ->
        one = {one: 1}
        two = util.extend one, {two: 2}
        assert.deepEqual two, { one: 1, two: 2 }

    test 'inherits', ->
        class Meat
            barbecue: true
            hello: -> 'hi'
        class Bacon
        util.inherits Bacon, Meat
        obj = new Bacon
        assert.equal obj.barbecue, true
        assert.instanceOf obj.hello, Function
        assert.equal obj.hello(), 'hi'

    test 'isElement', ->
        assert.isFalse util.isElement(false), "False isnt element"

        div = document.createElement('div')
        assert.isTrue util.isElement(div), "DIV is element"

        comment = document.createComment('hi')
        assert.isFalse util.isElement(comment), "Comment isnt element"

        fragment = document.createDocumentFragment('div')
        assert.isFalse util.isElement(fragment), "Fragment isnt element"

    test 'isNodeList', ->
        assert.isFalse util.isNodeList(false), "False isnt node list"

        qsa = document.querySelectorAll('nothing')
        assert.isTrue util.isNodeList(qsa), "Query querySelectorAll result is node list"

        collection = document.body.children
        assert.isTrue util.isNodeList(collection), "Childrens are node list"

        div = document.createElement('div')
        assert.isTrue util.isElement(div), "Element isnt node list"

    test 'unique', ->
        assert.deepEqual util.unique([]), [], "Empty array"
        array = [1, 2, 3, 1]
        assert.deepEqual util.unique(array), [1, 2, 3], "Simple case"
        assert.deepEqual array, [1, 2, 3, 1], "Preserve source"
        assert.deepEqual util.unique([0, null, false, undefined]), [0, null, false, undefined], "Filter falsy values"

    test 'pluck', ->
        array = [
            {prop:1, another:3}
            {prop:2, another:4}
        ]
        assert.deepEqual util.pluck(array, 'prop'), [1,2], "Get prop property of objects"

    test 'put', ->
        arr = [
            { id: 1 }
            { id: 2 }
        ]
        util.put(arr, 'loco', true)
        assert.deepEqual util.pluck(arr, 'loco'), [true, true]

    test 'prefix', ->
        assert.strictEqual util.prefix('document'), document, "find unprefixed object"
        context = { mozBacon: -> }
        assert.strictEqual util.prefix('bacon', context), context.mozBacon, "find prefixed object"

    test 'applier right', ->
        context = {}
        fn = (a, b, c) ->
            assert.equal this, context
            assert.deepEqual [a, b, c], ['call1', 'call2', 'apply']
        util.applier('right', fn, context, ['apply'])('call1', 'call2')
        util.applier('right', fn, context, ['apply'])('call1', 'call2')

    test 'applier left', ->
        context = {}
        fn = (a, b, c) ->
            assert.equal this, context
            assert.deepEqual [a, b, c], ['apply', 'call1', 'call2']
        util.applier('left', fn, context, ['apply'])('call1', 'call2')
        util.applier('left', fn, context, ['apply'])('call1', 'call2')

    test 'curry', ->
        fn = (a, b, c) ->
            assert.equal this, util
            assert.deepEqual [a, b, c], ['apply1', 'apply2', 'call1']
        util.curry(fn, 'apply1', 'apply2')('call1')
        util.curry(fn, 'apply1', 'apply2')('call1')

    test 'type', ->
        assert.equal util.type(/\b/), 'regexp'

    test 'is', ->
        assert.isTrue util.is(/\b/, 'regexp')

