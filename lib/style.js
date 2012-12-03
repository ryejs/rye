Rye.define('Style', function(){

    function camelize (str) {
        return str.replace(/-+(\w)/g, function(_, chr){ return chr.toUpperCase() })
    }

    var cssNumber = 'fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom'.split(' ')

    function getCSS (element, property) {
        return element.style[camelize(property)] 
            || window.getComputedStyle(element, null).getPropertyValue(property)
    }

    function addCSS (element, property, value) {
        property = camelize(property)
        if (typeof value == 'number' && cssNumber.indexOf(property) === -1) {
            value += 'px'
        }
        element.style[property] = value
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

    return {
        getCSS      : getCSS
      , addCSS      : addCSS
      , hasClass    : hasClass
      , addClass    : addClass
      , removeClass : removeClass
    }

})


Rye.implement(function(exports){

    var style = Rye.require('Style')
      , data = Rye.require('Data')
      , _slice  = Array.prototype.slice

    exports.show = function(){
        return this.each(function(element){
            return element.style.display = data.get(element, '_display') || 'block'
        })
    }

    exports.hide = function(){
        return this.each(function(element){
            var style = element.style

            if (style.display !== 'none') {
                data.set(element, '_display', style.display)
            }
            style.display = 'none'
        })
    }

    exports.hasClass = function(name){
        var result = false
        this.each(function(element){
            result = result || style.hasClass(element, name)
        })
        return !!result
    }

    ;['addClass', 'removeClass'].forEach(function(method){
        exports[method] = function(names){
            return this.each(function(element){
                style[method](element, names)
            })
        }
    })

    exports.toggleClass = function(name, when){
        return this.each(function(element){
            if (when == null) {
                when = !style.hasClass(element, name)
            }
            style[when ? 'addClass' : 'removeClass'](element, name)
        })
    }
})
