Rye.define('Manipulation', function(){

    var util = Rye.require('Util')

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

    this.empty = this.iterate(function(element){
        element.innerHTML = ''
    })

    this.append = function (html) {
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('beforeend', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                element.appendChild(html)
            })

        }
        return this
    }

    this.prepend = function (html) {
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('afterbegin', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                var next = new Rye(element).children().get(0)
                element.insertBefore(html, next)
            })

        }
        return this
    }

    this.after = function (html) {
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('afterend', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                var next = new Rye(element).next().get(0)
                if (next) {
                    element.parentNode.insertBefore(html, next)
                } else {
                    element.parentNode.appendChild(html)
                }
            })

        }
        return this
    }

    this.before = function (html) {
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('beforebegin', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                element.parentNode.insertBefore(html, element)
            })

        }
        return this
    }

    this.clone = function () {
        return this.map(function(element){
            return element.cloneNode(true)
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
                Object.keys(name).forEach(function(key){
                    element.setAttribute(key, name[key])
                })
            })
        }
        if (typeof name === 'string'){
            return typeof value === 'undefined'
                ? this.elements[0] && getAttribute(this.elements[0], name)
                : this.each(function(element){
                    element.setAttribute(name, value)
                })

        }
        return this
    }

    this.prop = function (name, value) {
        if (typeof name === 'object'){
            return this.each(function(element){
                Object.keys(name).forEach(function(key){
                    element[key] = name[key]
                })
            })
        }
        if (typeof name === 'string'){
            return typeof value === 'undefined'
                ? this.elements[0] && this.elements[0][name]
                : this.put(name, value)
        }
        return this
    }

    return {
        getValue     : getValue
      , getAttribute : getAttribute
    }
})