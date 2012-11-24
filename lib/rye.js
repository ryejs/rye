(function(global){

    function Rye (selector, context) {
        if (!(this instanceof Rye)){
            return new Rye(selector, context)
        }

        if (selector instanceof Rye){
            return selector
        }

        var util = Rye.require('util')

        if (selector instanceof Array) {
            this.elements = selector.filter(util.isElement)

        } else if (util.isNodeList(selector)) {
            this.elements = Array.prototype.slice.call(selector)

        } else if (selector instanceof HTMLElement) {
            this.elements = [selector]

        } else {
            this.selector = selector
            this.elements = this.qsa(selector, context)
        }

        this._update()
    }

    // Minimalist module system
    var modules = {}
    Rye.require = function (module) {
        return modules[module]
    }
    Rye.define = function (module, fn) {
        modules[module] = fn(Rye)
    }
    Rye.implement = function (fn) {
        fn.call(Rye, Rye.prototype)
    }

    // Export global object
    global.Rye = Rye

})(window)
