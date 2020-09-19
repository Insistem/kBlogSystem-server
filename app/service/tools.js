const { Service } = require('egg')
const nodemailer = require('nodemailer')
const fse = require('fs-extra')
const { WriteStream } = require('fs-extra')
const path = require('path')

const userEmail = '2458008146@qq.com'
const transporter = nodemailer.createTransport({
    service: 'QQ',
    secureConnection: true,
    auth: {
        user: userEmail,
        pass: 'dbfgqxswxgrbdhhd' // IMAP/SMTP服务的第三方登录授权码
    }
})

class ToolService extends Service {
    async sendMail (email, subject, text, html) {
        console.log('email111', email)
        const mailOptions = {
            from: userEmail,
            cc: userEmail,
            to: email,
            subject,
            text,
            html
        }
        try {
            await transporter.sendMail(mailOptions)
            return true
        } catch (e) {
            console.log('error', e)
            return false
        }
    }
    async mergeFile (filePath, hash, size) {
        const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash) // 切片所在的目录
        let chunksPathList = await fse.readdir(chunkDir) // 每个切片的文件名称list
        chunksPathList.sort((a, b) => a.split('-')[1] - b.split('-')[1]) // 排序
        chunksPathList = chunksPathList.map(cp => path.resolve(chunkDir, cp))
        await this.mergeChunks(chunksPathList, filePath, size)
    }
    async mergeChunks (chunksPathList, dest, size) {
        const pipStream = (filePath, writeStream) => {
            return new Promise(resolve => {
                const readStream = fse.createReadStream(filePath)
                readStream.on('end', ()=> {
                    fse.unlinkSync(filePath)
                    resolve()
                })
                readStream.pipe(writeStream)
            })
        }

        await Promise.all(
            chunksPathList.map((filePath, index) =>
                pipStream(filePath, fse.createWriteStream(dest, {
                    start: index * size,
                    end: (index + 1) * size
                })))
        )
    }

}

module.exports = ToolService