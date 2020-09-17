
const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha')

class UtilController extends Controller {
  async captcha() {
    const captcha = svgCaptcha.create({
        size:4,
        noise: 4,
        width: 100,
        height: 40,
        fontSize: 50
    })
    const { ctx } = this
    ctx.session.captcha = captcha.text
    console.log('captcha=>', captcha.text)
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }
}

module.exports = UtilController
