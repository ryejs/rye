Rye.define('util', function (rye) {

    function extend(dest, src) {
        for (var key in src){
            if (Object.prototype.hasOwnProperty.call(parent, key)){
                dest[key] = src[key]
            }
        }
        return dest
    }

    function inherits(child, parent) {
        util.extend(child, parent)
        function ctor() {
            this.constructor = child
        }
        ctor.prototype = parent.prototype
        child.prototype = new ctor()
        child.__super__ = parent.prototype
        return child
    }

    return {
        extend: extend
      , inherits: inherits
    }

})