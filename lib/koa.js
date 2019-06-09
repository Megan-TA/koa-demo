const http = require('http')
const Stream = require('stream')

class Koa {
    constructor () {
        this.middleware = []
        this.ctx = {}
    }
    use(fn) {
        this.middleware.push(fn)
    }

    compose (middleware, ctx) {

        function dispatch (i) {
            let fn = middleware[i]
            if (!fn) {
                return Promise.resolve()
            }

            return fn(ctx, function next () {
                dispatch(i+1)
            })
        }
        return function fnMiddleware () {
            return dispatch(0)
        }
    }

    handleResponse (ctx) {
        let { body, res } = ctx
        
        if (typeof body === 'string') {
            ctx.res.end(body)
        } else if (body instanceof Stream) {
            body.pipe(res)
        }
    }

    listen (port, cb) {
        // let middleware = this.middleware
        http.createServer((req, res) => {
            this.ctx = {req, res}

            // function next (index) {
            //     if (!middleware[index]) return
            //     middleware[index](this.ctx, () => next(index+1))
            // }
            // next(0)

            let fnMiddleware = this.compose(this.middleware, this.ctx)

            fnMiddleware()
                .then(() => {
                    this.handleResponse(this.ctx)
                })
                .catch(err => console.log(err))

        }).listen(port, cb)
    }
}

module.exports = Koa