Rye.implement(function(exports){

    var data = Rye.require('Data')
      , util = Rye.require('util')

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
})
