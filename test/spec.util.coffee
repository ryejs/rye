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
        class Bacon extends Meat
        obj = new Bacon
        assert.equal obj.barbecue, true
