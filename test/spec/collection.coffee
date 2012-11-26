assert = chai.assert

$ = Rye

list_items = -> $('.list li')

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
        res = list.get().map (el) -> el.className
        assert.deepEqual res, ['a', 'b', 'c'], "List of classnames matches"

    test 'slice', ->
        list = list_items()
        res = list.get().slice(0, 2)
        assert.deepEqual res, [list.elements[0], list.elements[1]], "List of classnames matches"

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

    test 'sort', ->
        list = list_items()
        # reverse alphabetical order
        list.sort (a, b) -> if a.className < b.className then 1 else -1
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
