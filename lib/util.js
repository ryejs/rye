Rye.define('util', function(){

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

    function pluck (arr, property){
        return arr.map(function(item){
            return item[property]
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

    function bindMethod (obj, method, args_length) {
        return function(){
            obj[method].apply(obj, [].slice.call(arguments, 0, args_length))
        }

    }

    return {
        extend      : extend
      , inherits    : inherits
      , isElement   : isElement
      , isNodeList  : isNodeList
      , unique      : unique
      , pluck       : pluck
      , prefix      : prefix
      , bindMethod  : bindMethod
    }

})
