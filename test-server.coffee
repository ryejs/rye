express = require 'express'
app = express()

debug = (req) ->
    method = req.route.method.toUpperCase()
    result = if method is 'GET' then req.query else req.body
    console.log "#{method} #{JSON.stringify(result)}\n"

# serve static files
app.use express.static(__dirname)
# JSON, urlencoded and multipart request
app.use express.bodyParser()


app.get '/echo', (req, res) ->
    debug req
    res.send 'get ' + (req.query.bar or 'no data')

app.post '/echo', (req, res) ->
    debug req
    res.send 'post ' + (req.body.bar or 'no data')

app.all '/requested-with', (req, res) ->
    debug req
    res.send 'X-Requested-With ' + req.get 'X-Requested-With'


module.exports = app