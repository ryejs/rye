
    window.Rye = rye

    $ = function(selector, context){
        return rye.init(selector, context)
    }

})(window)