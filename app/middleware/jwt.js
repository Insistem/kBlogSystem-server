// 解析token的中间件,实现类似 egg-jwt 的功能, 自己封装了解原理

const jwt = require('jsonwebtoken')
module.exports= ({app}) => {
    return async function verify(ctx, next) {
        console.log(99999)
        const authorization = ctx.request.header.authorization
        if (!authorization) {
            ctx.body = {
                code: -666,
                message: '用户没有登录'
            }
            return
        }
        const token = authorization.replace('Bearer ', '')
        try {
            const res = await jwt.verify(token, app.config.jwt.secret)
            console.log('jwt', res)
            // 存到state中,方便后面的中间件使用这些信息
            ctx.state.email = res.email
            ctx.state.userid = res._id
            await next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                ctx.body = {
                    code: -666,
                    message: '登录过期了'
                }
            } else {
                ctx.body = {
                    code: -1,
                    message: '用户信息出错'
                }
            }
        }
    }
}