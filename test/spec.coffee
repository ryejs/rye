assert = chai.assert

$ = Rye

setup ->
    document.getElementById('test').style.display = 'block'

teardown ->
    document.getElementById('test').style.display = 'none'

suite 'Basic functionality', ->

    test 'Rye()', ->
        assert.instanceOf $('div'), Rye, "$() returns instance of Rye"

suite 'Querying', ->

    test 'ID query', ->
        el = $('#hello')
        assert.lengthOf el, 1
        assert el.length is 1, "Has one element"

    test 'class query', ->
        el = $('.a')
        assert.lengthOf el, 1, "Has one element"

    test 'tag query', ->
        el = $('section')
        assert.lengthOf el, 1, "Has one element"
        assert el.get(0).tagName is 'SECTION', "Tag matches"

    test 'complex query', ->
        el = $('section#test .list .b')
        assert.lengthOf el, 1, "It has one element"

    test 'multiple results', ->
        el = $('#test li')
        assert.lengthOf el, 3, "It has 3 elements"

suite 'Collection methods', ->

    list_items = -> $('.list li')

    test 'get', ->
        list = list_items()
        assert.lengthOf list, 3, "List has 3 elements"
        assert list.get(1).className is 'b', "List[1] has class 'b'"

    test 'forEach', ->
        list = list_items()
        count = 0
        list.forEach (el, i) ->
            assert.strictEqual el, list.get(i), "Index in loop corresponds to element"
            count++
        assert.equal count, 3, "Three iterations completed"

    test 'map', ->
        list = list_items()
        res = list.map (el) -> el.className
        assert.deepEqual res, ['a', 'b', 'c'], "List of classnames matches"

    test 'reduce', ->
        list = list_items()
        res = list.reduce (p, c, i) ->
            p + c.className
        , 'ø'
        assert.strictEqual res, 'øabc', "Result includes concatenated classes"

    test 'reduceRight', ->
        list = list_items()
        res = list.reduceRight (p, c, i) ->
            p + c.className
        , 'ø'
        assert.strictEqual res, 'øcba', "Result includes reverse concatenated classes"

    test 'push', ->
        list = list_items()
        list.push(document.createElement('div'))
        assert list.length is 4, "List has 4 elements"
        assert list.get(3).tagName is 'DIV', "list[3] is a div"

    test 'push accepts only elements', ->
        list = list_items()
        list.push 'bacon'
        assert list.length is 3, "List still has 3 elements"
        assert list.get(3) is undefined, "Element at 3 doesn't exist"

    test 'sort', ->
        list = list_items()
        # reverse alphabetical order
        list.sort (a, b) -> a.className < b.className
        assert list.get(0).className is 'c', ".c is first in the list"

    test 'indexOf', ->
        list = list_items()
        for el, i in list.get()
            assert list.indexOf(el) is i, "Indexes must match"

    test 'concat', ->
        list = list_items()
        other = [document.createElement('div')]
        list2 = list.concat other
        assert list2.length is 4, "List length should increase by 1"
        assert list2.get(3).tagName is 'DIV'
