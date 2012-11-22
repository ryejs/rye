    
    var modules = {}

    rye.require = function(module){
        return modules[module]
    }

    rye.define = function(module, fn){
        modules[module] = fn(Rye)
    }