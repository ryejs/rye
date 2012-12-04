(function(global){

    function Rye (selector, context) {
        if (!(this instanceof Rye)){
            return new Rye(selector, context)
        }

        if (selector instanceof Rye){
            return selector
        }

        var util = Rye.require('util')

        if (typeof selector === 'string') {
            this.selector = selector
            this.elements = this.qsa(context, selector)

        } else if (selector instanceof Array) {
            this.elements = util.unique(selector.filter(util.isElement))

        } else if (util.isNodeList(selector)) {
            this.elements = Array.prototype.slice.call(selector)

        } else if (util.isElement(selector)) {
            this.elements = [selector]

        } else {
            this.elements = []
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
