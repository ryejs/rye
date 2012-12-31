Rye.define('Ajax', function(){

    var util = Rye.require('Util')
      , noop = function(){}
      , escape = encodeURIComponent
      , accepts = {
            json   : 'application/json'
          , xml    : 'application/xml, text/xml'
          , html   : 'text/html'
          , text   : 'text/plain'
        }
      , defaults = {
            method      : 'GET'
          , url         : window.location.toString()
          , async       : true
          , accepts     : accepts
          , crossDomain : false
          , contentType : null
          , callback    : noop
          , timeout     : 0
        }

    function query (obj) {
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

    function appendQuery (url, query) {
        return (url + '&' + query).replace(/[&?]+/, '?')
    }

    function parseData (options) {
        if (options.data && !util.is('string', options.data)) {
            options.data = query(options.data)
        }
        if (options.data && /get/i.test(options.method)) {
            options.url = appendQuery(options.url, options.data)
        }
    }

    function mimeParse (mime) {
        return mime && (mime.split('/')[1] || mime)
    }

    function request (options, callback) {
        if (util.is('string', options)) {
            options = { url: options }
        }
        if (typeof callback == 'undefined') {
            callback = options.callback
        }

        var settings = util.extend(util.extend({}, defaults), options)
          , xhr = new window.XMLHttpRequest()
          , mime = settings.accepts[settings.dataType]
          , abortTimeout = null
          , headers = {}

        parseData(settings)

        if (!settings.crossDomain) {
            headers['X-Requested-With'] = 'XMLHttpRequest'
        }
        if (mime) {
            headers['Accept'] = mime
            xhr.overrideMimeType && xhr.overrideMimeType(mime.split(',')[0])
        }
        if (settings.contentType || ['post', 'put'].indexOf(options.method) >= 0) {
            headers['Content-Type'] =  settings.contentType || 'application/x-www-form-urlencoded'
        }
        util.extend(headers, settings.headers || {})

        xhr.onreadystatechange = function(){
            if (xhr.readyState != 4) {
                return
            }
            xhr.onreadystatechange = noop
            clearTimeout(abortTimeout)

            if (xhr.status >= 200 && xhr.status < 300) {
                var dataType = settings.dataType || mimeParse(xhr.getResponseHeader('content-type'))
                  , data = xhr.responseText

                try {
                    if (dataType == 'xml') {
                        data = xhr.responseXML
                    } else if (dataType == 'json') {
                        data = JSON.parse(data)
                    }
                } catch (e) {}

                settings.dataType = dataType
                callback && callback.call(xhr, data, settings)
            }
        }

        xhr.open(settings.method, settings.url, settings.async)
        util.each(headers, function(value, name) {
            xhr.setRequestHeader(name, value)
        })

        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function(){
                xhr.onreadystatechange = noop
                xhr.abort()
            }, settings.timeout)
        }

        xhr.send(settings.data)

        return xhr
    }

    return {
        query       : query
      , appendQuery : appendQuery
      , defaults    : defaults
      , request     : request
      // https://github.com/mlbli/craft/blob/master/src/ajax.js#L77
    }

})
