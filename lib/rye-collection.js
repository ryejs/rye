
var util = require('./util')
var _slice  = Array.prototype.slice
var _concat = Array.prototype.concat

function extendAsCollection (arr) {
    return Object.assign(arr, methods);
}


var methods = {

    get: function get (index) {
        if (index == null) {
            return this.elements.slice()
        }
        return this.elements[index < 0 ? this.elements.length + index : index]
    },

    eq: function (index) {
        // We have to explicitly null the selection since .get()
        // returns the whole collection when called without arguments.
        if (index == null) {
            return new Rye()
        }
        return new Rye(this.get(index))
    },

    each: function (fn) {
        this.elements.forEach(fn)
        return this
    },

    // ;['forEach', 'reduce', 'reduceRight', 'indexOf'].forEach(function(method){
    //     exports[method] = function (a, b, c, d) {
    //         return this.elements[method](a, b, c, d)
    //     }
    // }.bind(this))

    // Methods that return a list are turned into a Rye instance
    ;['map', 'sort'].forEach(function(method){
        exports[method] = function (a, b, c, d) {
            return new Rye(this.elements[method](a, b, c, d))
        }
    }.bind(this))

    

exports.iterate = function(method, context){
    return function(a, b, c, d){
        return this.each(function(element){
            method.call(context, element, a, b, c, d)
        })
    }
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

this.pluck = function (property) {
    return util.pluck(this.elements, property)
}

this.put = function (property, value) {
    util.put(this.elements, property, value)
    return this
}

this._update = function () {
    this.length = this.elements.length
}

module.exports = {
    get: get,
    eq : eq,
    forEach,
    reduce,
    reduceRight,
    indexOf            
}
