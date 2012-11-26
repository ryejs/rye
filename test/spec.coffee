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

suite 'Traversal methods', ->

    test 'add multiple (Rye)', ->
        list = list_items()
        list2 = list_items()
        list3 = list.add(list2)
        assert list3.length is 3, "List length shouldn't change"
        assert.deepEqual list3.pluck('className'), ['a', 'b', 'c'], "Elements are the same"

    test 'add multiple (Array)', ->
        list = list_items()
        list2 = list_items().get()
        list3 = list.add(list2)
        assert list3.length is 3, "List length shouldn't change"
        assert.deepEqual list3.pluck('className'), ['a', 'b', 'c'], "Elements are the same"

    test 'add single item', ->
        list = list_items()
        div = document.createElement('div')
        list3 = list.add(div)
        assert list3.length is 4, "Has four items"
        assert.deepEqual list3.pluck('className'), ['a', 'b', 'c', ''], "Classes match"
        assert list3.get(3) is div, "Element was appended to the list"

    test 'add invalid item', ->
        list = list_items()
        list3 = list.add('bacon')
        assert list3.length is 3, "Length didn't change"
        assert.deepEqual list3.pluck('className'), ['a', 'b', 'c'], "Classes match"

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
        assert.deepEqual siblings.get().map((el) -> el.className), ['a', 'c']

    test 'closest', ->
        el = $('.a')
        closest = el.closest('ul')
        assert.lengthOf closest, 1
        assert.equal closest.get(0).className, 'list'

        closest = el.closest('section#test')
        assert.lengthOf closest, 1
        assert.equal closest.get(0).id, 'test'

        closest = el.closest('html')
        assert.lengthOf closest, 1
        assert.equal closest.get(0), document.documentElement

        closest = el.closest('bacon')
        assert.lengthOf closest, 0
