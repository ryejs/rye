Rye.implement(function(exports){

    var util = Rye.require('util')

    exports.text = function(text){
        if (text == null) {
            return this.elements[0] && this.elements[0].textContent
        }
        return this.each(function(element){
            element.textContent = text
        })
    }

    exports.html = function(html){
        if (html == null) {
            return this.elements[0] && this.elements[0].innerHTML
        }
        return this.each(function(element){
            element.innerHTML = html
        })
    }

    exports.append = function(html){
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

    exports.prepend = function(html){
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('afterbegin', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                var next = Rye(element).children().get(0)
                element.insertBefore(html, next)
            })

        }
        return this
    }

    exports.after = function(html){
        if (typeof html === 'string') {
            this.each(function(element){
                element.insertAdjacentHTML('afterend', html)
            })

        } else if (util.isElement(html)) {
            this.each(function(element){
                var next = Rye(element).next().get(0)
                if (next) {
                    element.parentNode.insertBefore(html, next)
                } else {
                    element.parentNode.appendChild(html)
                }
            })

        }
        return this
    }

    exports.before = function(html){
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

    exports.val = function(value){
        if (value == null) {
            var element = this.elements[0]
              , value = element.value
            if (element.multiple) {
                value = new Rye(element).find('option').filter(function(option) {
                    return option.selected && !option.disabled
                }).pluck('value')
            }
            return value
        }
        return this.each(function(element){
            element.value = value
        })
    }
})