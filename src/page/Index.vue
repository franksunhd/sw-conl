<template>
    <div class="boxAll">
        <!--pc端-->
        <div class="boxAll" v-if="isWeb">
            <!--pc端头部-->
            <div class="headerBoxWeb clearFix">
                <div class="fl logoWeb">TEAM WANG</div>
                <div class="fl">
                    <span v-if="isShowAllWeb" class="handInOrOut" @click="handIn">
                        <i title="收起" class="pointer el-icon-s-fold"></i>
                    </span>
                    <span v-else class="handInOrOut" @click="handOut">
                        <i title="展开" class="pointer el-icon-s-unfold"></i>
                    </span>
                </div>
                <el-dropdown class="fr headerDropWeb" @command="clickMenu" trigger="click">
                    <span class="el-dropdown-link">
                        <span class="userName">
                            <img :src="formItem.headImg" alt="">
                        </span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                        <el-dropdown-item command="out">注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="contentBoxWeb">
                <!--pc端导航-->
                <div id="appSideWeb" :class="isShowAllWeb ? 'appSideWeb': 'appSide'">
                    <el-menu class="menuBar" :default-active="current" :router="true" :unique-opened="true">
                        <template v-for="(item,index) in menuList">
                            <el-menu-item v-if="item.children.length === 0" :index="item.menuHref">
                                <i :class="item.menuIcon + ' iconfont'"></i>
                                <span>{{item.menuName}}</span>
                                <span class="iconfont warningColor"
                                      v-if="item.menuTarget !== undefined && item.menuTarget !== null && item.menuTarget === 'vip'">&#xe609;</span>
                            </el-menu-item>
                            <el-submenu v-else-if="item.children.length !== 0" :index="item.menuHref">
                                <template slot="title">
                                    <i :class="item.menuIcon + ' iconfont'"></i>
                                    {{item.menuName}}
                                </template>
                                <el-menu-item v-for="(val,i) in item.children" :key="i" :index="val.menuHref">
                                    <i :class="val.menuIcon + ' iconfont'"></i>
                                    <span>{{val.menuName}}</span>
                                    <span class="iconfont warningColor"
                                          v-if="val.menuTarget !== undefined && val.menuTarget !== null && val.menuTarget === 'vip'">&#xe609;</span>
                                </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu>
                </div>
                <!--pc端内容-->
                <div id="appContentWeb" class="contentText">
                    <el-breadcrumb class="breadcrumbBox clearFix" separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>您现在的位置:</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                            <span>{{item}}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view/>
                </div>
            </div>
        </div>
        <!--移动端-->
        <div class="boxAll" v-else>
            <!--移动端头部-->
            <div class="headerBox" :style="formItem.userId === this.$api.id() ? 'height:60px;':''">
                <div class="logo tc" v-if="formItem.userId !== this.$api.id()">TEAM WANG</div>
                <div class="clearFix headerBoxMobile">
                    <div class="fl" v-if="formItem.userId !== this.$api.id()">
                        <span v-if="isShowAll" class="handInOrOut" @click="handIn">
                            <i title="收起" class="pointer el-icon-s-fold"></i>
                        </span>
                        <span v-else class="handInOrOut" @click="handOut">
                            <i title="展开" class="pointer el-icon-s-unfold"></i>
                        </span>
                    </div>
                    <el-dropdown class="fr headerDrop marRight20" @command="clickMenu" trigger="click">
                        <span class="el-dropdown-link">
                            <span class="userName">
                                <img :src="formItem.headImg" alt="">
                            </span>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="formItem.userId !== this.$api.id()" command="pwd">修改密码
                            </el-dropdown-item>
                            <el-dropdown-item command="out">注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="contentBox" :style="formItem.userId === this.$api.id() ? 'top:60px;':''">
                <!--移动端导航-->
                <div id="appSide" :class="isShowAll ? 'appSideWeb': 'appSide'">
                    <el-menu class="menuBar" :default-active="current" :router="true" :unique-opened="true">
                        <template v-for="(item,index) in menuList">
                            <el-menu-item v-if="item.children.length === 0" :index="item.menuHref">
                                <i :class="item.menuIcon + ' iconfont'"></i>
                                <span>{{item.menuName}}</span>
                                <span class="iconfont warningColor"
                                      v-if="item.menuTarget !== undefined && item.menuTarget !== null && item.menuTarget === 'vip'">&#xe609;</span>
                            </el-menu-item>
                            <el-submenu v-else-if="item.children.length !== 0" :index="item.menuHref">
                                <template slot="title">
                                    <i :class="item.menuIcon + ' iconfont'"></i>
                                    {{item.menuName}}
                                </template>
                                <el-menu-item v-for="(val,i) in item.children" :key="i" :index="val.menuHref">
                                    <i :class="val.menuIcon + ' iconfont'"></i>
                                    <span>{{val.menuName}}</span>
                                    <span class="iconfont warningColor"
                                          v-if="val.menuTarget !== undefined && val.menuTarget !== null && val.menuTarget === 'vip'">&#xe609;</span>
                                </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu>
                </div>
                <!--移动端内容-->
                <div id="appContent" class="contentText">
                    <el-breadcrumb v-if="formItem.userId !== this.$api.id()" class="breadcrumbBox clearFix"
                                   separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>您现在的位置:</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                            <span>{{item}}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view/>
                </div>
            </div>
            <!--王嘉尔固定账号导航-->
            <div v-if="formItem.userId === this.$api.id()" class="flex_menu_box">
                <el-menu
                    class="flex_menu"
                    mode="horizontal"
                    :default-active="current"
                    :router="true"
                    :unique-opened="true">
                    <template v-for="(item,index) in fixedMenu">
                        <el-menu-item :index="item.menuHref">
                            <i :class="item.menuIcon + ' iconfont'"></i>
                            <span>
                                <span>{{item.menuName}}</span>
                            </span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Index",
        data() {
            return {
                // 记录展开收起状态
                isShowAll: false, // 移动端
                isShowAllWeb: true, // pc端
                // 记录pc端还是移动端 true:pc false:移动
                isWeb: true,
                // 导航菜单
                menuList: [],
                // 王嘉尔固定菜单
                fixedMenu: [],
                // 面包屑集合
                breadcrumbList: [],
                // 个人信息
                formItem: {
                    headImg: '', // 头像
                    userId: this.getCookie('TEAM_WANG_USER_ID')
                }
            }
        },
        methods: {
            // 点击顶部导航的下拉框按钮
            clickMenu(val) {
                var _t = this;
                if (val === 'pwd') {
                    // 点击修改密码
                    _t.$router.push({name: 'PASSWORD'});
                } else if (val === 'out') {
                    // 点击退出登录
                    if (_t.formItem.userId !== null || _t.formItem.userId !== 'null') {
                        _t.$api.post('user/logout', {
                            userId: _t.formItem.userId, // 用户id
                        }, function (res) {
                            switch (res.status) {
                                case 200:
                                    _t.$router.push({name: 'LOGIN'});
                                    break;
                                default:
                                    break;
                            }
                        });
                    } else {
                        _t.$router.push({name: 'LOGIN'});
                    }
                }
            },
            // 展开
            handOut() {
                var _t = this;
                if (_t.isWeb) {
                    _t.isShowAllWeb = true;
                    document.getElementById('appSideWeb').style.width = '223px';
                    document.getElementById('appContentWeb').style.left = '223px';
                } else {
                    _t.isShowAll = true;
                    document.getElementById('appSide').style.width = '223px';
                    document.getElementById('appContent').style.left = '223px';
                }
            },
            // 收起
            handIn() {
                var _t = this;
                if (_t.isWeb) {
                    _t.isShowAllWeb = false;
                    document.getElementById('appSideWeb').style.width = 0;
                    document.getElementById('appContentWeb').style.left = 0;
                } else {
                    _t.isShowAll = false;
                    document.getElementById('appSide').style.width = 0;
                    document.getElementById('appContent').style.left = 0;
                }
            },
            // 调取王嘉尔个人信息
            getUserInfo() {
                var _t = this;
                if (_t.formItem.userId !== undefined && _t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: _t.formItem.userId, // 用户id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 获取成功
                                if (res.data !== undefined && res.data !== null) {
                                    // 判断头像是否为空
                                    if (res.data.headImg !== undefined && res.data.headImg !== null) {
                                        _t.formItem.headImg = res.data.headImg.indexOf('http') !== -1 ? res.data.headImg : _t.$api.imgUrl() + res.data.headImg;
                                    } else {
                                        _t.formItem.headImg = require('../assets/img/head.png');
                                    }
                                } else {
                                    _t.formItem.headImg = require('../assets/img/head.png');
                                }
                                break;
                            default: // 获取失败
                                _t.formItem.headImg = require('../assets/img/head.png');
                                break;
                        }
                    });
                }
            },
            // 获取菜单数据
            getMenuData() {
                let _t = this;
                _t.$api.get('role/getUserMenuByUserId/' + _t.formItem.userId, {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            let resData = res.data !== undefined && res.data !== null ? res.data : [];
                            // 将页面的导航处理成一级的
                            let newArr = new Array();
                            resData.forEach((item) => {
                                if (item.children.length !== 0) {
                                    item.children.forEach((val) => {
                                        newArr.push(val);
                                    });
                                } else {
                                    newArr.push(item);
                                }
                            });
                            _t.menuList = resData.sort(_t.sortObjectValue('orderMark', true));
                            if (_t.formItem.userId === _t.$api.id()) {
                                _t.fixedMenu = newArr;
                            }
                            break;
                        default: // 查询失败
                            _t.$message.error('查询失败!');
                            break;
                    }
                });
            },
            // 对某个字段进行 排序操作 prop:需要排序的字段 rev true:为升序,false为降序
            sortObjectValue(prop, rev) {
                // 第二个参数没有传递，默认升序排序
                if (rev === undefined) {
                    rev = 1;
                } else {
                    rev = rev ? 1 : -1;
                }
                return function (obj1, obj2) {
                    var val1 = obj1[prop],
                        val2 = obj2[prop];
                    return val1 < val2 ? rev * (-1) : rev * 1;
                }
            }
        },
        created() {
            let _t = this;
            // 获取用户信息
            _t.getUserInfo();
            // 获取左侧导航菜单
            _t.getMenuData();
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            if (equipment_type === 'web') {
                // pc端
                _t.isWeb = true;
                _t.isShowAllWeb = true;
                _t.isShowAll = true;
            } else {
                _t.isWeb = false;
                _t.isShowAllWeb = false;
                _t.isShowAll = false;
                _t.$nextTick(function () {
                    document.getElementById('appSide').style.width = 0;
                    document.getElementById('appContent').style.left = 0;
                });
            }
            if (_t.$route.meta !== undefined && _t.$route.meta.title !== undefined) {
                var title = _t.$route.meta.title;
                if (title.length !== 0) {
                    _t.breadcrumbList = title;
                }
            }
        },
        computed: {
            // 监听 url 详情页面的导航
            current() {
                var arr = this.$route.path.split('/');
                if (arr.length > 3) {
                    arr.pop();
                    return arr.join("/");
                } else {
                    return this.$route.path;
                }
            }
        },
        watch: {
            $route(to) {
                var _t = this;
                if (to.meta !== undefined && to.meta.title !== undefined) {
                    var title = to.meta.title;
                    if (title.length !== 0) {
                        _t.breadcrumbList = title;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .boxAll {
        width: 100%;
        height: 100%;
    }

    /*PC端*/
    .headerBoxWeb {
        background-color: #3777EC;
        padding: 0;
        height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1500;
    }

    .headerBoxWeb .logoWeb {
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-size: 30px;
        background-color: #3777EC;
        padding: 0 20px;
    }

    .contentBoxWeb {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 90;
        overflow: auto;
        display: flex;
        flex-direction: row;
    }

    .appSideWeb {
        width: 223px !important;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-right: 1px solid #e6e6e6;
    }

    .appSide {
        width: 0;
        display: none;
    }

    .headerDropWeb {
        margin-right: 20px;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        color: #fff;
    }


    .headerDropWeb .userName {
        width: 36px;
        height: 36px;
        color: #3777EC;
        font-size: 0;
        font-weight: bold;
        background-color: #fff;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
    }

    .headerDropWeb .userName img {
        width: 100%;
        height: 100%;
        vertical-align: baseline;
    }

    /*移动端*/
    .headerBox {
        background-color: #3777EC;
        padding: 0;
        height: 120px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1500;
    }

    .headerBox .logo {
        height: 60px;
        line-height: 60px;
        color: #fff;
        font-size: 30px;
        background-color: #3777EC;
    }

    .contentBox {
        position: fixed;
        top: 120px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        display: flex;
        flex-direction: row;
    }

    .headerBoxMobile {
        background-color: #3777EC;
        padding: 0;
        height: 60px;
        line-height: 60px;
    }

    .headerDrop .userName {
        width: 36px;
        height: 36px;
        color: #3777EC;
        font-size: 0;
        font-weight: bold;
        background-color: #fff;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
    }

    .headerDrop .userName img {
        width: 100%;
        height: 100%;
        vertical-align: baseline;
    }

    .handInOrOut {
        margin-left: 20px;
    }

    .handInOrOut i {
        display: inline-block;
        height: 60px;
        line-height: 60px;
        font-size: 24px;
        color: #fff;
    }

    .menuBar {
        width: 223px;
    }

    .contentText {
        position: absolute;
        top: 0;
        left: 223px;
        right: 0;
        bottom: 0;
        overflow: auto;
    }

    .breadcrumbBox {
        width: 100%;
        white-space: nowrap;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        border-bottom: 1px solid #e6e6e6;
    }

    /*  王嘉尔固定账号导航  */
    .flex_menu_box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 4000;
    }
</style>
<style>
    .breadcrumbBox .el-breadcrumb__item {
        white-space: nowrap;
        float: none;
    }

    .headerDrop i {
        color: #fff;
    }

    .menuBar .el-menu-item {
        border-left: 5px solid #fff;
    }

    .menuBar .el-menu-item.is-active {
        background-color: #E8EFFF;
        border-left: 5px solid #3777EC;
    }

    .headerDropWeb .el-dropdown-link {
        height: 60px;
        line-height: 60px;
        display: inline-block;
    }

    .flex_menu {
        display: flex;
        flex-direction: row;
    }

    .flex_menu .el-menu-item {
        flex: 1;
        text-align: center;
        border-top: 1px solid #e6e6e6;
        line-height: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
    }

    .flex_menu .el-menu-item i {
        margin-bottom: 3px;
        font-size: 18px;
    }

    .flex_menu.el-menu--horizontal > .el-menu-item.is-active {
        border-bottom: none;
        color: #3777EC;
        font-weight: bold;
    }

    .menuBar .el-submenu__title {
        border-left: 5px solid #fff;
    }

    .menuBar .el-menu-item i {
        width: 16px;
        height: 16px;
    }
</style>
