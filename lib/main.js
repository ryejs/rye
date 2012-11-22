Rye.extend(function(rye, undefined){

    var ElementArray = Rye.require('ElementArray')

    rye.init = function (selector, context) {
        var res = new ElementArray()

        if (typeof selector === 'string') {
            res.add(rye.qsa(selector))
        }

        return res
    }

})
