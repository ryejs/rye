Rye.implement(function(exports){

    exports.html = function(html){
        if (html == null) {
            return this.elements[0] && this.elements[0].innerHTML
        }
        this.each(function(element){
            element.innerHTML = html
        })
        return this
    }

    function insertAdjacent (position, html) {
        return function (html) {
            this.each(function(element){
                element.insertAdjacentHTML(position, html)
            })
        }
    }

    exports.append = insertAdjacent('beforeend')

    exports.prepend = insertAdjacent('afterbegin')

    exports.after = insertAdjacent('afterend')

    exports.before = insertAdjacent('beforebegin')

})