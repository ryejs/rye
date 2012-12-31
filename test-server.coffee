express = require 'express'
app = express()

debug = (req) ->
    return if app.silent
    method = req.route.method.toUpperCase()
    path = req.route.path
    result = if method is 'GET' then req.query else req.body
    console.log "#{path} : #{method} #{JSON.stringify(result)}\n"

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

app.all '/accept', (req, res) ->
    debug req
    if req.accepts 'json'
        res.send {json: 'ok'}
    else if req.accepts 'xml'
        res.set 'Content-Type', 'application/xml, text/xml'
        res.send '<?xml version="1.0" encoding="UTF-8" ?><content>ok</content>'
    else if req.accepts 'html'
        res.send 'html ok'
    else if req.accepts 'text'
        res.send 'text ok'

app.all '/content', (req, res) ->
    debug req
    res.send 'content type ' + req.headers['content-type']

app.all '/requested-with', (req, res) ->
    debug req
    res.send 'requested with ' + req.get 'X-Requested-With'


module.exports = app