Rye.implement(function(exports){

    var _slice = Array.prototype.slice
      , table = document.createElement('table')
      , tableRow = document.createElement('tr')
      , containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        }
      , fragmentRE = /^\s*<(\w+|!)[^>]*>/

    exports.html = function(html){
        var name = fragmentRE.test(html) && RegExp.$1
          , container = containers[name] || containers['*']

        container.innerHTML = html
        return _slice.call(container.childNodes).forEach(function(element){
            container.removeChild(element)
        })
    }

})