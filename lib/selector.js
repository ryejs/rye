(function (rye) {

    // fix QSA bugs here
    rye.qsa = function(selector) {
        return document.querySelectorAll(selector)
    }
    
})(Rye)