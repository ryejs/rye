
suite 'Request (slow)', ->

    test 'get request', (done) ->
        countdown = new Number.Countdown(4, done)
        obj = {fizz: 1, bar: 2}
        query = request.query obj

        request '/echo', (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        request url: '/echo', method: 'get', data: obj, callback: (err, data) ->
            assert.deepEqual @data, query
            assert.equal data, 'get 2'
            countdown.fire()

        request url: '/echo', method: 'get', data: query, callback: (err, data) ->
            assert.deepEqual @data, query
            assert.equal data, 'get 2'
            countdown.fire()

        request.get url: '/echo', data: obj, callback: (err, data) ->
            assert.equal data, 'get 2'
            countdown.fire()

    test 'post request', (done) ->
        countdown = new Number.Countdown(3, done)
        obj = {fizz: 1, bar: 2}
        query = request.query obj

        request url: '/echo', method: 'post', (err, data) ->
            assert.equal @method, 'POST'
            assert.equal data, 'post no data'
            countdown.fire()

        request url: '/echo', method: 'post', data: obj, (err, data) ->
            assert.deepEqual @data, query
            assert.equal data, 'post 2'
            countdown.fire()

        request.post url: '/echo', data: obj, (err, data) ->
            assert.equal data, 'post 2'
            countdown.fire()

    test 'async', (done) ->
        countdown = new Number.Countdown(2, done)

        request.get '/echo', (err, data) ->
            assert.isTrue @async
            countdown.fire()

        request.get { url: '/echo', async: false }, (err, data) ->
            assert.isFalse @async
            countdown.fire()

    test 'accept json', (done) ->
        request url: '/accept?json', responseType: 'json', (err, data) ->
            assert.equal @type, 'json'
            assert.deepEqual data, {json: 'ok'}
            done()

    test 'accept xml', (done) ->
        request url: '/accept?xml', responseType: 'xml', (err, data) ->
            assert.equal @type, 'xml'
            assert.equal data.documentElement.textContent, 'ok'
            done()

    test 'accept html', (done) ->
        request url: '/accept?html', responseType: 'html', (err, data) ->
            assert.equal @type, 'html'
            assert.equal data, 'html ok'
            done()

    test 'accept text', (done) ->
        request url: '/accept?text', responseType: 'text', (err, data) ->
            assert.equal @type, 'text'
            assert.equal data, 'text ok'
            done()

    test 'timeout', (done) ->
        request url: '/echo' + Date.now(), timeout: '1', (err, data) ->
            assert.equal err.message, 'Timeout'
            done()

    test 'parse error', (done) ->
        request url: '/echo', responseType: 'json', (err, data) ->
            assert.equal err.message, 'Parser Error'
            done()

    test 'sended content type', (done) ->
        countdown = new Number.Countdown(2, done)
        request url: '/content', method: 'post', (err, data) ->
            assert.equal data, 'content type application/x-www-form-urlencoded'
            countdown.fire()

        request url: '/content', (err, data) ->
            assert.equal data, 'content type undefined'
            countdown.fire()

    test 'status', (done) ->
        countdown = new Number.Countdown(2, done)
        request url: '/status?status=200', (err, data, xhr) ->
            assert.equal xhr.status, 200
            countdown.fire()

        request url: '/status?status=500', (err, data, xhr) ->
            assert.equal xhr.status, 500
            assert.equal err.message, 'Request failed'
            countdown.fire()

        request url: '/status?status=400', (err, data, xhr) ->
            assert.equal xhr.status, 400
            assert.equal err.message, 'Request failed'
            countdown.fire()

        request url: '/status?status=304', (err, data, xhr) ->
            assert.equal xhr.status, 304
            countdown.fire()

    test 'appendQuery', ->
        assert.equal request.appendQuery('url', 'par=1'), 'url?par=1'
        assert.equal request.appendQuery('url?par=1', 'bar=2'), 'url?par=1&bar=2'
        assert.equal request.appendQuery('??', '?par=1'), '?par=1'

    test 'query', ->
        assert.equal request.query({foo: {one: 1, two: 2}}), escape 'foo[one]=1&foo[two]=2'
        assert.equal request.query({ids: [1,2,3]}), escape 'ids[]=1&ids[]=2&ids[]=3'
        assert.equal request.query({foo: 'bar', nested: {will: 'not be ignored'}}), escape 'foo=bar&nested[will]=not+be+ignored'
        assert.equal request.query([{name: 'foo', value: 'bar'}]), escape 'foo=bar'

    test 'Rye', (done) ->
        countdown = new Number.Countdown(3, done)

        $.request '/echo', (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        $.get '/echo', (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        $.post '/echo', (err, data) ->
            assert.equal @method, 'POST'
            assert.equal data, 'post no data'
            countdown.fire()


