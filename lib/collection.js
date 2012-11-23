Rye.implement(function(exports){

    var util = Rye.require('util')
      , _slice  = Array.prototype.slice
      , _concat = Array.prototype.concat

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

    // just merge elements arrays - see *add*
    exports.concat = function () {
        var args = _slice.call(arguments).map(function(arr){
                return arr instanceof Rye ? arr.elements : arr
            })
        return _concat.apply(this.elements, args)
    }

    exports.slice = function(){
        return _slice.apply(this.elements, arguments)
    }

    var arrayMethods = [
      , 'reduce'
      , 'reduceRight'
      , 'sort'
      , 'map'
      , 'indexOf'
    ]

    arrayMethods.forEach(function(method){
        exports[method] = function(a,b,c,d){
            return this.elements[method](a,b,c,d)
        }
    })

    exports.update = function() {
        this.length = this.elements.length
        return this
    }    
})
