Rye.extend(function(exports){

    var util = Rye.require('util')
      , _slice  = Array.prototype.slice

    exports.get = function (index) {
        if (index == null) {
            return this.elements.slice()
        }
        return this.elements[index < 0 ? this.elements.length + index : index]
    }

    exports.eq = function (index) {
        if (index == null) {
            return new Rye()
        }
        return new Rye(this.get(index))
    }

    exports.forEach = function (fn) {
        this.elements.forEach(fn)
        return this
    }

    exports.each = function(fn){
        return this.forEach(function(element, i){
            fn.call(element, i, element)
        })
    }

    // maps creates new intance like in jQuery
    exports.map = function(fn){
        var elements = this.elements.map(fn)
        return new Rye(elements)
    }

    // slice creates new intance like in jQuery
    exports.slice = function(){
        var elements = _slice.apply this.elements, arguments
        return new Rye(elements)
    }

    var arrayMethods = [
      , 'reduce'
      , 'reduceRight'
      , 'sort'
    ]

    arrayMethods.forEach(function(method){
        exports[method] = function(a,b,c,d){
            this.elements = this.elements[method](a,b,c,d)
            console.log(method, this)
            return this.update()
        }
    })

    exports.indexOf = function(element){
        return this.elements.indexOf(element)
    }

    exports.update = function() {
        this.length = this.elements.length
        return this
    }    
})
