Rye.implement(function(exports){

    var _slice = Array.prototype.slice
      , dummyTable = document.createElement('table')
      , dummyTableRow = document.createElement('tr')
      , containers = {
            'tr'   : document.createElement('tbody')
          , 'tbody': dummyTable
          , 'thead': dummyTable
          , 'tfoot': dummyTable
          , 'td'   : dummyTableRow
          , 'th'   : dummyTableRow
          , '_'    : document.createElement('div')
        }
      , fragmentRE = /^\s*<(\w+|!)[^>]*>/


    exports.html = function(html){
        if (html === undefined) {
            return this.elements[0] && this.elements[0].innerHTML
        }
        // var name = fragmentRE.test(html) && RegExp.$1
        //   , container = containers[name] || containers['*']

        // container.innerHTML = html
        // return _slice.call(container.childNodes).forEach(function(element){
        //     container.removeChild(element)
        // })
    }

})