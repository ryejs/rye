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



    function pluck(element, property){
        return this.map(function(){
            return sibling(this, property)
        })
    }

    function sibling(element, method){
        do {
            element = element[method]
        } while (element && element.nodeType !== 1)
        return element
    }

    export.next = function(){
        return new Rye(pluck(element, 'nextSibling'))
    }

    export.prev = function(){
        return new Rye(pluck(element, 'previousSibling'))
    }

})
