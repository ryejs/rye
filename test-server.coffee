express = require 'express'
app = express()

debug = (method, req) ->
    log = "/#{method}"
    log +=  if method is 'GET' then req.query else req.body
    console.log "#{log}\n"

# serve static files
app.use express.static(__dirname)


app.get '/echo', (req, res) ->
    debug 'GET', req
    res.send 'get ' + (req.query.bar or 'no data')


module.exports = app