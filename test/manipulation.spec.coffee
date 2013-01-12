
suite 'Manipulation', ->

    test 'get text', ->
        div = makeElement 'div', '<p>x</p>'
        el = $(div)
        assert.equal el.text(), 'x'

    test 'set text', ->
        div = makeElement 'div'
        el = $(div).text('<')
        assert.equal el.html(), '&lt;'

    test 'get html', ->
        assert.equal $('body').html(), document.getElementsByTagName('body')[0].innerHTML

    test 'set html', ->
        div = makeElement 'div'
        contents = '<p><b>X</b></p>'
        $(div).html(contents)
        assert.equal $(div).html(), contents

    test 'create elements', ->
        div = $.create """
            <div class="yes">
                <p>Hi</p>
            </div>
        """
        assert.equal div.get(0).querySelector('p').textContent, 'Hi'

    test 'create elements multiple', ->
        div = $.create """
            <div class="one">1</div>
            <div class="two">2</div>
        """
        assert.equal div.length, 2
        assert.equal div.get(0).className, 'one'
        assert.equal div.get(1).className, 'two'

    test 'empty', ->
        div = makeElement 'div', '<p>a</p><p>b</p><p>c</p>'
        el = $(div).children()
        el.empty()
        assert.equal el.get(0).innerHTML, ''
        assert.equal el.get(1).innerHTML, ''
        assert.equal el.get(2).innerHTML, ''

    test 'append', ->
        div = makeElement 'div', '<span>1</span>'
        contents = '<p>Hello</p>'
        $(div).append(contents)
        assert.lengthOf div.childNodes, 2
        assert.equal div.getElementsByTagName('p')[0].textContent, 'Hello'
        assert.equal div.getElementsByTagName('*')[1].tagName, 'P'

    test 'append element', ->
        el = makeElement 'p', 'test', { className: 'test-append-element' }
        $('#test').append(el)
        assert.lengthOf $('#test .test-append-element'), 1
        assert.equal $('#test .content').next().get(0), el
        assert.equal $('#test p').get(-1), el

    test 'append element to elements', ->
        el = makeElement 'p', 'test', { className: 'test-append-element' }
        list = list_items()
        list.append(el)
        assert.lengthOf list.find('.test-append-element'), 3

    test 'prepend', ->
        div = makeElement 'div', '<span>2</span>'
        contents = '<p>Hello</p>'
        $(div).prepend(contents)
        assert.lengthOf div.childNodes, 2
        assert.equal div.getElementsByTagName('p')[0].textContent, 'Hello'
        assert.equal div.getElementsByTagName('*')[0].tagName, 'P'

    test 'prepend element', ->
        el = makeElement 'p', 'test', { className: 'test-prepend-element' }
        $('#test').prepend(el)
        assert.lengthOf $('#test .test-prepend-element'), 1
        assert.equal $('#test p').get(0), el

    test 'prepend to a collection', ->
        el = makeElement 'p', 'test', { className: 'test-append-element' }
        list = list_items()
        list.prepend(el)
        assert.lengthOf list.find('.test-append-element'), 3

    test 'prepend to empty', ->
        el = makeElement 'p', 'test', { className: 'test-prepend-element' }
        item = list_items().filter('.a')
        item.prepend(el)
        assert.lengthOf item.children(), 1

    test 'after with html', ->
        el = $('#hello')
        el.after('<div id="after"></div>')
        found = $('#after')
        assert.equal el.next().get(0), found.get(0)
        #found.remove() - not implemented

    test 'after with element', ->
        el = $('#hello')
        div = makeElement 'div', null, { id: 'after-element' }
        el.after(div)
        found = $('#after-element')
        assert.equal el.next().get(0), found.get(0)

        el = $('.list .c')
        li = makeElement 'li', null, { id: 'after-element' }
        el.after(li)
        assert.equal el.next().get(0), li
        assert.equal $('.list li').last().get(0), li

    test 'after to collection', ->
        list = list_items()
        li = makeElement 'li', null, { class: 'after-element' }
        list.after(li)
        assert.equal list_items().length, 6

    test 'before with html', ->
        el = $('#hello')
        el.before('<div id="before"></div>')
        found = $('#before')
        assert.equal el.prev().get(0), found.get(0)

    test 'before with element', ->
        el = $('#hello')
        div = makeElement 'div', null, { id: 'before-element' }
        el.before(div)
        found = $('#before-element')
        assert.equal el.prev().get(0), found.get(0)

    test 'before to collection', ->
        list = list_items()
        li = makeElement 'li', null, { class: 'before-element' }
        list.before(li)
        assert.equal list_items().length, 6

    test 'clone', ->
        div = makeElement 'div', 'content'
        el = $(div)
        cloned = el.clone()
        assert.notEqual cloned.get(0), el.get(0)
        assert.equal cloned.html(), el.html()

    test 'remove', ->
        list = list_items()
        list.filter('.a').remove()
        assert.lengthOf list_items(), 2

    test 'set val', ->
        input = makeElement 'input', '', value: 'foo'
        el = $(input).val('bar')
        assert.equal input.value, 'bar'

        div = makeElement 'div', '<select><option value="foo">f</option><option value="bar">b</option></select>'
        el = $(div).children().val('bar')
        assert.isTrue el.find('option').get(1).selected

    test 'get val', ->
        input = makeElement 'input', '', value: 'foo'
        assert.equal $(input).val(), 'foo'

        div = makeElement 'div', '<select><option value="foo">f</option><option value="bar" selected>b</option></select>'
        assert.equal $(div).find('select').val(), 'bar'

        div = makeElement 'div', '<select multiple><option value="foo" selected>f</option><option value="bar" selected>b</option><option value="fizz" disabled selected>f</option></select>'
        assert.deepEqual $(div).find('select').val(), ['foo', 'bar']

    test 'get attr', ->
        input = document.createElement('input')
        input.title = 'title'
        input.value = 'value'
        el = $(input)
        assert.equal el.attr('title'), 'title'
        assert.equal el.attr('value'), 'value'

    test 'set attr', ->
        input = document.createElement('input')
        el = $(input)
        el.attr('value', 'value')
        assert.equal input.value, 'value'

        el.attr 'title': 'title'
        assert.equal input.getAttribute('title'), 'title'

        el.attr 'title': ''
        assert.equal input.getAttribute('title'), ''

    test 'get prop', ->
        input = document.createElement('input')
        input.title = 'title'
        el = $(input)
        assert.equal el.prop('title'), 'title'

    test 'set prop', ->
        input = document.createElement('input')
        el = $(input)
        el.prop('title', 'title')
        assert.equal input.title, 'title'

        el.prop 'title': 'title'
        assert.equal input.title, 'title'

        el.prop 'title': ''
        assert.equal input.title, ''




