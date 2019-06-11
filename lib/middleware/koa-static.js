const fs = require('fs')

module.exports = (baseDir) => async (ctx, next) => {
    // console.log(baseDir, ctx.req.url)

    if (ctx.req.url === '/') {
        return ctx.body = '404'
    }
    let localFile = baseDir + ctx.req.url
    let _err = null
    await new Promise((resolve, reject) => {
        fs.stat(localFile, err => {
            if (err) {
                _err = err
                console.log(404)
            }
            resolve()
        })
    })

    if (_err) {
        return next()
    }

    let ext = ctx.req.url.split('.').pop() || ''

    switch (ext) {
        case 'css':
            ctx.res.setHeader('Content-Type', 'text/css')
            break
        case 'js':
            ctx.res.setHeader('Content-Type', 'application/javascript')
            break
        case 'html':
            ctx.res.setHeader('Content-Type', 'text/html;charset=utf-8')
            break
        case 'ico':
            ctx.res.setHeader('Content-Type', 'image/x-icon')
            break
    }


    ctx.body = fs.createReadStream(localFile)
}