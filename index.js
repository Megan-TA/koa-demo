const path = require('path')

const Koa = require('./lib/koa')
const serve = require('./lib/middleware/koa-static')


const app = new Koa()

app.use(serve(path.join(__dirname, 'static')))

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
    ctx.body = 'hello koa!'
    await next()
})


// 1
// 2
// 4
// 3


app.listen(8089, () => {
    console.log('http://localhost:8089已启动')
})