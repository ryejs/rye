    
    var modules = {}

    Rye.require = function(module){
        return modules[module]
    }

    Rye.define = function(module, fn){
        modules[module] = fn(Rye)
    }