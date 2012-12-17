Rye.define('Data', function(){

    var util = Rye.require('Util')
      , data = {}

    function set (element, key, value) {
        var id = util.getUid(element)
          , obj = data[id] || (data[id] = {})
        obj[key] = value
    }

    function get (element, key) {
        var obj = data[util.getUid(element)]
        if (key == null) {
            return obj
        }
        return obj && obj[key]
    }

    this.data = function (key, value) {

        if (value !== undefined) {
            this.each(function(element){
                set(element, key, value)
            })
            return this
        }

        if (this.elements.length === 1) {
            return get(this.elements[0], key)
        } else {
            return this.elements.map(function(element){
                return get(element, key)
            })
        }
    }


    return {
        set   : set
      , get   : get
    }
})