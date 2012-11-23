Rye.implement(function(exports){

    var util = Rye.require('util')
      , _slice  = Array.prototype.slice
      , _filter = Array.prototype.filter

    var selectorRE = /^([.#]?)([\w\-]+)$/
      , selectorType = {
            '.': 'getElementsByClassName'
          , '#': 'getElementById'
          , '' : 'getElementsByTagName'
          , '_': 'querySelectorAll'
        }
      , dummyDiv = document.createElement('div')

    // Creates a new Rye instance applying a filter if necessary
    function create(elements, selector) {
        return selector === undefined ? new Rye(elements) : new Rye(elements).filter(selector)
    }

    function matches(element, selector) {
        var matchesSelector, match
        if (!element || element.nodeType !== 1) {
            return false
        }
        matchesSelector = util.prefix('matchesSelector', dummyDiv)
        if (matchesSelector) {
            return matchesSelector.call(element, selector)
        }
        // fall back to performing a selector:
        if (!element.parentNode) {
            dummyDiv.appendChild(element)
        }
        match = ~qsa(element.parentNode, selector).indexOf(element)
        if (element.parentNode === dummyDiv) {
            dummyDiv.removeChild(element)
        }
        return match
    }

    exports.qsa = function qsa (selector, context) {
        var method, result

        context || (context = document)
        // http://jsperf.com/getelementbyid-vs-queryselector/11
        if (!selector.match(selectorRE) || (RegExp.$1 === '#' && context !== document)) {
            method = selectorType._
        } else {
            method = selectorType[RegExp.$1]
            selector = RegExp.$2
        }

        result = context[method](selector)

        if (result instanceof NodeList){
            return _slice.call(result)
        }

        if (util.isElement(result)){
            return [result]
        }

        return []
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
        return create(elements)
    }

    exports.filter = function(selector){
        return create(_filter.call(this.elements, function(element){
            return matches(element, selector)
        }))
    }

    exports.is = function(selector){
        return this.length > 0 && this.filter(selector).length > 0
    }
    
    exports.add = function(selector, context){
        var instance = new Rye(selector, context)
        return create(util.unique(this.concat(instance.elements)))
    }

    // Walks the DOM tree using `method`, returns
    // when an element node is found
    function getClosestNode(element, method){
        do {
            element = element[method]
        } while (element && !util.isElement(element))
        return element
    }

    // Extract a list with the provided property for each value.
    // This works like underscore's pluck, with the added
    // getClosestNode() method to avoid picking up non-html nodes.
    exports.pluckNode = function(property){
        return this.map(function(element){
            return getClosestNode(element, property)
        })
    }

    exports.pluck = function(property){
        return util.pluck(this.elements, property)
    }

    exports.next = function(){
        return create(this.pluckNode('nextSibling'))
    }

    exports.prev = function(){
        return create(this.pluckNode('previousSibling'))
    }

    exports.parent = function(selector){
        return create(util.unique(this.pluckNode('parentNode')), selector)
    }

    exports.first = function(){
        return create(this.get(0))
    }

    exports.last = function(){
        return create(this.get(-1))
    }

    exports.siblings = function(selector){
        var siblings = []
        this.forEach(function(element){
            _slice.call(element.parentNode.childNodes).forEach(function(child){
                if (util.isElement(child) && child !== element){
                    siblings.push(child)
                }
            })
        })
        return create(util.unique(siblings), selector)
    }

    exports.parent = function(selector){
        return create(util.unique(this.pluck('parentNode')), selector)
    }

    exports.children = function(selector){
        return create(this.map(function(){
            return _slice.call(this.children)
        }), selector)
    }

})
