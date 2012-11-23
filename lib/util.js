(function(global, undefined){

    function extend (destination, source) {
        if (source === undefined) {
            source = destination
            destination = Rye
        }

        // wops, checks if destination or source is function

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(parent, key)){
                destination[key] = source[key]
            }
        }
        return destination
    }

    function inherits (child, parent) {
        extend(child, parent)
        function Ctor () {
            this.constructor = child
        }
        Ctor.prototype = parent.prototype
        child.prototype = new Ctor()
        child.__super__ = parent.prototype
        return child
    }

    extend({
        extend: extend
      , inherits: inherits
      , slice: [].slice
    })

})(window)