Rye.implement(function(exports){

    var data = Rye.require('Data')

    exports.show = function(){
        this.each(function(el){
            return el.style.display = data.get(el, '_display') || 'block'
        })
    }

    exports.hide = function(){
        this.each(function(el){
            var style = el.style

            if (style.display !== 'none') {
                data.set(el, '_display', el.style.display)
            }

            style.display = 'none'
        })
    }

})