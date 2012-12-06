assert = chai.assert

$ = Rye

Style = Rye.require('Style')

suite 'Style methods', ->

    test 'getCSS', ->
        div = document.createElement('div')
        div.style.marginLeft = '2px'
        assert.equal Style.getCSS(div, 'margin-left'), '2px'

        test = document.getElementById('test')
        assert.equal Style.getCSS(test, 'position'), 'absolute'
    
    test 'setCSS', ->
        div = document.createElement('div')
        Style.setCSS(div, 'margin-left', 2)
        assert.equal div.style.marginLeft, '2px'

        Style.setCSS(div, 'zoom', 2)
        assert.equal div.style.zoom, 2

        Style.setCSS(div, 'zoom', '')
        Style.setCSS(div, 'margin-left', '')
        assert.isFalse !!div.getAttribute('style')

    test 'get css', ->
        div = document.createElement('div')
        div.style.marginLeft = '2px'
        el = $(div)
        assert.equal el.css('margin-left'), '2px'

    test 'set css', ->
        div = document.createElement('div')
        el = $(div)
        el.css('margin-left', 2)
        assert.equal div.style.marginLeft, '2px'

        el.css 'margin-right': 3
        assert.equal div.style.marginRight, '3px'

        el.css 'margin': ''
        assert.isFalse !!div.getAttribute('style')

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

    getClass = (el) ->
        el.get(0).className.trim().split(/\s+/)

    test 'addClass', ->
        el = $('.a')
        el.addClass('b')
        assert.deepEqual getClass(el), ['a', 'b']

        el.addClass(' c d ')
        assert.deepEqual getClass(el), ['a', 'b', 'c', 'd']

        el.addClass('a')
        assert.deepEqual getClass(el), ['a', 'b', 'c', 'd']

        el.addClass('with-a')
        assert.deepEqual getClass(el), ['a', 'b', 'c', 'd', 'with-a']

        el = $(document.createElement('div'))
        el.addClass('with-a')
        assert.deepEqual getClass(el), ['with-a']

    test 'addClass fallback', ->
        el = $([])
        el.elements.push({ className: ' a b' })
        el._update()
        el.addClass('   a c')
        assert.deepEqual getClass(el), ['a', 'b', 'c']

    test 'removeClass', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.removeClass('a')
        assert.deepEqual getClass(el), ['b', 'c'], "Class .a removed"
        el.removeClass('b w')
        assert.deepEqual getClass(el), ['c'], "Class .b removed, .w ignored"
    
    test 'removeClass all', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.removeClass('*')
        assert.equal div.className, '', "All classes removed with *"

        div.className = '  a b   c '
        el.removeClass(/.*/)
        assert.equal div.className, '', "All classes removed with /.*/"    
    
    test 'removeClass *', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  class-a class-b   class-c '
        el.removeClass('class-*')
        assert.equal div.className, ''

        div.className = '  class-a b   class-c '
        el.removeClass('class-*')
        assert.deepEqual getClass(el), ['b'] 

    test 'removeClass regexp', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  class-a class-b   class-c '
        el.removeClass(/\bclass-\S\b/)
        assert.deepEqual getClass(el), ['class-b', 'class-c']

        div.className = '  class-a class-b   class-c ops'
        el.removeClass(/\bclass-\S\b/g)
        assert.deepEqual getClass(el), ['ops']

    test 'removeClass mix', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  class-a class-b   class-c a b c'
        el.removeClass('class-* b')
        assert.deepEqual getClass(el), ['a', 'c']

    test 'removeClass fallback', ->
        el = $([])
        el.elements.push({ className: ' a b  ' })
        el._update()
        el.removeClass('  b d')
        assert.deepEqual getClass(el), ['a'], "Class .b removed, .d ignored"

    test 'toggleClass', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.toggleClass('a')
        assert.deepEqual getClass(el), ['b', 'c'], "Class .a removed"
        el.toggleClass('a')
        assert.deepEqual getClass(el), ['b', 'c', 'a'], "Class .a added" 

    test 'toggleClass forced', ->
        div = document.createElement('div')
        el = $(div)
        div.className = '  a b   c '
        el.toggleClass('a', true)
        assert.deepEqual getClass(el), ['a', 'b', 'c'], "Nothing happens"
        el.toggleClass('d', false)
        assert.deepEqual getClass(el), ['a', 'b', 'c'], "Nothing happens"
        el.toggleClass('d', true)
        assert.deepEqual getClass(el), ['a', 'b', 'c', 'd'], "Class .d added"


