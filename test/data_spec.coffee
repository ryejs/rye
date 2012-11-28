assert = chai.assert

$ = Rye

Data = Rye.require('Data')

suite 'Data', ->

    test 'storage data', ->
        e = {}

        assert.equal Data.get(e, 'key'), undefined, "No initial data"

        Data.set(e, 'key', 'foo')
        assert.equal Data.get(e, 'key'), 'foo', "Data foo in key"

        Data.set(e, 'key', 'bar')
        assert.equal Data.get(e, 'key'), 'bar', "Data changed to bar in key"

        assert.deepEqual Data.get(e), {key: 'bar'}, "Get all data"

    test 'Element storage data', ->
        el = $(document.createElement('div'))
        assert.equal el.data('key'), undefined, "No initial data"

        el.data('key', 'foo')
        assert.equal el.data('key'), 'foo', "Data foo in key"

        el.data('key', {fizz: 1, buzz: 2})
        assert.deepEqual el.data('key'), {fizz: 1, buzz: 2}, "Data changed to object in key"

    test 'List storage data', ->
        el = $([
            document.createElement('div')
            document.createElement('div')
        ])
        assert.deepEqual el.data('key'), [undefined, undefined], "No initial data"

        el.data('key', 'foo')
        assert.deepEqual el.data('key'), ['foo', 'foo'], "Data foo in key"

        el.data('key', 'bar')
        assert.deepEqual el.data('key'), ['bar', 'bar'], "Data changed to bar in key"
        