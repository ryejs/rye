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
        assert.lengthOf el, 1

    test 'class query', ->
        el = $('.a')
        assert.lengthOf el, 1

    test 'tag query', ->
        el = $('section')
        assert.lengthOf el, 1
        assert el.get(0).tagName is 'SECTION', 'tag matches'

    test 'complex query', ->
        el = $('section#test .list .b')
        assert.lengthOf el, 1

    test 'multiple results', ->
        el = $('#test li')
        assert.lengthOf el, 3

suite 'Collection methods', ->

    lis = '.list li'

    test 'get', ->
        el = $(lis)
        assert.lengthOf el, 3
        assert el.get(1).className is 'b'

    test 'forEach', ->
        el = $(lis)
        i = 0
        el.forEach -> i++
        assert.equal i, 3
