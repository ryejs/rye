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

    test 'hasClass', ->
        el = $('.a')

        assert.isTrue el.hasClass('a')
        assert.isFalse el.hasClass('b')

    test 'hasClass fallback', ->
        el = $([])
        el.elements.push({ className: ' a b' })
        
        assert.isTrue el.hasClass('a')
        assert.isFalse el.hasClass('c')

    test 'addClass', ->
        el = $('.a')
        el.addClass('b')
        assert.equal el.get(0).className, 'a b', "Class b added"
        el.addClass(' c d ')
        assert.equal el.get(0).className, 'a b c d', "Class c and d added"
        el.addClass('a')
        assert.equal el.get(0).className, 'a b c d'
        el.addClass('with-a')
        assert.equal el.get(0).className, 'a b c d with-a'

        el = $(document.createElement('div'))
        el.addClass('with-a')
        assert.equal el.get(0).className, 'with-a'

    test 'addClass fallback', ->
        el = $([])
        el.elements.push({ className: ' a b' })
        el._update()
        el.addClass('   a c')
        assert.equal el.get(0).className, ' a b c', "Class .c added, .a ignored"

    test 'removeClass', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.removeClass('a')
        assert.equal el.get(0).className, 'b   c ', "Class .a removed"
        el.removeClass('b w')
        assert.equal el.get(0).className, 'c ', "Class .b removed, .w ignored"
    
    test 'removeClass all', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.removeClass()
        assert.equal el.get(0).className, '', "All classes removed"

    test 'removeClass fallback', ->
        el = $([])
        el.elements.push({ className: ' a b  ' })
        el._update()
        el.removeClass('  b d')
        assert.equal el.get(0).className, 'a', "Class .b removed, .d ignored"


