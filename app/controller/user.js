// 用户相关接口
const BaseController = require('./base')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const HashSalt = ':kblog'
const createRule = {
    email: { type: 'email' },
    password: { type: 'string' },
    nickname: { type: 'string' },
    captcha: { type: 'string' }
}
class UserController extends BaseController {
    async login () {
        // this.success('token')
        const { ctx, app } = this
        const { email, captcha, password, emailcode } = ctx.request.body
        // 校验验证码是否正确
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        console.log('ctx.session.emailcode', ctx.session.emailcode, emailcode)
        if(emailcode !== ctx.session.emailcode) {
            return this.error('邮箱验证码错误')
        }
        const user = await ctx.model.User.findOne({
            email,
            password: md5(password+HashSalt)
        })
        if (!user)
            return this.error('用户名密码错误')
        // 用户的信息加密成token返回
        const token = jwt.sign({
            _id: user._id,
            email
        }, app.config.jwt.secret, {
            expiresIn: '10h'
        })
        this.success({token, email, nickname: user.nickname})
    }
    async register () {
        const { ctx } = this
        try {
            // 校验传递的参数
            ctx.validate(createRule)
        } catch (error) {
            return this.error('参数校验失败', 1, error.errors)
        }
        const { email, password, captcha, nickname } = ctx.request.body
        console.log({ email, password, captcha, nickname })
        // 校验验证码是否正确
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            return this.error('验证码错误')
        }
        if (await this.checkEmail(email)) {
            return this.error('邮箱重复了') // 校验邮箱是否重复
        }
        // 如果邮箱没重复,可以做入库操作
        let ret = await ctx.model.User.create({
            email,
            nickname,
            password: md5(password + HashSalt)
        })
        if (ret._id) {
            this.message('注册成功')
        }
    }
    // 校验邮箱是否重复
    async checkEmail (email) {
        const user = await this.ctx.model.User.findOne({ email })
        return user
    }
    async verify () {
        // 校验用户名是否存在
    }
    async info () {
        // 获取用户信息,根据token信息
        // 引入
        const { ctx } = this
        const { email } = ctx.state
        const user = await this.checkEmail(email)
        this.success(user)
    }
}

module.exports = UserController