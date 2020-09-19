
const BaseController = require('./base')
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')
class UtilController extends BaseController {
    // 发送验证码
    async captcha () {
        const captcha = svgCaptcha.create({
            size: 4,
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
    // 发送邮件
    async sendcode () {
        const { ctx } = this
        const email = ctx.query.email
        let code = Math.random().toString().slice(2, 6)
        console.log('邮箱' + email + '验证码' + code)
        // TODO: 为啥都是存在session里面???
        ctx.session.emailcode = code

        const subject = 'kblog 验证码'
        const text = ''
        const html = `<h2>葵花课堂</h2><a href="http://baidu.com"><span>${code}</span></a>`
        // 这里发送邮件功能写到单独的服务中,方便多个地方调用
        // TODO: 写在app目录下的内容是挂在 this的 还是挂在 ctx上的,怎么这里都可以???? 所以这里可以直接使用 this.service ??
        const hasSend = await ctx.service.tools.sendMail(email, subject, text, html)
        if (hasSend) {
            this.message('发送成功')
        } else {
            this.error('发送失败')
        }
    }
    // 文件上传
    async uploadfile () {
        // hash的存储地址为 /public/hash/name
        const { ctx } = this
        const file = ctx.request.files[0]
        const { hash, name } = ctx.request.body
        const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash) // 文件切片存储的位置
        if (!fse.existsSync(chunkPath)) {
            await fse.mkdir(chunkPath)
        }
        await fse.move(file.filepath, chunkPath + '/' + name)
        this.message('切片上传成功!')

        // await fse.move(file.filepath, this.config.UPLOAD_DIR+'/'+file.filename)
        // this.success({
        //     url: `/public/${file.filename}`
        // })
    }
    // 文件合并
    async merge () {
        const { ctx } = this
        const { hash, ext, size } = ctx.request.body
        const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`) // 最终完成文件的存储路径
        console.log('filePath', filePath, hash, size)
        await ctx.service.tools.mergeFile(filePath, hash, size)
        this.success({
            url: `/public/${hash}.${ext}`
        })
    }
    // 获取文件是否已经上传,和已经上传了的切片
    async checkfile () {
        const { ctx } = this
        const { hash, ext } = ctx.request.body
        const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`)
        const hashPath =  path.resolve(this.config.UPLOAD_DIR, hash)

        let uploaded = false
        let uploadedList = []
        if (fse.existsSync(filePath)) {
            // 文件已经上传了
            uploaded = true
        } else {
            uploadedList = await this.getLoadedList(hashPath)
        }
        this.success({
            uploaded,
            uploadedList
        })
    }
    async getLoadedList(chunkDir) {
        let uploadedList = []
        if (fse.existsSync(chunkDir)) {
            uploadedList = (await fse.readdir(chunkDir)).filter(name => name[0] !== '.') // 过滤下隐藏文件
        } else {
            uploadedList = []
        }
        return uploadedList
    }
}

module.exports = UtilController
