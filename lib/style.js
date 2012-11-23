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
        return this.each(function(element){
            var classList
            if (element.classList) {
                name.split(/\s+/g).forEach(function(className) {
                    if (className.match(/\S/)) {
                        element.classList.add(className)
                    }
                })
            } else {
                classList = util.unique((' ' + element.className + ' ' + name).split(/\s+/g))
                element.className = classList.slice(1).join(' ')
            }
        })
    }

    /*
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = this.className, newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      })
    },*/

})