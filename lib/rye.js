(function(global, undefined){

    function Rye(selector, context){
        inherits(this, Rye.fn)

        this.selector = selector

        if (context !== undefined) {
            this.elements = $(context).find(selector)
        } else if (typeof selector === 'string') {
            this.elements = Rye.util.qsa(document, selector)
        } else {
            this.elements = []
            this.selector = ''
        }
        this.length = this.elements.length
    }

    Rye.fn = {}
    Rye.util = {}


    var table = document.createElement('table')
      , tableRow = document.createElement('tr')
      , containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        }

    var fragmentRE = /^\s*<(\w+|!)[^>]*>/

    Rye.html = function(html){
        var name = fragmentRE.test(html) && RegExp.$1
            container = containers[name] || containers['*']

        container.innerHTML = html
        return $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
        })
    }

    Rye.fn.get = function(num){
        return this.elements[num < 0 ? this.length + num : num]
    }

    Rye.fn.find = function(selector){
        var elements
        if (this.length === 1) {
            elements = Rye.util.qsa(this.elements[0], selector)
        } else {
            elements = this.map(function(){
                return Rye.util.qsa(this, selector) 
            })
        }
        return $(elements)
    }

    Rye.fn.map = function(fn){

    }

    global.Rye = Rye

})(window)