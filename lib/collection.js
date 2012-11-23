Rye.extend(function(exports){

    exports.get = function(num){
        return this.elements[num < 0 ? this.elements.length + num : num]
    }

    exports.map = function(fn){
        return this.elements.map(fn)
    }

    exports.each = function(fn){
        return this.elements.forEach(fn)
    }
    
})