
app  = require '../app'
http = require 'http'

describe 'Server', ->

    it 'should respond with 200 at /', ->
        http.get '/', (res) ->
            res.should.have.status 200