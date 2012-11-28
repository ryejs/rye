assert = chai.assert

$ = Rye

list_items = -> $('.list li')

suite 'Manipulation', ->

    test 'get html', ->
        assert.equal $('body').html(), document.getElementsByTagName('body')[0].innerHTML