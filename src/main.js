// 引入Vue
import Vue from 'vue';
// 引入入口文件
import App from './App';
// 引入路由文件
import router from './router';
// 引入 vuex
import Vuex from 'vuex';
// 引入 ElementUI
import ElementUI from 'element-ui';
// 引入api 接口
import api from './config/api';
// 引入分页
import pages from './components/pages';
// ie兼容
import 'babel-polyfill';
// 引入md5
import md5 from 'js-md5';
// 自适应
// import 'lib-flexible';
// 阻止启用生产消息
Vue.config.productionTip = false;
// element-ui的默认主题
// import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css';
// 引入格式化css
import './assets/css/base.css';
// 引入全局css
import './assets/css/common.css';
// 字体图标库 字体编码引用
import './assets/css/fontStyle.css';
// 字体图标库 类名方式引用
import './assets/font/iconfont.css';
// 获取cookie
Vue.prototype.getCookie = getCookie;
// 设置cookie
Vue.prototype.setCookie = setCookie;
// 删除cookie
Vue.prototype.delCookie = delCookie;
// 调用md5
Vue.prototype.$md5 = md5;
// 调用api接口
Vue.prototype.$api = api;
// 使用分页
Vue.component('pages', pages);
// 调用elementUI
Vue.use(ElementUI);
// 调用vuex
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading: false, // 是否拼命加载
        menuList: [], // 缓存最新的左侧导航菜单
    },
    mutations: {
        // 设置loading
        setLoading(state, value) {
            state.loading = value;
        },
        // 设置menu
        setMenu(state, value) {
            state.menuList = value;
        }
    }
});

// 处理返回的动态内容换行
Vue.prototype.returnHtmlContent = (content, flag) => {
    let lineNum = 10; // 默认显示行数
    let obj = new Object();
    content = content.replace(/\n/g, '<br>');
    if (flag) {
        // 展开操作
        obj.flag = 0; // 0:判断是否需要按钮  1为截取  2为不截取
        obj.data = content;
        return obj;
    } else {
        // 默认收起，判断是否进行截取
        let count = 0;
        for (let index = 0; index < content.length; index++) {
            let a = content.indexOf("<br>", index);
            if (a !== -1 && content.indexOf("<br>", index) !== content.indexOf("<br>", index - 1)) {
                count++;
            }
            if (count >= lineNum) {
                obj.flag = 1; // 0:判断是否需要按钮  1为截取  2为不截取
                obj.data = content.substring(0, index - 1);
                break ;
            }
        }
        if (count === 0) {
            obj.flag = 0; // 0:判断是否需要按钮  1为截取  2为不截取
            obj.data = content;
        }
        if (count < lineNum && count !== 0) {
            obj.flag = 2; // 0:判断是否需要按钮  1为截取  2为不截取
            obj.data = content;
        }
        return obj;
    }
};

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
    watch: {
        "$route": 'checkLogin'
    },
    methods: {
        // 检查是否登录
        checkLogin() {
            // 前端的token过期 跳转至登录页
            // if (!this.getCookie('TEAM_WANG_TOKEN') && this.$route.name !== 'LOGIN') {
            //     this.$router.replace('/login');
            // }
        }
    }
});

// 获取cookie
function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

export {getCookie};

// 设置cookie 有效期为30天
function setCookie(name, value, days) {
    var exp = new Date();
    exp.setDate(exp.getDate() + days);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

// 删除 cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
