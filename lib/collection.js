Rye.define('Collection', function(){

    var util = Rye.require('Util')
      , _slice  = Array.prototype.slice
      , _concat = Array.prototype.concat

    this.get = function (index) {
        if (index == null) {
            return this.elements.slice()
        }
        return this.elements[index < 0 ? this.elements.length + index : index]
    }

    this.eq = function (index) {
        // We have to explicitly null the selection since .get()
        // returns the whole collection when called without arguments.
        if (index == null) {
            return new Rye()
        }
        return new Rye(this.get(index))
    }

    // Methods that return a usable value
    ;['forEach', 'reduce', 'reduceRight', 'indexOf'].forEach(function(method){
        this[method] = function (a, b, c, d) {
            return this.elements[method](a, b, c, d)
        }
    }.bind(this))

    // Methods that return a list are turned into a Rye instance
    ;['map', 'sort'].forEach(function(method){
        this[method] = function (a, b, c, d) {
            return new Rye(this.elements[method](a, b, c, d))
        }
    }.bind(this))

    this.each = function (fn) {
        this.elements.forEach(fn)
        return this
    }

    this.push = function (item) {
        if (util.isElement(item)){
            this.elements.push(item)
            this._update()
            return this.length - 1
        } else {
            return -1
        }
    }

    this.slice = function (start, end) {
        return new Rye(_slice.call(this.elements, start, end))
    }

    // Concatenate two elements lists, do .unique() clean-up
    this.concat = function () {
        var args = _slice.call(arguments).map(function(arr){
            return arr instanceof Rye ? arr.elements : arr
        })
        return new Rye(_concat.apply(this.elements, args))
    }

    this._update = function () {
        this.length = this.elements.length
    }

})
