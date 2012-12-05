Rye.define('Data', function(){

    var uuid = {
            current: 0
          , next: function(){ return ++this.current }
        }
      , data = {}

    function getId (element) {
        return element.rye_id || (element.rye_id = uuid.next())
    }

    function set (element, key, value) {
        var id = getId(element)
          , obj = data[id] || (data[id] = {})
        obj[key] = value
    }

    function get (element, key) {
        var obj = data[getId(element)]
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
        getId : getId
      , set   : set
      , get   : get
    }
})