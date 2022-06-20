<template>
    <Box>
        <el-form :model="addEdit">
            <p class="star formTitle">选择角色</p>
            <el-form-item>
                <el-select
                    clearable
                    @change="blurInput(addEdit,'roleFlag',addEdit.role,'roleTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.role">
                    <el-option v-for="(item,index) in roleList" :key="index" :label="item.roleName"
                               :value="item.id"/>
                </el-select>
                <div v-if="addEdit.roleFlag" class="isNotNullText">{{addEdit.roleTip}}</div>
            </el-form-item>
            <p class="star formTitle">账户名</p>
            <el-form-item>
                <el-input
                    @blur="blurInput(addEdit,'userNameFlag',addEdit.userName,'userNameTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.userName"/>
                <div v-if="addEdit.userNameFlag" class="isNotNullText">{{addEdit.userNameTip}}</div>
            </el-form-item>
            <p class="star formTitle">密码</p>
            <el-form-item>
                <el-input
                    type="password"
                    @blur="blurInput(addEdit,'pwdFlag',addEdit.pwd,'pwdTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.pwd"/>
                <div v-if="addEdit.pwdFlag" class="isNotNullText">{{addEdit.pwdTip}}</div>
            </el-form-item>
            <p class="star formTitle">昵称</p>
            <el-form-item>
                <el-input
                    @blur="blurInput(addEdit,'userNickNameFlag',addEdit.userNickName,'userNickNameTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.userNickName"/>
                <div v-if="addEdit.userNickNameFlag" class="isNotNullText">{{addEdit.userNickNameTip}}</div>
            </el-form-item>
            <p class="star formTitle">真实姓名</p>
            <el-form-item>
                <el-input
                    @blur="blurInput(addEdit,'realNameFlag',addEdit.realName,'realNameTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.realName"/>
                <div v-if="addEdit.realNameFlag" class="isNotNullText">{{addEdit.realNameTip}}</div>
            </el-form-item>
            <p class="star formTitle">性别</p>
            <el-form-item>
                <el-select
                    clearable
                    @change="blurInput(addEdit,'sexFlag',addEdit.userSex,'sexTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.userSex">
                    <el-option v-for="(item,index) in sexList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
                <div v-if="addEdit.sexFlag" class="isNotNullText">{{addEdit.sexTip}}</div>
            </el-form-item>
            <p class="star formTitle">手机号</p>
            <el-form-item>
                <el-input
                    @blur="blurInput(addEdit,'mobileFlag',addEdit.mobile,'mobileTip')"
                    maxlength="11"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-model="addEdit.mobile"/>
                <div v-if="addEdit.mobileFlag" class="isNotNullText">{{addEdit.mobileTip}}</div>
            </el-form-item>
            <p class="star formTitle">邮箱</p>
            <el-form-item>
                <el-input
                    @blur="blurInputEmail(addEdit,'emailFlag',addEdit.userEmail,'emailTip')"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="addEdit.userEmail"/>
                <div v-if="addEdit.emailFlag" class="isNotNullText">{{addEdit.emailTip}}</div>
            </el-form-item>
            <el-form-item>
                <el-button @click="goBack" type="default">返回</el-button>
                <el-button @click="addData" type="primary">保存</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "USER_EDIT",
        components: {Box},
        data() {
            return {
                isWeb: false,// 是否pc端
                // 编辑表单
                addEdit: {
                    role: '', // 角色
                    userName: '', // 账户名
                    pwd: '', // 密码
                    userNickName: '', // 昵称
                    realName: '', // 真实姓名
                    userSex: '1', // 性别
                    mobile: '', // 手机号
                    userEmail: '', // 邮箱
                    roleFlag: false, // 角色标识
                    roleTip: '', // 角色提示
                    userNameFlag: false, // 账户名标识
                    userNameTip: '', // 账户名提示
                    pwdFlag: false, // 密码标识
                    pwdTip: '', // 密码提示
                    userNickNameFlag: false, // 昵称标识
                    userNickNameTip: '', // 昵称提示
                    realNameFlag: false, // 真实姓名标识
                    realNameTip: '', // 真实姓名提示
                    sexFlag: false, // 性别标识
                    sexTip: '', // 性别提示
                    mobileFlag: false, // 手机号标识
                    mobileTip: '', // 手机号提示
                    emailFlag: false, // 邮箱标识
                    emailTip: '', // 邮箱提示
                },
                // 校验标识
                sexList: [
                    {label: '男', value: '1'},
                    {label: '女', value: '0'},
                ],
                // 角色列表
                roleList: [],
            }
        },
        methods: {
            // 获取详细信息
            getData() {
                let _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.get('role/getRolesNoLimit', {}, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            let resData = res.data !== undefined && res.data !== null ? res.data : [];
                            _t.roleList = resData;
                            break;
                        default: // 查询失败
                            break;
                    }
                });
            },
            // 返回
            goBack() {
                let _t = this;
                _t.$router.push({name: 'USER'});
            },
            // 校验为空函数
            blurInput(item, flag, val, tip) {
                item[flag] = val.trim() === '' ? true : false;
                item[tip] = item[flag] ? '必填项不能为空' : '';
            },
            // 校验邮箱
            blurInputEmail(item, flag, val, tip) {
                let _t = this;
                // 为空取消校验
                if (val.trim() === '') {
                    item[flag] = true;
                    item[tip] = '必填项不能为空';
                } else {
                    // 校验格式
                    let reg = _t.$api.ruleEmail();
                    if (reg.test(val.trim()) === true) {
                        item[flag] = false;
                        item[tip] = '';
                    } else {
                        item[flag] = true;
                        item[tip] = '邮箱格式不符!';
                    }
                }
            },
            // 添加管理员
            addData() {
                let _t = this;
                // 校验角色
                _t.blurInput(_t.addEdit, 'roleFlag', _t.addEdit.role, 'roleTip');
                // 校验账户名
                _t.blurInput(_t.addEdit, 'userNameFlag', _t.addEdit.userName, 'userNameTip');
                // 校验密码
                _t.blurInput(_t.addEdit, 'pwdFlag', _t.addEdit.pwd, 'pwdTip');
                // 校验昵称
                _t.blurInput(_t.addEdit, 'userNickNameFlag', _t.addEdit.userNickName, 'userNickNameTip');
                // 校验真实姓名
                _t.blurInput(_t.addEdit, 'realNameFlag', _t.addEdit.realName, 'realNameTip');
                // 校验性别
                _t.blurInput(_t.addEdit, 'sexFlag', _t.addEdit.userSex, 'sexTip');
                // 校验手机号
                _t.blurInput(_t.addEdit, 'mobileFlag', _t.addEdit.mobile, 'mobileTip');
                // 校验邮箱
                _t.blurInputEmail(_t.addEdit, 'emailFlag', _t.addEdit.userEmail, 'emailTip');
                // 可以提交
                if (_t.addEdit.roleFlag === false
                    && _t.addEdit.userNameFlag === false
                    && _t.addEdit.pwdFlag === false
                    && _t.addEdit.userNickNameFlag === false
                    && _t.addEdit.realNameFlag === false
                    && _t.addEdit.sexFlag === false
                    && _t.addEdit.mobileFlag === false
                    && _t.addEdit.emailFlag === false) {
                    _t.$api.post('user/saveAdmin', {
                        userName: _t.addEdit.userName.trim(), // 账户名
                        pwd: _t.$md5('#$%TEAMWANG%$#' + _t.addEdit.pwd.trim() + '#$%JACKSONWANG%$#'), // 密码
                        userNickName: _t.addEdit.userNickName.trim(), // 昵称
                        realName: _t.addEdit.realName.trim(), // 真实姓名
                        userSex: _t.addEdit.userSex.trim(), // 性别
                        userPhoneNumber: _t.addEdit.mobile.trim(), // 手机号
                        userEmail: _t.addEdit.userEmail.trim(), // 邮箱
                        roleId: _t.addEdit.role.trim(), // 角色
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 添加成功
                                _t.$message.success('保存成功!');
                                _t.goBack();
                                break;
                            case 2018: // 字段重复
                                if (res.data !== '' && typeof res.data === 'string') {
                                    let resData = res.data.split(',');
                                    resData.forEach((item) => {
                                        if (item === 'userName') {
                                            _t.addEdit.userNameFlag = true;
                                            _t.addEdit.userNameTip = '账户名重复';
                                        } else if (item === 'userNickName') {
                                            _t.addEdit.userNickNameFlag = true;
                                            _t.addEdit.userNickNameTip = '昵称重复';
                                        } else if (item === 'userEmail') {
                                            _t.addEdit.emailFlag = true;
                                            _t.addEdit.emailTip = '邮箱重复';
                                        } else if (item === 'userPhoneNumber') {
                                            _t.addEdit.mobileFlag = true;
                                            _t.addEdit.mobileTip = '手机号重复';
                                        }
                                    });
                                }
                                break;
                            default: // 添加失败
                                _t.$message.error('保存失败!');
                                break;
                        }
                    });
                }
            }
        },
        created() {
            let _t = this;
            _t.$store.commit('setLoading', true);
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
