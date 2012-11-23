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

    var arrayMethods = [
        'forEach'
      , 'map'
      , 'reduce'
      , 'reduceRight'
      , 'sort'
      , 'indexOf'
    ]

    arrayMethods.forEach(function(method){
        exports[method] = function(a,b,c,d){
            return this.elements[method](a,b,c,d)
        }
    })

    exports.concat = function () {
        var args = _slice.call(arguments).map(function(arr){
            return arr instanceof Rye ? arr.elements : arr
        })
        var res = util.unique(_concat.apply(this.elements, args))
        return Rye(res)
    }

    exports.push = function (item) {
        if (item.nodeType === 1 || item.nodeType === 9){
            this.elements.push(item)
            this.update()
            return this.length - 1
        } else {
            return -1
        }
    }

    exports.each = function(fn){
        return this.forEach(function(element, i){
            fn.call(element, i, element)
        })
    }

    exports.update = function() {
        this.length = this.elements.length
    }    
})
