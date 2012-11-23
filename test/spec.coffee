assert = chai.assert

$ = Rye

list_items = -> $('.list li')

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

    test 'get all', ->
        list = list_items()
        nodelist = list.get()
        assert nodelist.length is 3, "List has 3 elements"

    test 'get index', ->
        list = list_items()
        el = list.get(0)
        assert el instanceof HTMLElement, "list.get(0) is an element"
        assert el.className is 'a', "list.get(0) is .a"

    test 'eq', ->
        list = list_items()
        b = list.eq(1)
        assert b instanceof Rye, "Returns Rye instance"
        assert b.length is 1, "One element"

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

    test 'concat should ignore repeated elements', ->
        list = list_items()
        list2 = list_items()
        list3 = list.concat(list2)
        assert list3.length is 3, "List length shouldn't change"
        assert.deepEqual list3.pluck('className'), ['a', 'b', 'c'], "Elements are the same"

suite 'Traversal methods', ->

    test 'next', ->
        el = $('.a').next()
        assert el.length is 1, "One element found"
        assert el.get(0).className is 'b', "Next element is .b"

    test 'prev', ->
        el = $('.c').prev()
        assert el.length is 1, "One element found"
        assert el.get(0).className is 'b', "Previous element is .b"

    test 'parent', ->
        el = $('.a').parent()
        assert el.length is 1, "One element found"
        assert el.get(0).className is 'list', "Parent is .list"

    test 'first', ->
        first = list_items().first()
        assert first.length is 1, "One element found"
        assert first.get(0).className is 'a', "first() is .a"

    test 'last', ->
        last = list_items().last()
        assert last.length is 1, "One element found"
        assert last.get(0).className is 'c', "last() is .c"

    test 'siblings', ->
        list = list_items()
        siblings = list.eq(1).siblings()
        assert siblings.length is 2, "Two siblings"
        assert.deepEqual siblings.map((el) -> el.className), ['a', 'c']
