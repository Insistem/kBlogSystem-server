'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  const jwt = app.middleware.jwt({app})

  // 获取验证码
  router.get('/captcha', controller.util.captcha) 
  // 发送邮件
  router.get('/sendcode', controller.util.sendcode) 
  // 文件上传
  router.post('/uploadfile', controller.util.uploadfile) 
  // 文件合并
  router.post('/merge', controller.util.merge) 
  // 获取文件是否已经上传,和已经上传了的切片
  router.post('/checkfile', controller.util.checkfile) 
  // 接下来需要写一系列的接口,需要对接口进行分组
   // /user/login
  // /user/register
  router.group({name: 'user', prefix: '/user'}, router => {
    const { info, register, login, verify } = controller.user
    router.post('/register', register)
    router.post('/login', login)
    // 增加中间件
    router.get('/info', jwt, info)

    router.get('/verify', verify)
  })
}
