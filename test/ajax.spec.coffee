
suite 'Ajax (slow)', ->

    test 'get request', (done) ->
        countdown = new Number.Countdown(2, done)
        ajax.request '/echo', (data) ->
            assert.equal data, 'get no data'
            countdown.fire()

        ajax.request url: '/echo', data: {fizz: 1, bar: 2}, callback: (data) ->
            assert.equal data, 'get 2'
            countdown.fire()

    test 'post request', (done) ->
        countdown = new Number.Countdown(2, done)
        ajax.request url: '/echo', method: 'post', (data) ->
            assert.equal data, 'post no data'
            countdown.fire()

        ajax.request url: '/echo', data: {fizz: 1, bar: 2}, method: 'post', (data) ->
            assert.equal data, 'post 2'
            countdown.fire()

    test 'accept json', (done) ->
        ajax.request url: '/accept?json', dataType: 'json', (data, settings) ->
            assert.deepEqual data, {json: 'ok'}
            done()

    test 'accept xml', (done) ->
        ajax.request url: '/accept?xml', dataType: 'xml', (data, settings) ->
            assert.equal data.documentElement.textContent, 'ok'
            done()

    test 'accept html', (done) ->
        ajax.request url: '/accept?html', dataType: 'html', (data, settings) ->
            assert.equal data, 'html ok'
            done()

    test 'accept text', (done) ->
        ajax.request url: '/accept?text', dataType: 'text', (data, settings) ->
            assert.equal data, 'text ok'
            done()

    test 'content type', (done) ->
        countdown = new Number.Countdown(2, done)
        ajax.request url: '/content', method: 'post', (data, settings) ->
            assert.equal data, 'content type application/x-www-form-urlencoded'
            countdown.fire()

        ajax.request url: '/content', (data, settings) ->
            assert.equal data, 'content type undefined'
            countdown.fire()

    test 'requested with', (done) ->
        countdown = new Number.Countdown(3, done)
        ajax.request url: '/requested-with?1', (data) ->
            assert.equal data, 'requested with XMLHttpRequest'
            countdown.fire()

        ajax.request method: 'post', url: '/requested-with?2', (data) ->
            assert.equal data, 'requested with XMLHttpRequest'
            countdown.fire()

        ajax.request crossDomain: true, url: '/requested-with?3', (data) ->
            assert.equal data, 'requested with undefined'
            countdown.fire()

    test 'appendQuery', ->
        assert.equal ajax.appendQuery('url', 'par=1'), 'url?par=1'
        assert.equal ajax.appendQuery('url?par=1', 'bar=2'), 'url?par=1&bar=2'
        assert.equal ajax.appendQuery('??', '?par=1'), '?par=1'

    test 'query', ->
        assert.equal ajax.query({foo: {one: 1, two: 2}}), escape 'foo[one]=1&foo[two]=2'
        assert.equal ajax.query({ids: [1,2,3]}), escape 'ids[]=1&ids[]=2&ids[]=3'
        assert.equal ajax.query({foo: 'bar', nested: {will: 'not be ignored'}}), escape 'foo=bar&nested[will]=not+be+ignored'
        assert.equal ajax.query([{name: 'foo', value: 'bar'}]), escape 'foo=bar'


