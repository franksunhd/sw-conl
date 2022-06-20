import Vue from 'vue';
import Router from 'vue-router';

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
};

// 全局模板Index
import Index from '../page/Index';
// 登录页
import Login from "../page/Login";
// 用户管理
import USER from "../page/pages/USER/USER";
// 用户详情
import USER_DETAILS from "../page/pages/USER/USERDETAILS";
// 修改密码
import PASSWORD from "../page/pages/USER/PASSWORD";
// 动态
import DYNAMIC from "../page/pages/LIFESTYLE/DYNAMIC";
// 内容管理
import CONTENT from "../page/pages/CONTENT/CONTENT";
// 发布图片
import ADD_IMG from "../page/pages/CONTENT/IMG/ADDIMG";
// 编辑图片
import EDIT_IMG from "../page/pages/CONTENT/IMG/EDITIMG";
// 发布音乐
import ADD_MUSIC from "../page/pages/CONTENT/MUSIC/ADDMUSIC";
// 编辑音乐
import EDIT_MUSIC from "../page/pages/CONTENT/MUSIC/EDITMUSIC";
// 发布MV
import ADD_MV from "../page/pages/CONTENT/MV/ADDMV";
// 编辑MV
import EDIT_MV from "../page/pages/CONTENT/MV/EDITMV";
// 发布新闻
import ADD_NEWS from "../page/pages/CONTENT/NEWS/ADDNEWS";
// 编辑新闻
import EDIT_NEWS from "../page/pages/CONTENT/NEWS/EDITNEWS";
// 发布行程
import ADD_TRAVEL from "../page/pages/CONTENT/TRAVEL/ADDTRAVEL";
// 编辑行程
import EDIT_TRAVEL from "../page/pages/CONTENT/TRAVEL/EDITTRAVEL";
// 发布公告
import ADD_ACTIVITY from "../page/pages/CONTENT/ACTIVITY/ADDACTIVITY";
// 编辑公告
import EDIT_ACTIVITY from "../page/pages/CONTENT/ACTIVITY/EDITACTIVITY";
// 发布代言
import ADD_ADVOCACY from "../page/pages/CONTENT/ADVOCACY/ADDADVOCACY";
// 编辑代言
import EDIT_ADVOCACY from "../page/pages/CONTENT/ADVOCACY/EDITADVOCACY";
// 发布综艺
import ADD_VARIETY from "../page/pages/CONTENT/VARIETY/ADDVARIETY";
// 编辑综艺
import EDIT_VARIETY from "../page/pages/CONTENT/VARIETY/EDITVARIETY";
// 艺人经历
import PERSONAL_DATA from "../page/pages/PERSONAL/PERSONAL_DATA";
// 团队介绍
import TEAM_DATA from "../page/pages/PERSONAL/TEAM_DATA";
// VIP 动态
import VIP_DYNAMIC from "../page/pages/VIP/VIP_DYNAMIC";
// VIP 内容管理
import VIP_CONTENT from "../page/pages/VIP/CONTENT/VIP_CONTENT";
// VIP 添加照片
import VIP_ADD_PHOTOS from "../page/pages/VIP/CONTENT/VIP_PHOTOS/VIP_ADD_PHOTOS";
// VIP 编辑图片
import VIP_EDIT_PHOTOS from "../page/pages/VIP/CONTENT/VIP_PHOTOS/VIP_EDIT_PHOTOS";
// VIP 添加视频
import VIP_ADD_VIDEOS from "../page/pages/VIP/CONTENT/VIP_VIDEOS/VIP_ADD_VIDEOS";
// VIP 编辑视频
import VIP_EDIT_VIDEOS from "../page/pages/VIP/CONTENT/VIP_VIDEOS/VIP_EDIT_VIDEOS";
// VIP 添加活动
import VIP_ADD_ACTIVITY from "../page/pages/VIP/CONTENT/VIP_ACTIVITY/VIP_ADD_ACTIVITY";
// VIP 编辑活动
import VIP_EDIT_ACTIVITY from "../page/pages/VIP/CONTENT/VIP_ACTIVITY/VIP_EDIT_ACTIVITY";
// VIP 添加 留言板
import VIP_ADD_MESSAGE from "../page/pages/VIP/CONTENT/VIP_MESSAGE/VIP_ADD_MESSAGE";
// VIP 展示留言板
import VIP_SHOW_MESSAGE from "../page/pages/VIP/CONTENT/VIP_MESSAGE/VIP_SHOW_MESSAGE";
// VIP 公告
import VIP_NOTICE from "../page/pages/VIP/VIP_NOTICE";
// VIP 留言板
import VIP_MESSAGE from "../page/pages/VIP/CONTENT/VIP_MESSAGE/MESSAGE";
// 首页动画管理
import ANIMATION from '../page/pages/ANIMATION/index';
// 订单管理 => 活动订单
import ACTIVITY_ORDER from "../page/pages/ORDER/ACTIVITY_ORDER";
// 订单管理 => 会员订单
import ORDER from "../page/pages/ORDER/ORDER";
// 艺人资料
import ARTIST_DATA from "../page/pages/PERSONAL/ARTIST_DATA";
// 团队资料
import TEAM_INFORMATION from "../page/pages/PERSONAL/TEAM_INFORMATION";
// 平台logo
import LOGO_MANAGE from "../page/pages/SYSTEM/LOGO/LOGO_MANAGE";
// 添加logo
import ADD_LOGO from "../page/pages/SYSTEM/LOGO/ADD_LOGO";
// 官网菜单
import MENU_MANAGE from "../page/pages/SYSTEM/MENU/MENU_MANAGE";
// 编辑菜单
import EDIT_MENU from "../page/pages/SYSTEM/MENU/EDIT_MENU";
// 会员权益
import RIGHTS from "../page/pages/VIP/RIGHTS/RIGHTS";
// 添加会员权益
import ADD_RIGHTS from "../page/pages/VIP/RIGHTS/ADD_RIGHTS";
// 编辑会员权益
import EDIT_RIGHTS from "../page/pages/VIP/RIGHTS/EDIT_RIGHTS";
// 角色维护
import ROLE from "../page/pages/USER/ROLE";
// 添加编辑管理员
import USER_EDIT from "../page/pages/USER/USER_EDIT";
// 系统设置 -> 活动弹窗
import DIALOG from "../page/pages/SYSTEM/DIALOG";

