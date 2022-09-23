'use strict';

const Service = require('egg').Service;

class DbService extends Service {
    //获得所有与疫情监控相关的biz
    async select_all_bizs() {
        //屏蔽停用biz
        const res_all = await  this.app.mysql.select('admin_weixin_urls', {
            where: {'status': 1}
        });
        //取出优先级最高的biz
        const res_type_1 = await this.app.mysql.select('admin_weixin_urls', {
            where: {'type': 1}
        });
        //增加优先级最高权重的biz在队列中的比重
        let final_res = res_all;
        const n = Math.floor(res_all.length / 2);
        for(let i=0; i<n; i++){
            for(let j=0; j<res_type_1.length; j++){
                final_res.push(res_type_1[j])
            }
        }
        return final_res;
    }

    //更新日常检测biz的update_time
    async update_biz_time(biz){
        const now_time_13 = new Date().getTime();
        const now_time = Math.floor(now_time_13 / 1000);
        const row = {
            'update_time': now_time
        }
        const options = {
            where: {
                'biz': biz
            }
        };
        const result = await this.app.mysql.update('admin_weixin_bizs', row, options); // 更新 admin_weixin_bizs 表中的记录
        const updateSuccess = result.affectedRows === 1;
        return updateSuccess;
    }

    //选取一个即将爬取的biz来生成访问参数
    async select_1_biz_order_by_update_time(type){
        const weixin_parameter_limit = 1200;
        const rows = await this.app.mysql.select('admin_weixin_bizs', {
            orders: [['update_time', 'asc']],
            where: {'type': type}
        });
        const now_time_13 = new Date().getTime();
        const now_time = Math.floor(now_time_13 / 1000);
        for(let i=0;i<rows.length;i++){
            //确保参数在即将发生访问的20分钟之内生成
            let interval_time = Math.floor(rows[i].interval);
            if(interval_time > weixin_parameter_limit){
                interval_time = weixin_parameter_limit;
            }
            let crawl_time = Math.floor(rows[i].update_time + interval_time);
            if(now_time > crawl_time){
                console.log('Find Biz!');
                console.log(rows[i]);
                return rows[i];
            }
        }
        return null;
    }

    async is_frequent(uin) {
        // 将url地址里的uin的==替换为%3D%3D
        uin = uin.replace("==", "%3D%3D");
        const now_time = parseInt(new Date().getTime() / 1000);
        const interval_time = 24 * 60 * 60;
        const frequent_time_pass = now_time - interval_time;
        console.log("frequent_time_pass", frequent_time_pass);
        const sql_str = 'SELECT * FROM admin_frequent_uin where frequent_time > ' +  frequent_time_pass + ' and uin = "' + uin + '";';
        console.log("sql_str", sql_str);
        const res = await this.app.mysql.query(sql_str);
        if(res.length > 0){
            return true;
        }else{
            return false;
        }
    }
}
module.exports = DbService;
