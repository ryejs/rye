assert = chai.assert

$ = Rye

list_items = -> $('.list li')

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
