assert = chai.assert

$ = Rye

setup ->
    document.getElementById('test').style.display = 'block'

teardown ->
    document.getElementById('test').style.display = 'none'

suite 'Basic functionality', ->

    test 'Rye()', ->
        assert.instanceOf Rye('div'), Rye, 'returns instance of Rye'

suite 'Querying', ->

    test 'ID query', ->

        el = $('#hello')
        assert.lengthOf el.elements, 1, 'result has length 1'