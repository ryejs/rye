
suite 'EventEmitter', ->

    test 'add listener', ->
        emitter = new EventEmitter
        emitter.on 'click', -> null
        assert.equal emitter.events['click'].length, 1

    test 'remove listener', ->
        x = new EventEmitter
        fn = -> 123

        x.on 'click', fn
        x.removeListener 'click', fn
        assert x.events['click'] is undefined, "Event removed by reference"

        x.on 'click', fn
        x.removeListener 'click'
        assert x.events['click'] is undefined, "Event removed by name"
    
    test 'remove all listener', ->
        x = new EventEmitter
        fn = -> 123

        x.on 'click', fn
        x.on 'keydown', fn
        x.removeListener '*', fn
        assert x.events['click'] is undefined, "Event removed by reference"

        x.on 'click', fn
        x.on 'keydown', fn
        x.removeListener '*'
        assert x.events['click'] is undefined, "Event removed by name"

    test 'emit event', (done) ->
        x = new EventEmitter
        x.on 'click', (arg) ->
            assert.equal arg, 55
            done()
        x.emit 'click', 55

    test 'emit once', (done) ->
        x = new EventEmitter
        x.once 'click', (arg) ->
            assert arg is 4, "Argument received"
        x.emit 'click', 4
        x.emit 'click', 5
        
        setTimeout ->
            assert x.events['click'] is undefined, "Event removed"
            done()

suite 'PubSub', ->

    test 'subscribe publish', (done) ->
        $.subscribe 'sign', (arg) ->
            assert arg is 55, "Argument received"
            done()
        $.publish 'sign', 55

    test 'unsubscribe', (done) ->
        $.subscribe 'sign', ->
            assert false, "Event shouldn't be emmited"
        $.unsubscribe 'sign'
        $.publish 'sign'
        setTimeout ->
            done()
        , 0



suite 'DOMEvents', ->

    test 'addListener', (done) ->
        div = makeElement('div')
        fn = (event) ->
            assert.equal event.data, 55
            done()

        events.addListener div, 'click', fn
        events.trigger div, 'click', 55

    test 'once', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        events.once div, 'click', counter.step
        events.trigger div, 'click'
        events.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove listener', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        events.addListener div, 'foo', do_not_call
        events.addListener div, 'buz', do_not_call
        events.addListener div, 'bar', counter.step
        events.removeListener div, 'foo'
        events.removeListener div, 'buz*'

        events.trigger div, 'bar'
        events.trigger div, 'buz'
        events.trigger div, 'foo'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove listener in element without emitter', ->
        div = makeElement('div')
        events.removeListener div, 'foo'
        assert.ok true

    test 'remove listener trought selector', (done) ->
        el = $('#test .content').get(0)
        item = $('.a').get(0)
        counter = new Number.Counter

        events.addListener el, 'click li', counter.step
        events.addListener el, 'click ul', do_not_call
        events.addListener el, 'blur li', do_not_call
        events.addListener el, 'focus li', do_not_call
        events.removeListener el, 'click ul'
        events.removeListener el, 'blur *' 
        events.removeListener el, 'focus*' 

        events.trigger item, 'click'
        events.trigger item, 'blur'
        events.trigger item, 'focus'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove listener trought handler', (done) ->
        div = makeElement('div')
        counter = new Number.Counter

        events.addListener div, 'click', do_not_call
        events.addListener div, 'click', counter.step
        events.removeListener div, '*', do_not_call

        events.trigger div, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove all listeners', (done) ->
        div = makeElement('div')

        events.addListener div, 'click', do_not_call
        events.addListener div, 'focus', do_not_call
        events.addListener div, 'blur', do_not_call
        events.removeListener div, '*'

        events.trigger div, 'click'
        events.trigger div, 'focus'
        events.trigger div, 'blur'

        setTimeout (-> done()), 0

    test 'destroy emitter', (done) ->
        div = makeElement('div')
        emitter = new DOMEventEmitter(div)

        emitter.addListener('click', do_not_call)
            .addListener('focus', do_not_call)
            .addListener('blur',  do_not_call)
            .destroy()

        emitter.trigger 'click'
        emitter.trigger 'focus'
        emitter.trigger 'blur'

        setTimeout (-> done()), 0

    test 'accept multiple', (done) ->
        list = $('.list').get(0)
        emitter = new DOMEventEmitter(list)
        item = $('.a').get(0)
        counter = new Number.Counter

        emitter.addListener
            'click .a': counter.step
            'click': counter.step

        events.trigger item, 'click'

        setTimeout ->
            assert.equal counter, 2
            done()
        , 0

    test 'create event', ->
        event = events.createEvent type: 'click'
        assert.equal event.type, 'click'

        event = events.createEvent 'click', prop: 'value'
        assert.equal event.prop, 'value'

    test 'delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        counter = new Number.Counter
        fn = (event) ->
            counter.step()
            assert.equal event.currentTarget, document
            assert.equal event.target, item

        events.addListener document, 'click .a', fn

        events.trigger item, 'click'
        events.trigger list, 'click'
        events.trigger document, 'click'

        setTimeout ->
            assert.equal counter, 1
            done()
        , 0

    test 'remove delegate', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)

        events.addListener document, 'click .a', do_not_call

        events.removeListener document, 'click .a'
        events.trigger item, 'click'

        setTimeout ->
            done()
        , 0

    test 'handler context', (done) ->
        list = $('.list').get(0)
        item = $('.a').get(0)
        counter = new Number.Counter

        events.addListener list, 'click .a', ->
            assert.equal @, item
            counter.step()

        events.addListener list, 'click', ->
            assert.equal @, list
            counter.step()

        events.trigger item, 'click'

        setTimeout ->
            assert.equal counter, 2
            done()
        , 0

    test 'Rye on', (done) ->
        itens = $('.list li')
        fn = (event) ->
            assert event.data is 55, "Argument received"
            done()

        itens.on 'click', fn
        itens.eq(2).trigger 'click', 55

    test 'Rye removeListener', (done) ->
        itens = $('.list li')

        itens.on('blur', do_not_call).removeListener 'blur'
        itens.trigger 'blur'

        setTimeout (-> done()), 0
