Rye.define('Ajax', function(){

    var util = Rye.require('Util')
      , escape = encodeURIComponent

    function param (obj) {
        var params = []
        ;(function serialize (obj, scope) {
            var isArray = Array.isArray(obj)
              , value
            Object.keys(obj).forEach(function(key){
                value = obj[key]
                if (scope) {
                    key = scope + '[' + (isArray ? '' : key) + ']'
                // If an array was passed in, assume that it is an array of form elements.
                } else if (isArray) {
                    key = value.name
                    value = value.value
                }

                if (util.is(['array', 'object'], value)) {
                    serialize(value, key)
                } else {
                    params.push(escape(key) + '=' + escape(value))
                }
            })
        })(obj)
        return params.join('&').replace(/%20/g, '+')
    }

    return {
        param : param
    }


})
