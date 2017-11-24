import http from 'axios';
import qs from 'qs';
import lib from './lib';

let refreshNoncer = async() => {
    // let refUrl = location.href.split('?')[0].split('#')[0];
    // 此时可将引用url链接作为 url 参数请求登录，作为强校验；
    // 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端; 
    let url = apps.host + 'authorize.json?user=develop&psw=111111';
    return await http.get(url).then(res => res.data.token);
}


// 自动处理token更新，data 序列化等
export let axios = async option => {

    // token为空时自动获取
    if (apps.token == '') {

        let user = apps.loadUserInfo();
        if (user.token == '') {
            apps.token = await refreshNoncer();
        }
    }

    option = Object.assign(option, {
        headers: {
            'Authorization': apps.token
        }
    })

    if (typeof option.method == 'undefined') {
        option.method = 'get';
    }

    return await http.create({
        baseURL: apps.host,
        timeout: 10000,
        transformRequest: [function(data) {
            return qs.stringify(data)
        }]
    })(option).then(res => {
        // 刷新token
        if (typeof res.data.token != 'undefined') {
            apps.token = res.data.token;
        }
        return res.data;
    }).catch(res => {
        let req = res.response.request;
        let errMsg = `${req.status} ${req.statusText}<br>数据读取失败<br>错误原因：${res.response.data.errmsg}`
        lib.tip(errMsg, 1, 0);
        let data = res.response.data;
        data.status = req.status;
        data.statusText = req.statusText;
        return Promise.reject(data);
    })
};