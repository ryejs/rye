Rye.define('Manipulation', function(){

    var util = Rye.require('Util')

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

    this.val = function (value) {
        if (value == null) {
            var element = this.elements[0]
            if (element.multiple) {
                return new Rye(element).find('option').filter(function(option) {
                    return option.selected && !option.disabled
                }).pluck('value')
            }
            return element.value
        }
        return this.each(function(element){
            element.value = value
        })
    }
})