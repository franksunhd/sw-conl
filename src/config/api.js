// 引入axios
import axios from 'axios';
import {getCookie} from '../main';
import ElementUI from 'element-ui';
import VueRouter from '../router/index';

// 生产ip 39.105.121.157
// 测试ip 39.104.145.104
// 香港测试IP 39.105.204.196

// 所有接口的 base_url 前缀 生产环境第一个 测试环境第二个
// 正式IP
var root = process.env.NODE_ENV === 'production' ? 'http://39.105.121.157:8001/' : 'http://39.105.121.157:8001/';
// 测试IP
// var root = process.env.NODE_ENV === 'production' ? 'http://39.104.145.104:8001/' : 'http://39.104.145.104:8001/';
// 香港IP
// var root = process.env.NODE_ENV === 'production' ? 'http://39.105.204.196:8001/' : 'http://39.104.145.104:8001/';
// 本地IP
// var root = 'http://192.168.31.19:8001/';

// 正式服图片前缀
var imgUrl = 'http://jacksonwangossservice.oss-cn-beijing.aliyuncs.com/';

// 王嘉尔固定账号id
var teamWangId = '2';
// 超级管理员和专用测试账号id
var adminId = ['1', '3'];

// 导出邮箱校验正则
var ruleEmail = /^\w+@[a-zA-Z0-9]{2,30}(?:\.[a-z]{2,4}){1,3}$/;

// 视频上传格式限制
var mvType = ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/quicktime'];

function apiAxios(method, url, params, success) {
    axios({
        method: method, // 请求方式 post get delete get等
        url: url, // 具体接口地址
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        baseURL: root, // base_url
        withCredentials: false,  // cookie
        headers: {
            'Content-Type': 'application/json;charset=utf-8', // 请求头
            'token': getCookie('TEAM_WANG_TOKEN') || ''
        }
    }).then(function (res) {
        // 成功时回调
        if (success) {
            // 全局处理状态码
            if (res.data.status === 1002 || res.data.status === 2011) {
                // 1002 用户不存在 2011: 登录失效
                ElementUI.MessageBox.confirm(res.data.message, '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    VueRouter.push({name: 'LOGIN'});
                    window.location.reload();
                }).catch(() => {
                    VueRouter.push({name: 'LOGIN'});
                    window.location.reload();
                });
            } else if (res.data.status === 2023) {
                // 包含敏感词汇
                ElementUI.Message.warning('包含敏感词汇');
            } else if (res.data.status === 3005) {
                // 参数为空
                ElementUI.Message.warning('请求参数为空');
            } else {
                success(res.data);
            }
        }
    }).catch(function (err) {
        // 异常时回调
        return false;
    });
}

// 返回在vue模板中的调用接口
export default {
    // 查询
    get: function (url, params, success) {
        return apiAxios('GET', url, params, success);
    },
    // 修改
    post: function (url, params, success) {
        return apiAxios('POST', url, params, success);
    },
    // 更新
    put: function (url, params, success) {
        return apiAxios('PUT', url, params, success);
    },
    // 删除
    delete: function (url, params, success) {
        return apiAxios('DELETE', url, params, success);
    },
    // root接口
    root: function () {
        return root;
    },
    // imgUrl
    imgUrl: function () {
        return imgUrl;
    },
    // teamWang ID
    id: function () {
        return teamWangId;
    },
    // mv上传格式限制
    mvType: function () {
        return mvType;
    },
    // 邮箱正则校验
    ruleEmail: function () {
        return ruleEmail;
    },
    // admin账户
    adminId: function () {
        return adminId;
    }
}
