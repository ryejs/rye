(function(rye){

    rye.init = function(selector, context) {
        var res = new ElementArray()

        if (typeof selector === 'string') {
            res.add(rye.qsa(selector))
        }

        return res
    }

})(Rye)