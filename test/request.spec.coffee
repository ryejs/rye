
suite 'Request (slow)', ->

    test 'get request', (done) ->
        countdown = new Number.Countdown(4, done)
        obj = fizz: 1, bar: 2
        serialize = request.serialize obj

        request "#{server}/echo", (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        request url: "#{server}/echo", method: 'get', data: obj, callback: (err, data) ->
            assert.deepEqual @data, serialize
            assert.equal data, 'get 2'
            countdown.fire()

        request url: "#{server}/echo", method: 'get', data: serialize, callback: (err, data) ->
            assert.deepEqual @data, serialize
            assert.equal data, 'get 2'
            countdown.fire()

        request.get url: "#{server}/echo", data: obj, callback: (err, data) ->
            assert.equal data, 'get 2'
            countdown.fire()

    test 'post request', (done) ->
        countdown = new Number.Countdown(3, done)
        obj = fizz: 1, bar: 2
        serialize = request.serialize obj

        request url: "#{server}/echo", method: 'post', (err, data) ->
            assert.equal @method, 'POST'
            assert.equal data, 'post no data'
            countdown.fire()

        request url: "#{server}/echo", method: 'post', data: obj, (err, data) ->
            assert.deepEqual @data, serialize
            assert.equal data, 'post 2'
            countdown.fire()

        request.post url: "#{server}/echo", data: obj, (err, data) ->
            assert.equal data, 'post 2'
            countdown.fire()

    test 'async', (done) ->
        countdown = new Number.Countdown(2, done)

        request.get "#{server}/echo", (err, data) ->
            assert.isTrue @async
            countdown.fire()

        request.get { url: "#{server}/echo", async: false }, (err, data) ->
            assert.isFalse @async
            countdown.fire()

    test 'accept json', (done) ->
        request url: "#{server}/accept?json", responseType: 'json', (err, data) ->
            assert.equal @type, 'json'
            assert.deepEqual data, {json: 'ok'}
            done()

    test 'accept xml', (done) ->
        request url: "#{server}/accept?xml", responseType: 'xml', (err, data) ->
            assert.equal @type, 'xml'
            assert.equal data.documentElement.textContent, 'ok'
            done()

    test 'accept html', (done) ->
        request url: "#{server}/accept?html", responseType: 'html', (err, data) ->
            assert.equal @type, 'html'
            assert.equal data, 'html ok'
            done()

    test 'accept text', (done) ->
        request url: "#{server}/accept?text", responseType: 'text', (err, data) ->
            assert.equal @type, 'text'
            assert.equal data, 'text ok'
            done()

    test 'timeout', (done) ->
        request url: "#{server}/sleep?#{Date.now()}", timeout: '1', (err, data) ->
            assert.instanceOf err, Error
            done()

    test 'parse error', (done) ->
        request url: "#{server}/echo", responseType: 'json', (err, data) ->
            assert.instanceOf err, Error
            done()

    test 'sended content type', (done) ->
        countdown = new Number.Countdown(2, done)
        request url: "#{server}/content", method: 'post', (err, data) ->
            assert.equal data, 'content type application/x-www-form-urlencoded'
            countdown.fire()

        request url: "#{server}/content", (err, data) ->
            assert.equal data, 'content type undefined'
            countdown.fire()

    test 'status', (done) ->
        countdown = new Number.Countdown(2, done)
        request url: "#{server}/status?status=200", (err, data, xhr) ->
            assert.equal xhr.status, 200
            countdown.fire()

        request url: "#{server}/status?status=500", (err, data, xhr) ->
            assert.equal xhr.status, 500
            assert.equal err.message, 'Request failed'
            countdown.fire()

        request url: "#{server}/status?status=400", (err, data, xhr) ->
            assert.equal xhr.status, 400
            assert.equal err.message, 'Request failed'
            countdown.fire()

        request url: "#{server}/status?status=304", (err, data, xhr) ->
            assert.equal xhr.status, 304
            countdown.fire()

    test 'appendQuery', ->
        assert.equal request.appendQuery('url', 'par=1'), 'url?par=1'
        assert.equal request.appendQuery('url?par=1', 'bar=2'), 'url?par=1&bar=2'
        assert.equal request.appendQuery('??', '?par=1'), '?par=1'

    test 'serialize', ->
        assert.equal request.serialize({foo: {one: 1, two: 2}}), escape 'foo[one]=1&foo[two]=2'
        assert.equal request.serialize({ids: [1,2,3]}), escape 'ids[]=1&ids[]=2&ids[]=3'
        assert.equal request.serialize({foo: 'bar', nested: {will: 'not be ignored'}}), escape 'foo=bar&nested[will]=not+be+ignored'

    test 'form serialize', ->
        form = makeElement 'form', """
            <input name="email" value="koss@nocorp.me">
            <input name="password" value="123456">
            <input name="ops" value="123456" disabled>
            <input name="unchecked_hasValue" value="myValue" type="checkbox">
            <input name="unchecked_noValue" type="checkbox">
            <input name="checked_hasValue" checked value="myValue" type="checkbox">
            <input name="checked_disabled" checked value="ImDisabled" type="checkbox" disabled>
            <input name="checked_noValue" checked type="checkbox">

            <fieldset>
              <input type="radio" name="radio1" value="r1">
              <input type="radio" name="radio1" checked value="r2">
              <input type="radio" name="radio1" value="r3">
            </fieldset>

            <textarea name="textarea">text</textarea>

            <select name="selectbox">
                <option value="selectopt1">select1</option>
                <option value="selectopt2">select2</option>
                <option value="selectopt3">select3</option>
            </select>

            <select name="selectbox-multiple" multiple>
                <option value="selectopt1" selected>select1</option>
                <option value="selectopt2">select2</option>
                <option value="selectopt3" selected>select3</option>
            </select>

            <div class="actions">
              <input type="submit" name="submit" value="Save">
              <input type="button" name="preview" value="Preview">
              <input type="reset" name="clear" value="Clear form">
              <button name="button">I'm a button</button>
            </div>
        """

        serialize = $(form).serialize()
        # phantomjs dont keeps fields order
        serialize = serialize.split('&').sort().join('&')
        assert.equal serialize, 'checked_hasValue=myValue&checked_noValue=on&email=koss%40nocorp.me&password=123456&radio1=r2&selectbox-multiple%5B%5D=selectopt1&selectbox-multiple%5B%5D=selectopt3&selectbox=selectopt1&textarea=text'

        form = makeElement 'form'
        serialize = $(form).serialize()
        assert.equal serialize, ''

        serialize = $([]).serialize()
        assert.equal serialize, ''


    test 'Rye', (done) ->
        countdown = new Number.Countdown(3, done)

        $.request "#{server}/echo", (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        $.get "#{server}/echo", (err, data) ->
            assert.equal @method, 'GET'
            assert.equal data, 'get no data'
            countdown.fire()

        $.post "#{server}/echo", (err, data) ->
            assert.equal @method, 'POST'
            assert.equal data, 'post no data'
            countdown.fire()


