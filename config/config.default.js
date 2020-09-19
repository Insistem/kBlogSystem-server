/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path')
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1600157418126_6745'

    // 文件模式
  config.multipart = {
    mode: 'file',
    whitelist: ()=>true
  }
  // 文件的存储位置
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public')

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false
      }
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kblog',
        options:{}
      }
    },
    jwt: {
      secret: '@mpy!12344__'
    }
  }
}
