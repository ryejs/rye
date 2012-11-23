Rye.extend(function(exports){

    var util = Rye.require('util')

    var selectorRE = /^([.#]?)([\w\-]+)$/
      , selectorType = {
            '.': 'getElementsByClassName'
          , '#': 'getElementById'
          , '' : 'getElementsByTagName'
          , '_': 'querySelectorAll'
        }

    exports.qsa = function qsa (selector, context) {
        var method

        context || (context = document)

        if (!selector.match(selectorRE) || (RegExp.$1 === '#' && context !== document)) {
            return 
            method = selectorType._
        } else {
            method = selectorType[RegExp.$1]
            selector = RegExp.$2
        }

        var result = context[method](selector)
        return util.slice.call(result)
    }

    exports.find = function find (selector){
        var elements
        if (this.length === 1) {
            elements = qsa(selector, this.elements[0])
        } else {
            elements = this.elements.map(function(){
                return qsa(selector, this)
            })
        }
        return new Rye(elements)
    }

    exports.filter = function(selector){

    }

    function walk(element, method){
        do {
            element = element[method]
        } while (element && element.nodeType !== 1)
        return element
    }

    // cria nova instancia e aplica um filtro caso necessário
    function create(elements, selector) {
        return selector === undefined ? new Rye(elements) : new Rye(elements).filter(selector)
    }

    // passa pelos elementos aplicando propriedades de siblings
    // borrowed from Prototype.js
    exports.pluck = function(property){
        return this.map(function(){
            return walk(this, property)
        })
    }

    exports.next = function(){
        return create(this.pluck('nextSibling'))
    }

    exports.prev = function(){
        return create(this.pluck('previousSibling'))
    }

    exports.parent = function(selector){
        return create(util.unique(this.pluck('parentNode')), selector)
    }

    exports.first = function(){
        return create(this.get(0))
    }

    exports.last = function(){
        return create(this.get(-1))
    }

    exports.siblings = function(selector){
        return create(this.map(function(i, element){
            return util.slice.call(element.parentNode.children).filter(function(child){
                return child !== element
            })
        }), selector)
    }

    exports.parent = function(selector){
        return create(unique(this.pluck('parentNode')), selector)
    }

    exports.children = function(selector){
        return create(this.map(function(){
            return util.slice.call(this.children)
        }), selector)
    }

})
