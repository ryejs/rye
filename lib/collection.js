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
      , 'push'
      , 'sort'
      , 'indexOf'
      , 'concat'
    ]

    arrayMethods.forEach(function(method){
        exports[method] = function(a,b,c,d){
            return this.elements[method](a,b,c,d)
        }
    })

    exports.each = function(fn){
        return this.forEach(function(element, i){
            fn.call(element, i, element)
        })
    }
    
})