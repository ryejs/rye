assert = chai.assert

$ = Rye

suite 'Basic functionality', ->

    test 'Rye()', ->
        assert.instanceof Rye('div'), Rye, 'returns instance of Rye'

suite 'Querying', ->

    test 'ID query', ->

        el = $('#hello')
        assert.lengthOf el, 1, 'result has length 1'

        