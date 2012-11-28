assert = chai.assert

$ = Rye

list_items = -> $('.list li')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

suite 'Manipulation', ->

    test 'get html', ->
        assert.equal $('body').html(), document.getElementsByTagName('body')[0].innerHTML

    test 'set html', ->
        x = makeElement 'div'
        contents = '<p><b>X</b></p>'
        $(x).html(contents)
        assert.equal $(x).html(), contents

    test 'append', ->
        x = makeElement 'div', '<span>1</span>'
        contents = '<p>Hello</p>'
        $(x).append(contents)
        assert.lengthOf x.childNodes, 2
        assert.equal x.getElementsByTagName('p')[0].innerText, 'Hello'
        assert.equal x.getElementsByTagName('*')[1].tagName, 'P'

    test 'prepend', ->
        x = makeElement 'div', '<span>2</span>'
        contents = '<p>Hello</p>'
        $(x).prepend(contents)
        assert.lengthOf x.childNodes, 2
        assert.equal x.getElementsByTagName('p')[0].innerText, 'Hello'
        assert.equal x.getElementsByTagName('*')[0].tagName, 'P'

    test 'after', ->
        el = $('#hello')
        el.after('<div id="after"></div>')
        found = $('#after')
        assert.equal el.next().get(0), found.get(0)
        #found.remove() - not implemented

    test 'before', ->
        el = $('#hello')
        el.before('<div id="before"></div>')
        found = $('#before')
        assert.equal el.prev().get(0), found.get(0)
        #found.remove() - not implemented

