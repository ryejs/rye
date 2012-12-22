Rye.define('Util', function(){

    var _slice = Array.prototype.slice

    var uid = {
            current: 0
          , next: function(){ return ++this.current }
        }

    function extend (destination, source) {
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)){
                destination[key] = source[key]
            }
        }
        return destination
    }

    function inherits (child, parent) {
        extend(child, parent)
        function Ctor () {
            this.constructor = child
        }
        Ctor.prototype = parent.prototype
        child.prototype = new Ctor()
        child.__super__ = parent.prototype
        return child
    }

    function isElement (element) {
        return element && (element.nodeType === 1 || element.nodeType === 9)
    }
    
    function isNodeList (obj) {
        return obj && (obj instanceof window.NodeList) || (obj instanceof window.HTMLCollection)
    }

    function unique (array) {
        return array.filter(function(item, idx){
            return array.indexOf(item) == idx
        })
    }

    function pluck (array, property) {
        return array.map(function(item){
            return item[property]
        })
    }

    function put (array, property, value) {
        return array.forEach(function(item, i){
            array[i][property] = value
        })
    }

    function prefix (key, obj) {
        var result
          , upcased = key[0].toUpperCase() + key.substring(1)
          , prefixes = ['moz', 'webkit', 'ms', 'o']

        obj = obj || window

        if (result = obj[key]){
            return result
        }

        // No pretty array methods here :(
        // http://jsperf.com/everywhile
        while(prefix = prefixes.shift()){
            if (result = obj[prefix + upcased]){
                break;
            }
        }
        return result
    }

    function applier (fn, context, args) {
        return function () {
            fn.apply(context, _slice.call(arguments, 0).concat(args))
        }
    }

    function applierLeft (fn, context, args) {
        return function () {
            fn.apply(context, args.concat(_slice.call(arguments, 0)))
        }
    }

    function curry (fn) {
        return applierLeft(fn, this, _slice.call(arguments, 1))
    }

    function getUid (element) {
        return element.rye_id || (element.rye_id = uid.next())
    }

    function type (obj) {
        var ref = Object.prototype.toString.call(obj).match(/\s(\w+)\]$/)
        return ref && ref[1].toLowerCase()
    }

    function is (type, obj) {
        return type(obj) === type
    }

    return {
        extend      : extend
      , inherits    : inherits
      , isElement   : isElement
      , isNodeList  : isNodeList
      , unique      : unique
      , pluck       : pluck
      , put         : put
      , prefix      : prefix
      , applier     : applier
      , applierLeft : applierLeft
      , curry       : curry
      , getUid      : getUid
      , type        : type
      , is          : is
    }

})
