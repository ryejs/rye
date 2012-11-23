Rye.extend(function(exports){

    exports.get = function(num){
        if (num === undefined) {
            return this.elements.slice()
        }
        return this.elements[num < 0 ? this.elements.length + num : num]
    }

    ;['forEach', 'map', 'reduce', 'push', 'sort', 'indexOf', 'concat'].forEach(function(method){
        exports[method] = function(fn){
            return this.elements[method](fn)
        }
    })

    exports.each = function(fn){
        return this.forEach(function(element, i){
            fn.call(element, i, element)
        })
    }
    
})