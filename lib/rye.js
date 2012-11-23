(function(global){

    function Rye (selector, context) {
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

    // Minimalist module system
    var modules = {}
    Rye.require = function (module) {
        return modules[module]
    }
    Rye.define = function (module, fn) {
        modules[module] = fn(Rye)
    }
    Rye.extend = function (fn) {
        fn.call(Rye, Rye)
    }
    
    // Export global object
    global.Rye = Rye

})(window)