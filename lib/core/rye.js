    
    function rye(){

    }

    rye.init = function (selector, context) {
        var content;

        if (typeof selector === 'string') {
            content = rye.qsa(selector)
        } else {
            content = []
        }

        return inherits(content, rye.fn)
    }

    rye.util = {}