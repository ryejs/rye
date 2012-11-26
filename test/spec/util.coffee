assert = chai.assert

$ = Rye

util = Rye.require 'util'

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

    test 'prefix', ->
        assert.strictEqual util.prefix('document'), document, "find unprefixed object"
        context = { mozBacon: -> }
        assert.strictEqual util.prefix('bacon', context), context.mozBacon, "find prefixed object"
