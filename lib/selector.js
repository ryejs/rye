Rye.extend(function(export){

    var selectorRE = /^([.#]?)([\w\-]+)$/
      , selectorType = {
            '.': 'getElementsByClassName'
          , '#': 'getElementById'
          , '' : 'getElementsByTagName'
          , '_': 'querySelectorAll'
        }
    
    Rye.fn.get = function(num){
        return this.elements[num < 0 ? this.elements.length + num : num]
    }

    Rye.fn.find = function(selector){
        var elemets
        if (this.elements.length === 1) {
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