Rye.define('Data', function(){

    var uuid = {
        current: 0
      , next: function(){ return ++this.current }
      , toString: function(){ return this.current }
    }

    function getId (element) {
        return element.rye_id || (element.rye_id = uuid.next())
    }

    return {
        set: function (element, key, value) {
            var id = getId(element)
              , obj = this[id] || (this[id] = {})
            obj[key] = value
        }
      , get: function (element, key) {
            var obj = this[getId(element)]
            return obj && obj[key]
        }
    }

})

Rye.implement(function(exports){

    var data = Rye.require('Data')

    exports.data = function (key, value) {

        if (value !== undefined) {
            this.each(function(element){
                data.set(element, key, value)
            })
            return this
        }

        if (this.elements.length === 1) {
            return data.get(this.elements[0], key)
        } else {
            return this.elements.map(function(element){
                return data.get(element, key)
            })
        }
    }

})