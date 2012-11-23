Rye.extend(function(export){

    var selectorRE = /^([.#]?)([\w\-]+)$/
      , selectorType = {
            '.': 'getElementsByClassName'
          , '#': 'getElementById'
          , '' : 'getElementsByTagName'
          , '_': 'querySelectorAll'
        }

    function qsa (selector, context) {
        var method

        context || context = document

        if (!selector.match(selectorRE) || (RegExp.$1 === '#' && context !== document)) {
            return 
            method = selectorType._
        } else {
            method = selectorType[RegExp.$1]
            selector = RegExp.$2
        }

        var result = context[method](selector)
        return Array.prototype.slice.call(result)
    }

    export.find = function(selector){
        var elements
        if (this.elements.length === 1) {
            elements = qsa(selector, this.elements[0])
        } else {
            elements = this.elements.map(function(){
                return qsa(selector, this)
            })
        }
        return Rye(elements)
    }

    export.get = function(num){
        return this.elements[num < 0 ? this.elements.length + num : num]
    }

    export.map = function(fn){

    }

})
