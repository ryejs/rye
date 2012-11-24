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

    exports.addClass = function(name){
        return this.each(function(el){
            el.classList
                ? name.replace(/\w+/g, util.curryMethod(el.classList, 'add', 1))
                : el.className = util.unique(el.className.split(/s+/g)).concat(name.trim()).join(' ')
        })
    }    

})