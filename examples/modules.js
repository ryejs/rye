(function(){
    // starts with all in page avaliable modules
    var $ = new Rye()

    // starts with a single module - async load if needed
    var singlemodule = new Rye('events')

    // starts with multi modules - async load if needed
    var multimodule = new Rye(['events', 'dom'])


    // REQUIRE
    // 
    // add another module - async load if needed
    $.require('ajax')

    $.require('ajax', function(){
        // simple async load callback
    })

    $.require('ajax', function(rye){
        // ajax only avaliable in this scope
        rye.ajax('http://ryejs.com.br', function(html){
            $('body').html(html)
        })
    })

    $.require('another-ajax-plugin', function(rye){
        // ajax only avaliable in this scope
        rye.ajax('http://ryejs.com.br', function(html){
            $('body').html(html)
        })
    })

})()