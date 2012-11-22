Rye.extend(function(rye){

    var ElementArray = Rye.require('ElementArray')

    rye.init = function (selector, context) {
        var res = new ElementArray()

        if (typeof selector === 'string') {
            res.add(rye.qsa(selector))
        }

        return res
    }

})
