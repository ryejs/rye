var util = require('./lib/utils')

function Rye (selector, context) {
    if (!(this instanceof Rye)){
        return new Rye(selector, context)
    }

    if (selector instanceof Rye){
        return selector
    }

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

"concat filter map reverse slice sort".split(" ").forEach(function (method) {
        arr[method] = function () {
            return Array.prototype[method].apply(this, arguments)
        }
    })

Rye.version = '0.1.0'

require('./lib/rye-dom')(Rye)

Object.assign(Rye.prototype,
    require('./lib/rye-dom')
)
