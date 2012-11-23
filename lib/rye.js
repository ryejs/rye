(function(global){

    function Rye (selector, context) {
        if (!(this instanceof Rye)){
            return new Rye(selector, context)
        }

        this.elements = []
        this.selector = selector

        if (context !== undefined) {
            this.elements = $(context).find(selector)
        } else if (typeof selector === 'string') {
            this.elements = Rye.qsa(document, selector)
        }
    }

    // Minimalist module system
    var modules = {}
    Rye.require = function (module) {
        return modules[module]
    }
    Rye.define = function (module, fn) {
        modules[module] = fn(Rye)
    }
    Rye.extend = function (fn) {
        fn.call(Rye, Rye.prototype)
    }
    
    // Export global object
    global.Rye = Rye

})(window)