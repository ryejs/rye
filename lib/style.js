Rye.implement(function(exports){

    var data = Rye.require('Data')

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
                   : element.className.match(new RegExp('\\b' + name + '\\b'))
        })
        return !!result
    }

    exports.addClass = function(names){
        return this.each(function(element){
            names.replace(/\S+/g, function(name){
                if (element.classList) {
                    element.classList.add(name)
                } else {
                    var re = new RegExp('^$|\\b' + name + '\\b|($)')
                    element.className = element.className.replace(re, function(m, isEnd){
                        return isEnd !== undefined ? ' ' + name : name
                    })
                }
            })
        })
    }

    // remove fallback trim final className
    exports.removeClass = function(names){
        return this.each(function(element){
            if (names === undefined) {
                return element.className = ''
            } else {
                names.replace(/\S+/g, function(name){
                    if (element.classList) {
                        element.classList.remove(name)
                    } else {
                        var re = new RegExp('\\s*\\b' + name + '\\b\\s*')
                        element.className = element.className.replace(re, ' ').trim()
                    }
                })
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
