Rye.extend(function(exports){

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
        matchesSelector = util.prefix(dummyDiv, 'matchesSelector')
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

        if (!selector.match(selectorRE) || (RegExp.$1 === '#' && context !== document)) {
            return 
            method = selectorType._
        } else {
            method = selectorType[RegExp.$1]
            selector = RegExp.$2
        }

        result = context[method](selector)
        return _slice.call(result)
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
        instance = new Rye(selector, context)
        return create(util.unique(this.concat(instance)))
    }

    // Walks the DOM tree using `method`, returns
    // when an element node is found
    function getClosestNode(element, method){
        do {
            element = element[method]
        } while (element && element.nodeType !== 1)
        return element
    }

    // Extract a list with the provided property for each value.
    // This works like underscore's pluck, with the added
    // getClosestNode() method to avoid picking up non-html nodes.
    exports.pluck = function(property){
        return this.map(function(element){
            return getClosestNode(element, property)
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
            return _slice.call(element.parentNode.children).filter(function(child){
                return child !== element
            })
        }), selector)
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
