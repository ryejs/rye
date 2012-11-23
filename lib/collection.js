Rye.extend(function(exports){

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
    }

    exports.each = function(fn){
        return this.forEach(function(element, i){
            fn.call(element, i, element)
        })
    }

    var arrayMethods = [
        'map'
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

    exports.concat = function () {
        var args = _slice.call(arguments).map(function(arr){
            return arr instanceof Rye ? arr.elements : arr
        })
        var res = util.unique(_concat.apply(this.elements, args))
        return Rye(res)
    }

    exports.update = function() {
        this.length = this.elements.length
        return this
    }    
})
