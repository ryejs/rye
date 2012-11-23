Rye.define('Data', function(){

    var data = {}

    uuid = {
        current: 0
      , next: function(){ return ++this.current }
      , toString: function(){ return this.current }
    }

    function getId (el) {
        return el.rye_id || (el.rye_id = uuid.next())
    }

    return {
        set: function (el, key, value) {
            var id = getId(el)
              , obj = this[id] || (this[id] = {})
            obj[key] = value
        }
      , get: function (el, key) {
            var obj = this[getId(el)]
            return obj && obj[key]
        }
    }

})

Rye.implement(function(exports){

    var data = Rye.require('Data')

    exports.data = function (key, value) {

        if (value !== undefined) {
            this.each(function(el){
                data.set(getId(el), key, value)
            })
            return this
        }

        if (this.elements.length === 1) {
            return data.get(getId(el), key)
        } else {
            return this.elements.map(function(el){
                return data.get(getId(el), key)
            })
        }
    }

})