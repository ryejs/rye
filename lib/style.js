Rye.define('Style', function(exports){

    var data = Rye.require('Data')
      , _cssNumber = 'fill-opacity font-weight line-height opacity orphans widows z-index zoom'.split(' ')

    function getCSS (element, property) {
        return element.style.getPropertyValue(property)
            || window.getComputedStyle(element, null).getPropertyValue(property)
    }

    function setCSS (element, property, value) {
        if (typeof value == 'number' && _cssNumber.indexOf(property) === -1) {
            value += 'px'
        }
        element.style.setProperty(property, value)
        return element
    }

    function hasClass (element, name) {
        name = name.trim()
        return element.classList ? 
               element.classList.contains(name)
             : (' ' + element.className + ' ').indexOf(' ' + name + ' ') !== -1
    }

    function addClass (element, names) {
        if (element.classList) {
            names.replace(/\S+/g, function(name){ element.classList.add(name) })
        } else {
            var classes = ' ' + element.className + ' ', name
            names = names.trim().split(/\s+/)
            while (name = names.shift()) {
                if (classes.indexOf(' ' + name + ' ') === -1) { 
                    classes += name + ' '
                }
            }
            element.className = classes.trim()
        }
        return element
    }

    function removeClass (element, names) {
        if (names === '*') {
            element.className = ''
        } else {
            if (names instanceof RegExp) {
                names = [names]
            } else if (element.classList && names.indexOf('*') === -1) {
                names.replace(/\S+/g, function(name){ element.classList.remove(name) })
                return
            } else {
                names = names.trim().split(/\s+/)
            }

            var classes = ' ' + element.className + ' ', name
            while (name = names.shift()) {
                if (name.indexOf && name.indexOf('*') !== -1) {
                    name = new RegExp('\\s*\\b' + name.replace('*', '\\S*') + '\\b\\s*', 'g')
                }
                if (name instanceof RegExp) {
                    classes = classes.replace(name, ' ')
                } else {
                    while (classes.indexOf(' ' + name + ' ') !== -1) {
                        classes = classes.replace(' ' + name + ' ', ' ')
                    }
                }
            }
            element.className = classes.trim()
        }
        return element
    }


    exports.show = function(){
        return this.each(function(element){
            setCSS(element, 'display', data.get(element, '_display') || 'block')
        })
    }

    exports.hide = function(){
        return this.each(function(element){
            var _display = getCSS(element, 'display')
            if (_display !== 'none') {
                data.set(element, '_display', _display)
            }
            setCSS(element, 'display', 'none')
        })
    }

    exports.css = function(property, value){
        if (value == null) {
            if (typeof property == 'string') {
                return this.elements[0] && getCSS(this.elements[0], property)
            }

            return this.each(function(element){
                for (var key in property) {
                    setCSS(element, key, property[key])
                }
            })
        }
        return this.each(function(element){
            setCSS(element, property, value)
        })
    }

    exports.hasClass = function(name){
        var result = false
        this.each(function(element){
            result = result || hasClass(element, name)
        })
        return !!result
    }

    exports.addClass = function(names){
        return this.each(function(element){
            addClass(element, names)
        })
    }

    exports.removeClass = function(names){
        return this.each(function(element){
            removeClass(element, names)
        })
    }

    exports.toggleClass = function(name, when){
        return this.each(function(element){
            if (when == null) {
                when = !hasClass(element, name)
            }
            (when ? addClass : removeClass)(element, name)
        })
    }


    return {
        getCSS      : getCSS
      , setCSS      : setCSS
      , hasClass    : hasClass
      , addClass    : addClass
      , removeClass : removeClass
    }
})
