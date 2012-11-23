Rye.extend(function(export){

    export.get = function(num){
        return this.elements[num < 0 ? this.elements.length + num : num]
    }

    export.map = function(fn){
        return this.elements.map(fn)
    }

    export.each = function(fn){
        return this.elements.forEach(fn)
    }
    
})