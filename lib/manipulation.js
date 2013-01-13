Rye.define('Manipulation', function(){

    var util = Rye.require('Util')
      , query = Rye.require('Query')
      , _slice = Array.prototype.slice

    function getValue(element) {
        if (element.multiple) {
            return new Rye(element).find('option').filter(function(option) {
                return option.selected && !option.disabled
            }).pluck('value')
        }
        return element.value
    }

    function getAttribute(element, name) {
        if (name === 'value' && element.nodeName == 'INPUT') {
            return getValue(element)
        }
        return element.getAttribute(name)
    }

    function append (element, html) {
        if (typeof html === 'string') {
            element.insertAdjacentHTML('beforeend', html)
        } else {
            element.appendChild(html)
        }
    }

    function prepend (element, html) {
        var first
        if (typeof html === 'string') {
            element.insertAdjacentHTML('afterbegin', html)
        } else if (first = element.childNodes[0]){
            element.insertBefore(html, first)
        } else {
            element.appendChild(html)
        }
    }

    function after (element, html) {
        var next
        if (typeof html === 'string') {
            element.insertAdjacentHTML('afterend', html)
        } else if (next = query.getClosestNode(element, 'nextSibling')) {
            element.parentNode.insertBefore(html, next)
        } else {
            element.parentNode.appendChild(html)
        }
    }

    function before (element, html) {
        if (typeof html === 'string') {
            element.insertAdjacentHTML('beforebegin', html)
        } else {
            element.parentNode.insertBefore(html, element)
        }
    }

    function proxyExport(fn, method) {
        // This function coerces the input into either a string or an array of elements,
        // then passes it on to the appropriate method, iterating if necessary.
        this[method] = function (obj) {

            if (typeof obj !== 'string'){
                if (obj instanceof Rye) {
                    obj = obj.elements
                } else if (util.isNodeList(obj)) {
                    obj = _slice.call(obj)
                }
                // Also support arrays [el1, el2, ...]
                if (Array.isArray(obj)) {
                    return obj.forEach(this[method].bind(this))
                }
            }

            if (this.length === 1) {
                fn(this.elements[0], obj)
            } else {
                this.each(function(element, i){
                    var node = i > 0 ? obj.cloneNode(true) : obj
                    fn(element, node)
                })
            }
            return this
        }
    }

    // Patch methods, add to prototype
    util.each({
        append  : append
      , prepend : prepend
      , after   : after
      , before  : before
    }, proxyExport.bind(this))


    this.text = function (text) {
        if (text == null) {
            return this.elements[0] && this.elements[0].textContent
        }
        return this.each(function(element){
            element.textContent = text
        })
    }

    this.html = function (html) {
        if (html == null) {
            return this.elements[0] && this.elements[0].innerHTML
        }
        return this.each(function(element){
            element.innerHTML = html
        })
    }

    this.empty = function () {
        return this.put('innerHTML', '')
    }

    this.clone = function () {
        return this.map(function(element){
            return element.cloneNode(true)
        })
    }

    this.remove = function () {
        return this.each(function(element){
            if (element.parentNode) {
                element.parentNode.removeChild(element)
            }
        })
    }

    this.val = function (value) {
        if (value == null) {
            return this.elements[0] && getValue(this.elements[0])
        }
        return this.each(function(element){
            element.value = value
        })
    }

    this.attr = function (name, value) {
        if (typeof name === 'object'){
            return this.each(function(element){
                util.each(name, function(value, key){
                    element.setAttribute(key, value)
                })
            })
        }
        return typeof value === 'undefined'
          ? this.elements[0] && getAttribute(this.elements[0], name)
          : this.each(function(element){
                element.setAttribute(name, value)
            })
    }

    this.prop = function (name, value) {
        if (typeof name === 'object'){
            return this.each(function(element){
                util.each(name, function(value, key){
                    element[key] = value
                })
            })
        }
        return typeof value === 'undefined'
          ? this.elements[0] && this.elements[0][name]
          : this.put(name, value)
    }

    Rye.create = function (html) {
        var temp = document.createElement('div')
          , children

        temp.innerHTML = html

        children = _slice.call(temp.childNodes)
        children.forEach(function(node, i){
            temp.removeChild(node)
        })

        return new Rye(children)
    }

    return {
        getValue     : getValue
      , getAttribute : getAttribute
      , append       : append
      , prepend      : prepend
      , after        : after
      , before       : before
    }

})