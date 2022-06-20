<template>
    <div class="login_Box">
        <div class="login_form">
            <div class="title">
                <img src="../assets/img/logo.png" alt="">
            </div>
            <el-form :model="loginForm">
                <el-form-item>
                    <el-input
                        @input="blurInputUser(loginForm,'userNameFlag', loginForm.username, 'userNameTip')"
                        v-model="loginForm.username"
                        placeholder="请输入账号"/>
                    <span class="isNotNull" v-if="loginForm.userNameFlag">{{loginForm.userNameTip}}</span>
                </el-form-item>
                <el-form-item>
                    <el-input
                        @input="blurInputUser(loginForm, 'passwordFlag', loginForm.password, 'passwordTip')"
                        v-model="loginForm.password"
                        type="password"
                        @keyup.enter.native="loginBtn($event)"
                        placeholder="请输入密码"/>
                    <span class="isNotNull" v-if="loginForm.passwordFlag">{{loginForm.passwordTip}}</span>
                </el-form-item>
                <el-form-item class="marginTop20">
                    <el-button class="widthAll" type="primary" @click="loginBtn">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                // 登录表单
                loginForm: {
                    username: '', // 用户名
                    password: '', // 密码
                    userNameFlag: false, // 用户名标识
                    userNameTip: '', // 用户名提示
                    passwordFlag: false, // 密码标识
                    passwordTip: '', // 密码提示
                    keepMind: false, // 记住账号和密码
                }
            }
        },
        methods: {
            // 输入校验账户名
            blurInputUser(item, flag, val, tip) {
                if (val.trim() === '') {
                    item[flag] = true;
                    item[tip] = flag === 'userNameFlag' ? '账户名不能为空' : '密码不能为空';
                } else {
                    item[flag] = false;
                    item[tip] = '';
                }
            },
            // 登录按钮
            loginBtn(event) {
                var _t = this;
                event.preventDefault();
                // 校验账户名
                _t.blurInputUser(_t.loginForm, 'userNameFlag', _t.loginForm.username, 'userNameTip');
                // 校验密码
                _t.blurInputUser(_t.loginForm, 'passwordFlag', _t.loginForm.password, 'passwordTip');
                if (_t.loginForm.userNameFlag === false && _t.loginForm.passwordFlag === false) {
                    _t.toLogin();
                }
            },
            // 点击登录接口
            toLogin() {
                var _t = this;
                _t.$api.post('user/login', {
                    username: _t.loginForm.username.trim(),
                    userpwd: _t.$md5('#$%TEAMWANG%$#' + _t.loginForm.password.trim() + '#$%JACKSONWANG%$#'),
                    role: 2
                }, function (res) {
                    switch (res.status) {
                        case 200: // 登录成功
                            _t.$router.push({name: 'DYNAMIC'});
                            // cookie缓存token
                            _t.setCookie('TEAM_WANG_TOKEN', res.token);
                            // 缓存用户id
                            _t.setCookie('TEAM_WANG_USER_ID', res.data.id);
                            // 缓存昵称
                            _t.setCookie('TEAM_WANG_NICK_NAME', res.data.userNickName);
                            // 缓存头像
                            _t.setCookie('TEAM_WANG_HEAD_IMG', res.data.headImg);
                            break;
                        case 1000: // 用户处于锁定状态
                            _t.$message.warning('账户处于锁定状态!');
                            break;
                        case 1002: // 用户名不存在
                            _t.loginForm.userNameTip = res.message;
                            _t.loginForm.userNameFlag = true;
                            break;
                        case 1008: // 密码错误
                            _t.loginForm.passwordTip = res.message;
                            _t.loginForm.passwordFlag = true;
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        created() {
            var _t = this;
            // 删除token
            _t.delCookie('TEAM_WANG_TOKEN');
            // 删除userId
            _t.delCookie('TEAM_WANG_USER_ID');
            // 删除缓存昵称
            _t.delCookie('TEAM_WANG_NICK_NAME');
            // 删除缓存的头像
            _t.delCookie('TEAM_WANG_HEAD_IMG');
            // 清除menu缓存
            _t.$store.commit('setMenu', []);
        }
    }
</script>

<style scoped>
    .login_Box {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        overflow: auto;
        background: url("../assets/img/login_bg.jpg") no-repeat center/cover;
    }

    .login_form {
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
        background-color: rgba(255, 255, 255, 0.4);
        transform: translate(-50%, -50%);
        border: 1px solid #dfdfdf;
        padding: 30px 40px;
    }

    .login_form .title {
        margin-top: 30px;
        height: 50px;
        line-height: 50px;
        margin-bottom: 30px;
        text-align: center;
    }

    .login_form .title img {
        height: 35px;
    }

    @media screen and (max-width: 600px) {
        .login_form {
            width: 80%;
        }
    }
</style>
<style>
    .login_Box .el-form-item {
        margin-bottom: 40px;
    }

    .login_Box .el-input__inner {
        background-color: transparent;
        color: #fff;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
        border-radius: 0;
        padding: 0;
    }

    .login_Box input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, 0.6) !important;
    }

    .login_Box input::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, 0.6) !important;
    }

    .login_Box input:-moz-placeholder { /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, 0.6) !important;
    }

    .login_Box input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, 0.6) !important;
    }
</style>
