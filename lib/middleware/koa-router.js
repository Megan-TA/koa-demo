class Layer {
    constructor (path, method, route) {
        this.path = path
        this.method = method
        this.route = route
    }

    match (curPath) {
        return this.path === curPath
    }
}


class Router {
    constructor () {
        this.routeStack = []
    }

    all (path, route) {
        let layer = new Layer(path, 'all', route)
        this.routeStack.push(layer)
    }

    getMatchedRoutes (curPath) {
        return this.routeStack.filter(item => {
            return item.match(curPath)
        }).map(_ => _.route)
    }

    compose (routes, ctx) {
        return () => {
            return dispatch(0)
        }

        function dispatch (idx) {
            let route = routes[idx]
            if (!route) return Promise.resolve()
            return route(ctx, function next () {
                return dispatch(idx + 1)
            })
        }
    }

    // 将每个路由加到中间件队列中
    routes () {
        return async (ctx, next) => {
            let routes = this.getMatchedRoutes(ctx.req.url)
            if (!routes || !routes.length) return next()
            // 判断当前路径命中哪些路由
            let fnRouters = this.compose(routes, ctx)
            fnRouters().then(res => {
                console.log(res)
                return next()
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

module.exports = Router