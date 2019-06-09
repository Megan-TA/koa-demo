const fs = require('fs')

module.exports = (baseDir) => async (ctx, next) => {
    // console.log(baseDir, ctx.req.url)

    if (ctx.req.url === '/') {
        return ctx.body = '404'
    }
    let localFile = baseDir + ctx.req.url

    await new Promise((resolve, reject) => {
        fs.stat(localFile, err => {
            if (err) {
                console.log(404)
                return next()
            }
            resolve()
        })
    })

    ctx.body = fs.createReadStream(localFile)
}