// 用户相关接口
const BaseController = require('./base')
const md5 = require('md5')
const HashSalt = ':kblog'
const createRule = {
    email: {type: 'email'},
    password: {type: 'string'},
    nickname: {type: 'string'},
    captcha: {type: 'string'}
}
class UserController extends BaseController {
    async login() {

    }
    async register() {
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
        if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
            // 校验邮箱是否重复
            if (await this.checkEmail(email)) {
                this.error('邮箱重复了')
            } else {
                // 如果邮箱没重复,可以做入库操作
                let ret = await ctx.model.User.create({
                    email,
                    nickname,
                    password: md5(password+HashSalt)
                })
                if (ret._id) {
                    this.message('注册成功')
                }
            }
            // this.success({name: 'demo'})
        } else {
            this.error('验证码错误')
        }
    }
     // 校验邮箱是否重复
    async checkEmail(email) {
        const user = await this.ctx.model.User.findOne({email})
        return user
    }
    async verify() {
        // 校验用户名是否存在
    }
    async info() {
    }
}

module.exports = UserController