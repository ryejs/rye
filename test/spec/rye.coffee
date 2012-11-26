assert = chai.assert

$ = Rye

list_items = -> $('.list li')

suite 'Constructor', ->

    test 'Rye()', ->
        assert.instanceOf $('div'), Rye, "$() returns instance of Rye"

    test 'call without arguments', ->
        obj = $()
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

    test 'call with null', ->
        obj = $(null)
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

    test 'call with undefined', ->
        obj = $(undefined)
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

    test 'call with empty array', ->
        obj = $([])
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

    test 'call with invalid array', ->
        obj = $([1,2,3])
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

        obj = $([[1], [2]])
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 0

    test 'call with nodelist', ->
        obj = $(document.querySelectorAll('.list li'))
        assert.instanceOf obj, Rye
        assert.lengthOf obj, 3
