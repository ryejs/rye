assert = chai.assert

$ = Rye

suite 'CSS methods', ->

    test 'show/hide', ->
        el = $('#test')
        el.hide()
        assert.equal el.get(0).style.display, 'none', "Display set to none"
        el.show()
        assert.equal el.get(0).style.display, 'block', "Display set to block"

    test 'show/hide returns Rye', ->
        el = $('#test')
        assert.equal el.hide(), el
        assert.equal el.show(), el

    test 'show/hide preserves display', ->
        el = $('.a')
        el.get(0).style.display = 'inline'
        el.hide()
        el.show()
        assert.equal el.get(0).style.display, 'inline', "Display property is preserved"

    test 'addClass', ->
        el = $('.a')
        el.addClass('b')
        assert.equal el.get(0).className, 'a b', "Class b added"
        el.addClass(' c d ')
        assert.equal el.get(0).className, 'a b c d', "Class c and d added"
        el.addClass('a')
        assert.equal el.get(0).className, 'a b c d'

    test 'addClass fallback', ->
        el = $([])
        el.elements.push({ className: 'a b' })
        el._update()
        el.addClass('a c')
        assert el.get(0).className is 'a b c', "Class .c added, .a ignored"


