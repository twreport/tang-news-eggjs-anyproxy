'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  // 执行js注入任务
  async link() {
    const { ctx } = this;
    const query = ctx.query;
    // console.log("======================================");
    // console.log(query);
    // console.log("======================================");
    const uin = query.uin;
    const time_interval = 10000;
    // 加入uin判断（20220620）
    // 如果uin已经被微信官方判定访问频繁，该uin不再产生参数
    const is_frequent = await this.ctx.service.db.is_frequent(uin);
    console.log("is_frequent:", is_frequent);
    if(is_frequent == true){
      ctx.body = '<meta charset="UTF-8" />';
      ctx.body += '<div align="center" style="height: 20%;width: 100%;"></div>';
      ctx.body += '<div align="center"><img src="http://10.168.1.100:7001/public/logo.jpg" style="width: 15em;height: auto;"/></div>';
      ctx.body += '<div align="center" style="color: red"><h2>TANGWEI NEWS</h2></div>';
      ctx.body += '<div align="center"  style="height: 25%;width: 100%;"></h3></div>';
      ctx.body += '<div align="center">';
      ctx.body += '<h1 style="color: red">-- AnyProxy Hacked By TangWei! --</h1>';
      ctx.body += '<h1 style="color: red">' + '本终端已被微信官方判定频繁访问！！！' + '</h1>'
      ctx.body += '<h1 style="color: red">-- 暂时停止生成访问参数！ --</h1>';
      ctx.body += '</div>'
      ctx.body += '<script>setTimeout(function(){window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA5MDEwNzA4MQ==&scene=124#wechat_redirect";},' + time_interval + ');</script>';
    }else{
      const biz = await this.ctx.service.weixin.get_1_biz(uin);
      ctx.body = '<meta charset="UTF-8" />';
      ctx.body += '<div align="center" style="height: 20%;width: 100%;"></div>';
      ctx.body += '<div align="center"><img src="http://10.168.1.100:7001/public/logo.jpg" style="width: 15em;height: auto;"/></div>';
      ctx.body += '<div align="center"><h2>TANGWEI NEWS</h2></div>';
      ctx.body += '<div align="center"  style="height: 25%;width: 100%;"></h3></div>';
      ctx.body += '<div align="center">';
      ctx.body += '<h1>-- AnyProxy Hacked By TangWei! --</h1>';
      ctx.body += '<h1>' + '正在生成微信公众号【' + biz.name + '】的访问参数！' + '</h1>'
      ctx.body += '<h1>-- 稍后将自动跳转！ --</h1>';
      ctx.body += '</div>'
      ctx.body += '<script>setTimeout(function(){window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=' + biz.biz + '&scene=124#wechat_redirect";},' + time_interval + ');</script>';
    }


    }
}

module.exports = HomeController;