Vue.use(Router);

export default new Router({
    routes: [
        {path: "/", redirect: "/login"},
        {path: '/login', name: 'LOGIN', component: Login},
        {
            path: "/teamWang", name: "index", component: Index,
            children: [
                // 发布动态 -> 生活方式
                {path: "/teamWang/dynamic", name: "DYNAMIC", meta: {title: ['发布动态', '生活方式']}, component: DYNAMIC},
                // 发布动态 -> 独家动态
                {
                    path: "/teamWang/vipDynamic",
                    name: 'VIP_DYNAMIC',
                    meta: {title: ['发布动态', '独家动态']},
                    component: VIP_DYNAMIC
                },
                // 留言板
                {
                    path: "/teamWang/vipMassage",
                    name: "VIP_MESSAGE",
                    meta: {title: ['留言板']},
                    component: VIP_MESSAGE
                },
                // 发布内容
                {path: "/teamWang/content", name: "CONTENT", meta: {title: ['发布内容', 'COMMON']}, component: CONTENT},
                // 发布图片
                {
                    path: "/teamWang/content/addImg",
                    name: "ADD_IMG",
                    meta: {title: ['发布内容', 'COMMON', '发布图片']},
                    component: ADD_IMG
                },
                // 编辑图片
                {
                    path: "/teamWang/content/editImg",
                    name: "EDIT_IMG",
                    meta: {title: ['发布内容', 'COMMON', '编辑图片']},
                    component: EDIT_IMG
                },
                // 发布音乐
                {
                    path: "/teamWang/content/addMusic",
                    name: "ADD_MUSIC",
                    meta: {title: ['发布内容', 'COMMON', '发布音乐']},
                    component: ADD_MUSIC
                },
                // 编辑音乐
                {
                    path: "/teamWang/content/editMusic",
                    name: "EDIT_MUSIC",
                    meta: {title: ['发布内容', 'COMMON', '编辑音乐']},
                    component: EDIT_MUSIC
                },
                // 发布MV
                {
                    path: "/teamWang/content/addMV",
                    name: "ADD_MV",
                    meta: {title: ['发布内容', 'COMMON', '发布MV']},
                    component: ADD_MV
                },
                // 编辑MV
                {
                    path: "/teamWang/content/editMV",
                    name: "EDIT_MV",
                    meta: {title: ['发布内容', 'COMMON', '编辑MV']},
                    component: EDIT_MV
                },
                // 发布新闻
                {
                    path: "/teamWang/content/addNews",
                    name: "ADD_NEWS",
                    meta: {title: ['发布内容', 'COMMON', '发布新闻']},
                    component: ADD_NEWS
                },
                // 编辑新闻
                {
                    path: "/teamWang/content/editNews",
                    name: "EDIT_NEWS",
                    meta: {title: ['发布内容', 'COMMON', '编辑新闻']},
                    component: EDIT_NEWS
                },
                // 发布行程
                {
                    path: "/teamWang/content/addTravel",
                    name: "ADD_TRAVEL",
                    meta: {title: ['发布内容', 'COMMON', '发布行程']},
                    component: ADD_TRAVEL
                },
                // 编辑行程
                {
                    path: "/teamWang/content/editTravel",
                    name: "EDIT_TRAVEL",
                    meta: {title: ['发布内容', 'COMMON', '编辑行程']},
                    component: EDIT_TRAVEL
                },
                // 发布活动公告
                {
                    path: "/teamWang/content/addActivity",
                    name: "ADD_ACTIVITY",
                    meta: {title: ['发布内容', 'COMMON', '发布活动']},
                    component: ADD_ACTIVITY
                },
                // 编辑活动公告
                {
                    path: "/teamWang/content/editActivity",
                    name: "EDIT_ACTIVITY",
                    meta: {title: ['发布内容', 'COMMON', '编辑活动']},
                    component: EDIT_ACTIVITY
                },
                // 发布代言
                {
                    path: "/teamWang/content/addAdvocacy",
                    name: "ADD_ADVOCACY",
                    meta: {title: ['发布内容', 'COMMON', '发布代言']},
                    component: ADD_ADVOCACY
                },
                // 编辑代言
                {
                    path: "/teamWang/content/editAdvocacy",
                    name: "EDIT_ADVOCACY",
                    meta: {title: ['发布内容', 'COMMON', '编辑代言']},
                    component: EDIT_ADVOCACY
                },
                // 发布综艺
                {
                    path: "/teamWang/content/addVariety",
                    name: "ADD_VARIETY",
                    meta: {title: ['发布内容', 'COMMON', '发布综艺']},
                    component: ADD_VARIETY
                },
                // 编辑综艺
                {
                    path: "/teamWang/content/editVariety",
                    name: "EDIT_VARIETY",
                    meta: {title: ['发布内容', 'COMMON', '发布综艺']},
                    component: EDIT_VARIETY
                },
                // 发布内容
                {
                    path: "/teamWang/vipContent",
                    name: 'VIP_CONTENT',
                    meta: {title: ['发布内容', 'VIP']},
                    component: VIP_CONTENT
                },
                // 发布VIP活动
                {
                    path: "/teamWang/vipContent/vipAddActivity",
                    name: 'VIP_ADD_ACTIVITY',
                    meta: {title: ['发布内容', 'VIP', '发布VIP活动']},
                    component: VIP_ADD_ACTIVITY
                },
                // 编辑VIP活动
                {
                    path: "/teamWang/vipContent/vipEditActivity",
                    name: 'VIP_EDIT_ACTIVITY',
                    meta: {title: ['发布内容', 'VIP', '编辑VIP活动']},
                    component: VIP_EDIT_ACTIVITY
                },
                // 发布VIP照片
                {
                    path: "/teamWang/vipContent/vipAddPhotos",
                    name: 'VIP_ADD_PHOTOS',
                    meta: {title: ['发布内容', 'VIP', '发布VIP照片']},
                    component: VIP_ADD_PHOTOS
                },
                // 编辑VIP照片
                {
                    path: "/teamWang/vipContent/vipEditPhotos",
                    name: 'VIP_EDIT_PHOTOS',
                    meta: {title: ['发布内容', 'VIP', '编辑VIP照片']},
                    component: VIP_EDIT_PHOTOS
                },
                // 发布VIP视频
                {
                    path: "/teamWang/vipContent/vipAddVideos",
                    name: 'VIP_ADD_VIDEOS',
                    meta: {title: ['发布内容', 'VIP', '发布VIP视频']},
                    component: VIP_ADD_VIDEOS
                },
                // 编辑VIP视频
                {
                    path: "/teamWang/vipContent/vipEditVideos",
                    name: 'VIP_EDIT_VIDEOS',
                    meta: {title: ['发布内容', 'VIP', '编辑VIP视频']},
                    component: VIP_EDIT_VIDEOS
                },
                // 发布VIP留言
                {
                    path: "/teamWang/vipContent/vipAddMessage",
                    name: 'VIP_ADD_MESSAGE',
                    meta: {title: ['发布内容', 'VIP', '发布VIP留言']},
                    component: VIP_ADD_MESSAGE
                },
                // 查看VIP留言
                {
                    path: "/teamWang/vipContent/vipShowMessage",
                    name: 'VIP_SHOW_MESSAGE',
                    meta: {title: ['发布内容', 'VIP', '查看VIP留言']},
                    component: VIP_SHOW_MESSAGE
                },
                // 订单管理 => 活动订单
                {
                    path: "/teamWang/activityOrder",
                    name: 'ACTIVITY_ORDER',
                    meta: {title: ['订单管理', '活动订单']},
                    component: ACTIVITY_ORDER
                },
                // 订单管理 => 会员订单
                {
                    path: "/teamWang/order",
                    name: 'ORDER',
                    meta: {title: ['订单管理', '会员订单']},
                    component: ORDER
                },
                // 用户管理
                {path: "/teamWang/user", name: "USER", meta: {title: ['权限管理', '用户管理']}, component: USER},
                // 添加/编辑管理员
                {
                    path: "/teamWang/user/addEdit",
                    name: "USER_EDIT",
                    meta: {title: ['权限管理', '用户管理', '添加/编辑管理员']},
                    component: USER_EDIT
                },
                // 用户管理
                {path: "/teamWang/role", name: "ROLE", meta: {title: ['权限管理', '角色管理']}, component: ROLE},
                // 用户详情
                {
                    path: "/teamWang/user/userDetail",
                    name: "USER_DETAILS",
                    meta: {title: ['用户管理', '用户详情']},
                    component: USER_DETAILS
                },
                // 修改密码
                {path: "/teamWang/password", name: "PASSWORD", meta: {title: ['修改密码']}, component: PASSWORD},
                // 闪屏动画
                {
                    path: "/teamWang/animation",
                    name: 'ANIMATION',
                    meta: {title: ['系统设置', '闪屏动画']},
                    component: ANIMATION
                },
                // VIP 公告
                {
                    path: "/teamWang/vipNotice",
                    name: 'VIP_NOTICE',
                    meta: {title: ['系统设置', '协议维护']},
                    component: VIP_NOTICE
                },
                // 艺人经历
                {
                    path: "/teamWang/personalData",
                    name: "PERSONAL_DATA",
                    meta: {title: ['系统设置', '艺人经历']},
                    component: PERSONAL_DATA
                },
                // 艺人资料
                {
                    path: "/teamWang/artistData",
                    name: "ARTIST_DATA",
                    meta: {title: ['系统设置', '艺人资料']},
                    component: ARTIST_DATA
                },
                // 团队介绍
                {
                    path: "/teamWang/teamData",
                    name: "TEAM_DATA",
                    meta: {title: ['系统设置', '团队介绍']},
                    component: TEAM_DATA
                },
                // 团队资料
                {
                    path: "/teamWang/teamInformation",
                    name: "TEAM_INFORMATION",
                    meta: {title: ['系统设置', '团队资料']},
                    component: TEAM_INFORMATION
                },
                // LOGO管理
                {
                    path: "/teamWang/logoManage",
                    name: "LOGO_MANAGE",
                    meta: {title: ['系统设置', '资源管理']},
                    component: LOGO_MANAGE
                },
                // 添加LOGO
                {
                    path: "/teamWang/logoManage/addLogo",
                    name: "ADD_LOGO",
                    meta: {title: ['系统设置', '资源管理', '添加LOGO']},
                    component: ADD_LOGO
                },
                // 官网菜单
                {
                    path: "/teamWang/menuManage",
                    name: "MENU_MANAGE",
                    meta: {title: ['系统设置', '官网菜单']},
                    component: MENU_MANAGE
                },
                // 添加菜单
                {
                    path: "/teamWang/logoManage/editMenu",
                    name: "EDIT_MENU",
                    meta: {title: ['系统设置', '官网菜单', '编辑菜单']},
                    component: EDIT_MENU
                },
                // 会员权益列表
                {
                    path: "/teamWang/vipRights",
                    name: "RIGHTS",
                    meta: {title: ['会员权益']},
                    component: RIGHTS
                },
                // 添加会员权益
                {
                    path: "/teamWang/vipRights/addRights",
                    name: "ADD_RIGHTS",
                    meta: {title: ['会员权益', '添加权益']},
                    component: ADD_RIGHTS
                },
                // 编辑会员权益
                {
                    path: "/teamWang/vipRights/editRights",
                    name: "EDIT_RIGHTS",
                    meta: {title: ['会员权益', '编辑权益']},
                    component: EDIT_RIGHTS
                },
                // 活动弹窗
                {
                    path: "/teamWang/dialog",
                    name: "DIALOG",
                    meta: {title: ['系统设置', '活动弹窗']},
                    component: DIALOG
                },
            ]
        },
    ]
})
