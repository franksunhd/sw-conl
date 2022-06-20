<template>
    <Box>
        <el-form :model="formItem">
            <p class="star formTitle">原始密码</p>
            <el-form-item>
                <el-input
                    type="password"
                    name="password"
                    auto-complete="new-password"
                    v-model="formItem.oldPwd"
                    @blur="blurInputOldPassword(formItem,'oldPwdFlag',formItem.oldPwd,'oldPwdTip')"
                    placeholder="请输入原始密码"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"/>
                <div class="isNotNull" v-if="formItem.oldPwdFlag">{{formItem.oldPwdTip}}</div>
            </el-form-item>
            <p class="star formTitle">新密码</p>
            <el-form-item>
                <el-input
                    type="password"
                    name="password"
                    auto-complete="new-password"
                    placeholder="请输入新密码"
                    v-model="formItem.newPwd"
                    @blur="blurInputPassword(formItem,'newPwdFlag',formItem.newPwd,formItem.confirmPwd)"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"/>
                <div class="isNotNull" v-if="formItem.newPwdFlag">{{formItem.newPwdTip}}</div>
            </el-form-item>
            <p class="star formTitle">确认新密码</p>
            <el-form-item>
                <el-input
                    type="password"
                    name="password"
                    auto-complete="new-password"
                    placeholder="请输入新密码"
                    v-model="formItem.confirmPwd"
                    @blur="blurInputPassword(formItem,'confirmPwdFlag',formItem.confirmPwd,formItem.confirmPwd)"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"/>
                <div class="isNotNull" v-if="formItem.confirmPwdFlag">{{formItem.confirmPwdTip}}</div>
            </el-form-item>
            <el-form-item>
                <el-button @click="addSaveData" type="primary">保存</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "PASSWORD",
        components: {Box},
        data() {
            return {
                isWeb: false, // 是否web端
                // 表单
                formItem: {
                    oldPwd: '', // 原始密码
                    newPwd: '', // 新密码
                    confirmPwd: '', // 确认新密码
                    oldPwdFlag: false, // 原始密码标识
                    oldPwdTip: '', // 原始密码提示
                    newPwdFlag: false, // 新密码标识
                    newPwdTip: '', // 新密码提示
                    confirmPwdFlag: false, // 确认新密码标识
                    confirmPwdTip: '', // 确认新密码提示
                    userId: this.getCookie("TEAM_WANG_USER_ID")
                }
            }
        },
        methods: {
            // 校验原始密码
            blurInputOldPassword(item, flag, val, tip) {
                item[flag] = val.trim() === '' ? true : false;
                item[tip] = item[flag] ? '必填项不能为空' : '';
            },
            // 失去焦点校验密码
            blurInputPassword(item, flag, pwd, conPwd) {
                let _t = this;
                if (flag === "newPwdFlag") {
                    // 密码输入框
                    if (pwd.trim() === "") {
                        item[flag] = true;
                        item["newPwdTip"] = '必填项不能为空';
                    } else {
                        item[flag] = false;
                        item["newPwdTip"] = "";
                    }
                } else {
                    // 确认密码输入框
                    if (conPwd.trim() === "") {
                        item[flag] = true;
                        item["confirmPwdTip"] = '必填项不能为空';
                    } else {
                        // 校验是否一致
                        if (conPwd.trim() !== pwd.trim()) {
                            item[flag] = true;
                            item["confirmPwdTip"] = '两次密码不一致';
                        } else {
                            item[flag] = false;
                            item["confirmPwdTip"] = "";
                        }
                    }
                }
            },
            // 保存密码接口
            addSaveData() {
                let _t = this;
                // 校验原始密码
                _t.blurInputOldPassword(_t.formItem, 'oldPwdFlag', _t.formItem.oldPwd, 'oldPwdTip');
                // 校验新密码
                _t.blurInputPassword(_t.formItem, "newPwdFlag", _t.formItem.newPwd, _t.formItem.confirmPwd);
                // 校验确认密码
                _t.blurInputPassword(_t.formItem, "confirmPwdFlag", _t.formItem.newPwd, _t.formItem.confirmPwd);
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    if (_t.formItem.oldPwdFlag === false
                        && _t.formItem.newPwdFlag === false
                        && _t.formItem.confirmPwdFlag === false) {
                        _t.$api.post("user/updateUserPwd", {
                            id: _t.formItem.userId, // 用户id
                            userPwd: _t.$md5('#$%TEAMWANG%$#' + _t.formItem.oldPwd.trim() + '#$%JACKSONWANG%$#'), //原始密码
                            newPwd: _t.$md5('#$%TEAMWANG%$#' + _t.formItem.newPwd.trim() + '#$%JACKSONWANG%$#') // 密码
                        }, function (res) {
                            switch (res.status) {
                                case 200: // 修改成功
                                    _t.resetData();
                                    _t.$confirm('修改成功,请重新登录!', '温馨提示', {
                                        confirmButtonText: '确认',
                                        cancelButtonText: '取消',
                                        type: "warning"
                                    }).then(() => {
                                        _t.$router.push({name: 'LOGIN'});
                                    }).catch(() => {
                                        _t.$router.push({name: 'LOGIN'});
                                    });
                                    break;
                                case 1008: // 原始密码错误
                                    _t.formItem.oldPwdFlag = true;
                                    _t.formItem.oldPwdTip = '密码错误,请重新输入!';
                                    break;
                                default:
                                    _t.$message.error(res.message);
                                    break;
                            }
                        });
                    }
                } else {
                    _t.$message.error('用户ID不存在,请重新登录!');
                }
            },
            // 重置表单
            resetData() {
                let _t = this;
                _t.formItem.oldPwd = ''; // 原始密码
                _t.formItem.newPwd = ''; // 新密码
                _t.formItem.confirmPwd = ''; // 确认新密码
                _t.formItem.oldPwdFlag = false; // 原始密码标识
                _t.formItem.oldPwdTip = ''; // 原始密码提示
                _t.formItem.newPwdFlag = false; // 新密码标识
                _t.formItem.newPwdTip = ''; // 新密码提示
                _t.formItem.confirmPwdFlag = false; // 确认新密码标识
                _t.formItem.confirmPwdTip = ''; // 确认新密码提示
            }
        },
        created() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
        }
    }
</script>

<style scoped>

</style>
