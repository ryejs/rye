Rye.define('TouchEvents', function(){

    var util = Rye.require('Util')
      , DOMEventEmitter = Rye.require('DOMEventEmitter')
      , touch = {}

    // checks if it needed
    function parentIfText (node) {
        return 'tagName' in node ? node : node.parentNode
    }

    function environmentMap() {
        // doesnt have touchstart
        if (!("ontouchstart" in document.documentElement)) {
            util.extend(DOMEventEmitter.environmentMap, {
                touchstart: 'mousedown'
              , touchmove: 'mousemove'
              , touchend: 'mouseup'
              , tap: 'click'
              , doubletap: 'dblclick'
            })
        }
    }

    function Gesture(props) {
        util.extend(this, props)
        Gesture.all.push(this)
    }
    Gesture.all = []
    Gesture.cancelAll = function () {
        Gesture.all.forEach(function(instance){
            instance.cancel()
        })
        touch = {}
    }
    Gesture.prototype.schedule = function () {
        this.timeout = setTimeout(this._trigger.bind(this), this.delay)
    }
    Gesture.prototype._trigger = function () {
        this.timeout = null
        this.trigger()
    }
    Gesture.prototype.cancel = function () {
        this.timeout && clearTimeout(this.timeout)
        this.timeout = null
    }

    if (DOMEventEmitter && ('ontouchstart' in window || window.mocha)) {

        var tap = new Gesture({
                delay: 0
              , trigger: function () {
                    // cancelTouch cancels processing of single vs double taps for faster 'tap' response
                    var event = DOMEventEmitter.createEvent('tap')
                    event.cancelTouch = Gesture.cancelAll
                    DOMEventEmitter.trigger(touch.element, event)

                    // trigger double tap immediately
                    if (touch.isDoubleTap) {
                        DOMEventEmitter.trigger(touch.element, 'doubletap')
                        touch = {}

                    // trigger single tap after (x)ms of inactivity
                    } else {
                        singleTap.schedule()
                    }
                }
            })
          , singleTap = new Gesture({
                delay: 250
              , trigger: function () {
                    DOMEventEmitter.trigger(touch.element, 'singletap')
                    touch = {}
                }
            })
          , longTap = new Gesture({
                delay: 750
              , trigger: function () {
                    if (touch.last) {
                        DOMEventEmitter.trigger(touch.element, 'longtap')
                        touch = {}
                    }
                }
            })
          , swipe = new Gesture({
                delay: 0
              , trigger: function () {
                    DOMEventEmitter.trigger(touch.element, 'swipe')
                    DOMEventEmitter.trigger(touch.element, 'swipe' + this.direction())
                    touch = {}
                }
              , direction: function () {
                    if (Math.abs(touch.x1 - touch.x2) >= Math.abs(touch.y1 - touch.y2)) {
                        return touch.x1 - touch.x2 > 0 ? 'left' : 'right'
                    }
                    return touch.y1 - touch.y2 > 0 ? 'up' : 'down'
                }
            })

        DOMEventEmitter.addListener(document.body, 'touchstart', function (event) {
            var now = Date.now()
            singleTap.cancel()
            touch.element = parentIfText(event.touches[0].target)
            touch.x1 = event.touches[0].pageX
            touch.y1 = event.touches[0].pageY
            if (touch.last && (now - touch.last) <= 250) {
                touch.isDoubleTap = true
            }
            touch.last = now
            longTap.schedule()
        })

        DOMEventEmitter.addListener(document.body, 'touchmove', function (event) {
            longTap.cancel()
            touch.x2 = event.touches[0].pageX
            touch.y2 = event.touches[0].pageY
        })

        DOMEventEmitter.addListener(document.body, 'touchend', function (event) {
            longTap.cancel()

            // swipe
            if (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) {
                swipe.schedule()
            // normal tap
            } else if ('last' in touch) {
                tap.schedule()
            }
        })

        DOMEventEmitter.addListener(document.body, 'touchcancel', Gesture.cancelAll)
        DOMEventEmitter.addListener(window, 'scroll', Gesture.cancelAll)

        return {
            environmentMap: environmentMap
        }
    }
})
