Rye.define('ElementArray', function(rye, undefined){

    var util = rye.require('util')

    function ElementArray () {
        this.length = 0
    }

    ElementArray.prototype.add = function (elements) {
        return this
    }

    return ElementArray

})