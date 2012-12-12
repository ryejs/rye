assert = chai.assert

$ = Rye

TouchEvents = Rye.require('TouchEvents')

makeElement = (tagName, html, attrs) ->
    el = document.createElement(tagName)
    el.innerHTML = html
    el[key] = value for key, value of attrs
    return el

suite 'TouchEvents', ->
    