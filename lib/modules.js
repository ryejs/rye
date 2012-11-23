Rye.extend(function(global){

    var modules = {}

    function require(module){
        return modules[module]
    }

    function define(module, fn){
        modules[module] = fn(Rye)
    }

    return {
        require: require
      , define: define
    }

})