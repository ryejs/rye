Rye.extend(function(rye, undefined){

    // fix QSA bugs here
    rye.qsa = function (selector) {
        return document.querySelectorAll(selector)
    }
    
})
