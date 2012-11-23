Rye.implement(function(exports){

    var data = Rye.require('Data')

    exports.show = function(){
        this.forEach(function(element){
            return element.style.display = data.get(element, '_display') || 'block'
        })
    }

    exports.hide = function(){
        this.forEach(function(element){
            var style = element.style

            if (style.display !== 'none') {
                data.set(element, '_display', style.display)
            }
            style.display = 'none'
        })
    }

})