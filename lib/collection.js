Rye.extend(function(exports){

    exports.get = function(num){
        if (num === undefined) {
            return this.elements.slice()
        }
        return this.elements[num < 0 ? this.elements.length + num : num]
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
        var res = Array.prototype.concat.apply(this.elements, arguments)
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
