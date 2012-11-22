
    // fix QSA bugs here
    Rye.util.qsa = function (selector) {
        return slice.call(document.querySelectorAll(selector))
    }