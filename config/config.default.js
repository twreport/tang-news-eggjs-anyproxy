/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: '10.168.1.100',
        // 端口号
        port: '3306',
        // 用户名
        user: 'nodejs',
        // 密码
        password: 'tw7311',
        // 数据库名
        database: 'news',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  };

  //关闭csrf机制
  config.security = {
    csrf: {
      enable: false
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1653442279550_9925';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    ScrapydServerUrl: 'http://10.168.1.99:6800/'
  };

  return {
    ...config,
    ...userConfig,
  };
};
