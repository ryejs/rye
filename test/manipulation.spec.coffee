assert = chai.assert

$ = Rye

list_items = -> $('.list li')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

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

    test 'append', ->
        div = makeElement 'div', '<span>1</span>'
        contents = '<p>Hello</p>'
        $(div).append(contents)
        assert.lengthOf div.childNodes, 2
        assert.equal div.getElementsByTagName('p')[0].innerText, 'Hello'
        assert.equal div.getElementsByTagName('*')[1].tagName, 'P'

    test 'append element', ->
        el = makeElement 'p', 'test', { className: 'test-append-element' }
        $('#test').append(el)
        assert.lengthOf $('#test .test-append-element'), 1
        assert.equal $('#test .content').next().get(0), el
        assert.equal $('#test p').get(-1), el

    test 'prepend', ->
        div = makeElement 'div', '<span>2</span>'
        contents = '<p>Hello</p>'
        $(div).prepend(contents)
        assert.lengthOf div.childNodes, 2
        assert.equal div.getElementsByTagName('p')[0].innerText, 'Hello'
        assert.equal div.getElementsByTagName('*')[0].tagName, 'P'

    test 'prepend element', ->
        el = makeElement 'p', 'test', { className: 'test-prepend-element' }
        $('#test').prepend(el)
        assert.lengthOf $('#test .test-prepend-element'), 1
        assert.equal $('#test p').get(0), el

    test 'after', ->
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

    test 'before', ->
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

