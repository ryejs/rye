// Rye.js
// (c) 2012 Ricardo Tomasi
// Rye.js may be freely distributed under the MIT license.

(function() {

    var modules = {}

    function require(module){
        return modules[module]
    }

    function define(module, fn){
        modules[module] = fn(Rye)
    }

    window.Rye = {
        require: require
      , define: define
    }

    if (window.$ == null) window.$ = window.Rye

})()