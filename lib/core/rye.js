(function(global, undefined){

    function Rye(selector, context){
        inherits(this, Rye.fn)

        this.selector = selector

        if (context !== undefined) {
            this.elements = $(context).find(selector)
        } else if (typeof selector === 'string') {
            this.elements = Rye.util.qsa(document, selector)
        } else {
            this.elements = []
            this.selector = ''
        }
        this.length = this.elements.length
    }

    Rye.fn = {}
    Rye.util = {}


    Rye.fn.get = function(num){
        return this.elements[num < 0 ? this.length + num : num]
    }

    Rye.fn.find = function(selector){
        var elements
        if (this.length === 1) {
            elements = Rye.util.qsa(this.elements[0], selector)
        } else {
            elements = this.map(function(){
                return Rye.util.qsa(this, selector) 
            })
        }
        return $(elements)
    }

    Rye.fn.map = function(fn){

    }

    global.Rye = Rye

})(window)