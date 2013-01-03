http        = require 'http'
url         = require 'url'
path        = require 'path'
fs          = require 'fs'
querystring = require 'querystring'

page =
    notFound: (res, data) ->
        res.writeHead 404, 'Content-Type': 'text/plain'
        res.write (data or '404 Not Found') + "\n"
        res.end()

    internalError: (res, data) ->
        res.writeHead 500, 'Content-Type': 'text/plain'
        res.write (data or '500 Internal Server Error') + "\n"
        res.end()


staticFile = (res, pathname) ->
    mimeTypes =
        '.html' : 'text/html'
        '.css'  : 'text/css'
        '.js'   : 'text/javascript'

    filename = path.join process.cwd(), pathname
    path.exists filename, (exists) ->
        if exists
            filename += '/index.html' if fs.statSync(filename).isDirectory()

            fs.readFile filename, 'binary', (err, file) ->
                if !err
                    headers = {}
                    contentType = mimeTypes[path.extname(filename)]
                    headers['Content-Type'] = contentType if contentType

                    res.writeHead 200, headers
                    res.write file, 'binary'
                    res.end()

                else
                    page.internalError res, err

        else
            page.notFound res


parseRequest = (callback) ->
    (req, res) ->
        req.url   = url.parse(req.url, true)
        req.query = req.url.query or {}
        req.body  = {}

        if req.method is 'POST'
            queryData = ''
            req.on 'data', (data) -> queryData += data
            req.on 'end', ->
                req.body = querystring.parse queryData
                callback req, res
        else
            callback req, res


request = parseRequest (req, res) ->
    pathname = req.url.pathname
    status = 200
    sleep = 0
    headers = {}
    data = null

    # Special test requests
    # ---------------------
    switch pathname
        when '/echo'
            data = "#{req.method.toLowerCase()} "
            if req.method is 'POST'
                data += req.body.bar or 'no data'
            else
                data += req.query.bar or 'no data'

        when '/status'
            status = req.query.status
            data = "status #{req.query.status}"

        when '/content'
            data = "content type #{req.headers['content-type']}"

        when '/sleep'
            data = 'sleep'
            sleep = 500

        when '/accept'
            accept = req.headers['accept'].split(/[/,]/)[1]
            accept = 'text' if accept is 'plain'
            switch accept
                when 'html', 'text'
                    data = "#{accept} ok"

                when 'json'
                    headers['Content-Type'] = 'application/json'
                    data = JSON.stringify json: 'ok'

                when 'xml'
                    headers['Content-Type'] = 'application/xml, text/xml'
                    data = '<?xml version="1.0" encoding="UTF-8" ?><content>ok</content>'

    if data or sleep
        setTimeout ->
            res.writeHead status, headers
            res.write data
            res.end()
        , sleep

    # Static files
    # ---------------------
    else
        staticFile res, pathname


module.exports = http.createServer request