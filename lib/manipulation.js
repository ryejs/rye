(function(){

    var DOM    = Rye.require('DOM')
      , util   = Rye.require('Util')
      , _slice = Array.prototype.slice

    // Patch methods and add to prototype.
    // The proxy function coerces the input into either a string or an array of elements,
    // then passes it on to the appropriate method, iterating if necessary.
    util.each({
        append  : DOM.append
      , prepend : DOM.prepend
      , after   : DOM.after
      , before  : DOM.before
    }, function (fn, method) {
        
        Rye.prototype[method] = function (obj) {
            if (typeof obj !== 'string'){
                if (obj instanceof Rye) {
                    obj = obj.elements
                } else if (util.isNodeList(obj)) {
                    obj = _slice.call(obj)
                }
                // Also support arrays [el1, el2, ...]
                if (Array.isArray(obj)) {
                    if (/prepend|before/.test(method)){
                        obj = _slice.call(obj, 0).reverse()
                    }
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
    })

    util.extend(Rye.prototype, {

        text: function (text) {
            return this.each(util.applyLeft(null, DOM.text, [text]))
        }

        html: function (html) {
            return this.each(util.applyLeft(null, DOM.html, [html]))
        }

        empty: function () {
            return this.each(DOM.empty)
        }

        clone: function () {
            return this.map(DOM.clone)
        }

        remove: function () {
            return this.each(DOM.remove)
        }
        
        val: function (value) {
            var first
            if (value == null && first = this.elements[0]) {
                return DOM.getValue(first)
            }
            return this.each(util.applyRight(null, DOM.val, [value])
        }

        attr: function (name, value) {
            if (value == null && first = this.elements[0]) {
                return DOM.attr(first, name)
            }
            return this.each(util.applyRight(null, DOM.val, [value]))
        }

        prop: function (name, value) {
            if (value == null && first = this.elements[0]) {
                return DOM.prop(first, name)
            }
            return this.each(util.applyRight(null, DOM.prop, [value]))
        }
    })

    $.create = function (html) {
        var temp = document.createElement('div')
          , children

        temp.innerHTML = html

        children = _slice.call(temp.childNodes)
        children.forEach(DOM.remove)

        return new Rye(children)
    }

})()