Rye.implement(function(exports){

    var data = Rye.require('Data')
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
        name = name.trim()
        this.each(function(element){
            result = result || element.classList ? 
                     element.classList.contains(name)
                   : (' ' + element.className + ' ').indexOf(' ' + name + ' ') !== -1
        })
        return !!result
    }

    exports.addClass = function(names){
        return this.each(function(element){
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
        })
    }

    exports.removeClass = function(names){
        return this.each(function(element){
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
        })
    }

    exports.toggleClass = function(name, when){
        return this.each(function(element){
            if (when == null) {
                when = !new Rye(element).hasClass(name)
            }
            new Rye(element)[(when ? 'add' : 'remove') + 'Class'](name)
        })
    }
})
