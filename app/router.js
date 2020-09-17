'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  // 获取验证码
  router.get('/captcha', controller.util.captcha) 
  // 接下来需要写一系列的接口,需要对接口进行分组
   // /user/login
  // /user/register
  router.group({name: 'user', prefix: '/user'}, router => {
    const { info, register, login, verify } = controller.user
    router.post('/register', register)
    router.post('/login', login)
    router.get('/info', info)
    router.get('/verify', verify)
  })
}
