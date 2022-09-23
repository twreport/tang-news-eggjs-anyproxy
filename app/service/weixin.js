'use strict';
const Service = require('egg').Service;

class WeixinService extends Service {
    //从需要实时监控的biz中和需要分析log的biz中各取一个
    //随机确定选哪个
    async get_1_biz(uin) {
        console.log("uin in func get_1_biz:");
        console.log(uin);
        //加入一个二分分流器，产生一个小于100的随机数
        //如果小于规定的阈值则流向疫情监控系统
        //如果大于规定的阈值则流向日常监控系统
        const door = 50;
        const random_num = await this.get_1_random(0,100);
        if(random_num < door){
            const res_1 = await this.get_1_biz_by_random(uin);
            return res_1;
        }else{
            const res_2 = await this.get_1_biz_by_interval(uin);
            //如果没有需要生成的日常biz，多余算力仍然保障疫情监控系统
            if(res_2 === false){
                return await this.get_1_biz_by_random(uin);
            }
            return res_2;
        }
    }

    //获得所有与疫情监控相关的biz（优先省级疫情微信公众号）
    async get_1_biz_by_random(uin) {
        console.log("uin in func get_1_biz_by_random:");
        console.log(uin);
        const my_query = await this.service.db.select_all_bizs();
        const count = my_query.length;
        // console.log('count:', count);
        const random_num = Math.floor(Math.random() * count);
        return my_query[random_num];
    }

    async get_1_random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //根据爬取时间间隔，选取一个日常监控的公众号
    async get_1_biz_by_interval(uin) {
        console.log("uin in func get_1_biz_by_interval:");
        console.log(uin);

        //1-优先爬取type为1的biz（先生成省级biz的访问参数）
        let biz = await this.service.db.select_1_biz_order_by_update_time(1);
        if (biz != null) {
            const res_1 = await this.service.db.update_biz_time(biz.biz);
            if (res_1 === true) {
                console.log('Find Biz Type 1！');
                console.log(biz);
                return biz;
            } else {
                console.log('Update Biz Time Error！');
                return false;
            }
        } else {
            //2-如果没有需要爬取的type为1的biz，则生成地市州级biz的访问参数
            biz = await this.service.db.select_1_biz_order_by_update_time(2);
            if (biz != null) {
                const res_2 = await this.service.db.update_biz_time(biz.biz);
                if (res_2 === true) {
                    console.log('Find Biz Type 2！');
                    console.log(biz);
                    return biz;
                } else {
                    console.log('Update Biz Time Error！');
                    return false;
                }
            } else {
                //3-如果没有需要爬取的type为1的biz，则生成区县级biz的访问参数
                biz = await this.service.db.select_1_biz_order_by_update_time(3);
                if (biz != null) {
                    const res_3 = await this.service.db.update_biz_time(biz.biz);
                    if (res_3 === true) {
                        console.log('Find Biz Type 3！');
                        console.log(biz);
                        return biz;
                    } else {
                        console.log('Update Biz Time Error！');
                        return false;
                    }
                } else {
                    console.log('No Biz Needs Crawl！');
                    return false;
                }
            }
        }
    }

}

module.exports = WeixinService;