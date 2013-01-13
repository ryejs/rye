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

    function append(element, attach) {
        if (typeof attach === 'string') {
            element.insertAdjacentHTML('beforeend', attach)
        } else {
            element.appendChild(attach)
        }
    }

    function prepend(element, attach) {
        if (typeof attach === 'string') {
            element.insertAdjacentHTML('afterbegin', attach)
        } else {
            var first = element.childNodes[0]
            if (first) {
                element.insertBefore(attach, first)
            } else {
                element.appendChild(attach)
            }
        }
    }

    function after(element, attach) {
        if (typeof attach === 'string') {
            element.insertAdjacentHTML('afterend', attach)
        } else {
            var next = query.getClosestNode(element, 'nextSibling')
            if (next) {
                element.parentNode.insertBefore(attach, next)
            } else {
                element.parentNode.appendChild(attach)
            }
        }
    }

    function before(element, attach) {
        if (typeof attach === 'string') {
            element.insertAdjacentHTML('beforebegin', attach)
        } else {
            element.parentNode.insertBefore(attach, element)
        }
    }

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

    function exportAttach(method) {
        function proxy(attach) {
            // turn elements to array
            if (attach instanceof Rye) {
                attach = attach.elements
            } else if (util.isNodeList(attach)) {
                attach = _slice.call(attach)
            }

            // call one-by-one
            if (Array.isArray(attach)) {
                attach.forEach(proxy.bind(this))
            // single element collection
            } else if (this.length === 1) {
                method(this.elements[0], attach)
            } else {
                this.each(function(element, i){
                    var node = i > 0 ? attach.cloneNode(true) : attach
                    method(element, node)
                })
            }
            return this
        }
        this[method.name] = proxy
    }

    ;[append, prepend, after, before].forEach(exportAttach.bind(this))


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
          , ret = new Rye()

        temp.innerHTML = html
        for (var child, i = 0, ln = temp.childNodes.length; i < ln; i++) {
            if (child = temp.childNodes[i]) {
                ret.push(temp.removeChild(child))
            }
        }
        return ret
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