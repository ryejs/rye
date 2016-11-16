function Rye (selector, context) {
    if (!(this instanceof Rye)){
        return new Rye(selector, context)
    }

    if (selector instanceof Rye){
        return selector
    }

    var util = Rye.require('Util')

    if (typeof selector === 'string') {
        this.selector = selector
        this.elements = this.qsa(context, selector)

    } else if (selector instanceof Array) {
        this.elements = util.unique(selector.filter(util.isElement))

    } else if (util.isNodeList(selector)) {
        this.elements = Array.prototype.slice.call(selector).filter(util.isElement)

    } else if (util.isElement(selector)) {
        this.elements = [selector]

    } else {
        this.elements = []
    }

    this._update()
}

Rye.version = '0.1.0'

// Minimalist module system
Rye._modules = {}

Rye.require = function (module) {
    return Rye._modules[module]
}

Rye.define = function (module, fn) {
    Rye._modules[module] = fn.call(Rye.prototype)
}
