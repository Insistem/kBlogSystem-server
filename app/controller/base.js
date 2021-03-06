// 制定接口规范 

const Controller = require('egg').Controller
class BaseController extends Controller {
    success(data) {
        this.ctx.body = {
            code:0,
            data
        }
    }
    message(message) {
        this.ctx.body = {
            code:0,
            message
        }
    }
    error(message, code=1, errors={}) {
        this.ctx.body = {
            code,
            message,
            errors
        }
    }
}

module.exports = BaseController