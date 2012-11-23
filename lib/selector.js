Rye.extend(function(rye){

    var selectorRE = /^([.#]?)([\w\-]+)$/
      , selectorType = {
            '.': 'getElementsByClassName'
          , '#': 'getElementById'
          , '' : 'getElementsByTagName'
          , '_': 'querySelectorAll'
        }

    var table = document.createElement('table')
    , tableRow = document.createElement('tr')
    , containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
      }

    var fragmentRE = /^\s*<(\w+|!)[^>]*>/

    Rye.html = function(html){
        var name = fragmentRE.test(html) && RegExp.$1
            container = containers[name] || containers['*']

        container.innerHTML = html
        return $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
        })
    }

    Rye.fn.get = function(num){
        return this.elements[num < 0 ? this.length + num : num]
    }

    Rye.fn.find = function(selector){
        var elemets
        if (this.length === 1) {
            elements = Rye.util.qsa(this.elements[0], selector)
        } else {
            elements = this.map(function(){
                return Rye.util.qsa(this, selector) 
            })
        }
        return $(elements)
    }

    Rye.fn.map = function(fn){

    }

    function qsa(element, selector) {
        var type

        if (
            !selector.match(selectorRE) 
         || (RegExp.$1 === '#' && element !== document)
        ) {
            type = selectorType._
        } else {
            type = selectorType[RegExp.$1]
            selector = RegExp.$2
        }

        return Rye.slice.call(element[type](selector))
    }

    return {
        qsa: qsa
    }
})