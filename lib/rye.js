(function(global){

    function Rye (selector, context) {
        if (!(this instanceof Rye)){
            return new Rye(selector, context)
        }

        this.selector = selector

        if (selector instanceof Array) {
            this.elements = selector.filter(Rye.require('util').isElement)

        } else if (selector instanceof NodeList) {
            this.elements = Array.prototype.slice.call(selector)

        } else if (selector instanceof HTMLElement) {
            this.elements = [selector]

        } else {
            this.elements = this.qsa(selector, context)
        }

        this.update()
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