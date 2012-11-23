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
        // We have to explicitly null the selection since .get()
        // returns the whole collection when called without arguments.
        if (index == null) {
            return new Rye()
        }
        return new Rye(this.get(index))
    }

    // Methods that return a usable value
    ;['forEach', 'reduce', 'reduceRight', 'indexOf'].forEach(function(method){
        exports[method] = function(a,b,c,d){
            return this.elements[method](a,b,c,d)
        }
    })

    // Methods that return a list are turned into a Rye instance
    ;['map', 'sort'].forEach(function(method){
        exports[method] = function(a,b,c,d){
            return new Rye(this.elements[method](a,b,c,d))
        }
    })

    exports.each = function (fn) {
        this.elements.forEach(fn)
        return this
    }

    exports.push = function (item) {
        if (util.isElement(item)){
            this.elements.push(item)
            this._update()
            return this.length - 1
        } else {
            return -1
        }
    }

    exports.slice = function (start, end) {
        return new Rye(_slice.call(this.elements, start, end))
    }

    // Concatenate two elements lists, do .unique() clean-up
    exports.concat = function () {
        var args = _slice.call(arguments).map(function(arr){
            return arr instanceof Rye ? arr.elements : arr
        })
        return new Rye(util.unique(_concat.apply(this.elements, args)))
    }

    exports._update = function () {
        this.length = this.elements.length
    }

})
