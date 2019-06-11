const path = require('path')

const Koa = require('./lib/koa')
const serve = require('./lib/middleware/koa-static')
const Router = require('./lib/middleware/koa-router')

const app = new Koa()
const router = new Router()

app.use(serve(path.join(__dirname, 'static')))


router.all('/api/post', async (ctx, next) => {
    ctx.body = 'api/post'
    return next()
})

app.use(router.routes())

app.use(async function (ctx, next) {
    console.log(ctx.req.url)
    await next()
})

app.use(async function (ctx, next) {
    console.log(1)
    await next()
})


app.use(async function (ctx, next) {
    console.log(2)
    await next()
    console.log(3)
})


app.use(async function (ctx, next) {
    console.log(4)
    await next()
})


// 1
// 2
// 4
// 3


app.listen(8089, () => {
    console.log('http://localhost:8089已启动')
})