
    // fix QSA bugs here
    rye.util.qsa = function (selector) {
        return slice.call(document.querySelectorAll(selector))
    }