assert = chai.assert

$ = Rye

suite 'CSS methods', ->

    test 'show/hide', ->
        el = $('#test')
        el.hide()
        assert el.get(0).style.display is 'none', "Display set to none"
        el.show()
        assert el.get(0).style.display is 'block', "Display set to block"

    test 'show/hide preserve Rye', ->
        el = $('#test')
        
        assert el.hide() is el, "Display set to none"
        assert el.show() is el, "Display set to block"

    test 'show/hide preserves display', ->
        el = $('.a')
        el.get(0).style.display = 'inline'
        el.hide()
        el.show()
        assert el.get(0).style.display is 'inline', "Display property is preserved"