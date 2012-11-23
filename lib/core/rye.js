(function(global, undefined){

    function Rye(selector, context){
        inherits(this, Rye.fn)

        this.selector = selector

        if (typeof selector === 'string') {
            this.elements = Rye.util.qsa(selector)
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


    global.Rye = Rye

})(window)