Rye.define('Request', function(){

    var util = Rye.require('Util')
      , noop = function(){}
      , escape = encodeURIComponent
      , accepts = {
            types  : ['arraybuffer', 'blob', 'document', 'json', 'text']
          , json   : 'application/json'
          , xml    : 'application/xml, text/xml'
          , html   : 'text/html, application/xhtml+xml'
          , text   : 'text/plain'
        }
      , defaults = {
            method       : 'GET'
          , url          : window.location.toString()
          , async        : true
          , accepts      : accepts
          , callback     : noop
          , timeout      : 0
       // , headers      : {}
       // , contentType  : null
       // , data         : null
       // , responseType : null
       // , headers      : null
        }

    function query (obj) {
        var params = []
        ;(function serialize (obj, scope) {
            var isArray = Array.isArray(obj)
            util.each(obj, function(value, key){
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
        if (options.data && (typeof options.data !== 'string')) {
            options.data = query(options.data)
        }
        if (options.data && options.method === 'GET') {
            options.url = appendQuery(options.url, options.data)
        }
    }

    function parseMime (mime) {
        return mime && (mime.split('/')[1] || mime)
    }

    function parseJSON (xhr) {
        var data = xhr.response
        if (typeof data !== 'object') {
            try {
                data = JSON.parse(xhr.responseText)
            } catch (err) {
                return err
            }
        }
        return data
    }

    function parseXML (xhr) {
        var data = xhr.responseXML
        // parse xml to IE 9
        if (data.xml && window.DOMParser) {
            try {
                var parser = new window.DOMParser()
                data = parser.parseFromString(data.xml, 'text/xml')
            } catch (err) {
                return err
            }
        }
        return data            
    }

    function request (options, callback) {
        if (typeof options === 'string') {
            options = { url: options }
        }
        if (!callback) {
            callback = options.callback || noop
        }

        var settings = util.extend({}, defaults, options)
          , xhr = new window.XMLHttpRequest()
          , mime = settings.accepts[settings.responseType]
          , abortTimeout = null
          , headers = {}

        settings.method = settings.method.toUpperCase()
        parseData(settings)

        // exports settings to xhr object
        try {
            util.each(settings, function(value, key) {
                if (key !== 'responseType' || accepts.types.indexOf(value) >= 0) {
                    xhr[key] = value
                }
            })
        } catch (e) {}

        // sets request's accept and content type 
        if (mime) {
            headers['Accept'] = mime
            xhr.overrideMimeType && xhr.overrideMimeType(mime.split(',')[0])
        }
        if (settings.contentType || ['POST', 'PUT'].indexOf(settings.method) >= 0) {
            headers['Content-Type'] =  settings.contentType || 'application/x-www-form-urlencoded'
        }
        util.extend(headers, settings.headers || {})

        xhr.onreadystatechange = function(){
            var err, data
            if (xhr.readyState != 4) {
                return
            }
            xhr.onreadystatechange = noop
            clearTimeout(abortTimeout)

            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                xhr.type = settings.responseType || xhr.responseType || parseMime(xhr.getResponseHeader('content-type'))
                
                switch (xhr.type) {
                    case 'json':
                        data = parseJSON(xhr)
                        break
                    case 'xml':
                        data = parseXML(xhr)
                        break
                    default:
                        data = xhr.responseText
                }

                if (data instanceof Error) {
                    err = data, data = undefined
                }

            } else {
                err = new Error('Request failed')
            }
            callback.call(xhr, err, data, xhr)
        }

        xhr.open(settings.method, settings.url, settings.async)
        util.each(headers, function(value, name) {
            xhr.setRequestHeader(name, value)
        })

        // implements request's abort by timeout
        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function(){
                xhr.onreadystatechange = noop
                xhr.abort()
                callback.call(xhr, new Error('Timeout'), null, xhr)
            }, settings.timeout)
        }

        xhr.send(settings.data)
        return xhr
    }

    function requestProxy (method, options, callback) {
        if (typeof options === 'string') {
            options = { url: options }
        }
        options.method = method
        return request(options, callback)
    }

    // Exported methods
    // ----------------
    
    Rye.request = request
    Rye.get     = util.curry(requestProxy, 'GET')
    Rye.post    = util.curry(requestProxy, 'POST')

    // prevents to attach properties on request
    var exports = request.bind({})

    util.extend(exports, {
        query       : query
      , appendQuery : appendQuery
      , defaults    : defaults
      , get         : util.curry(requestProxy, 'GET')
      , post        : util.curry(requestProxy, 'POST')
      // https://github.com/mlbli/craft/blob/master/src/ajax.js#L77
    })

    return exports

})
