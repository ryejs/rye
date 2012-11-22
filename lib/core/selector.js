Rye.extend(function (global) {

    // fix QSA bugs here
    function qsa(selector) {
        return Rye.slice.call(document.querySelectorAll(selector))
    }

    return {
        qsa: qsa
    }
})