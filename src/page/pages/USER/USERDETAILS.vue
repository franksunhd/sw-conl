<template>
    <Box>
        <div class="pageHeader">
            <i @click="goBack" class="el-icon-back"></i>
            <span>用户信息详情</span>
        </div>
        <p class="title">基础信息</p>
        <el-form :model="formItem">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="用户ID：">{{formItem.userId}}</el-form-item>
                    <el-form-item label="用户名：">{{formItem.userName}}</el-form-item>
                    <el-form-item label="昵称：">{{formItem.userNickName}}</el-form-item>
                    <el-form-item label="头像：">
                        <div v-if="formItem.headImg !== ''">
                            <img class="default_head" :src="formItem.headImg" alt="头像">
                        </div>
                        <div v-else>
                            <img class="default_head" src="../../../assets/img/default.png" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item label="生日：">{{formItem.userBirthday}}</el-form-item>
                    <el-form-item label="地区：">{{formItem.area}}</el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="性别：">
                        <span>{{formItem.userSex}}</span>
                    </el-form-item>
                    <el-form-item label="注册方式：">
                        <span>{{formItem.registerWay}}</span>
                    </el-form-item>
                    <el-form-item label="注册时间：">{{formItem.registerTime}}</el-form-item>
                    <el-form-item label="用户身份：">
                        <span v-if="formItem.role.toString() === '0'">普通</span>
                        <span class="warningColor" v-if="formItem.role.toString() === '1'">VIP</span>
                        <span class="warningColor" v-if="formItem.role.toString() === '2'">管理员</span>
                        <span class="warningColor" v-if="formItem.roleName !== ''">【{{formItem.roleName}}】</span>
                    </el-form-item>
                    <el-form-item label="用户状态：">
                        <span v-if="formItem.status.toString() === '0'" class="redColor">锁定</span>
                        <span v-if="formItem.status.toString() === '1'">正常</span>
                        <span class="blueColor" v-if="formItem.status.toString() === '2'">新注册</span>
                    </el-form-item>
                    <el-form-item label="最近登录：">{{formItem.recentTime}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p class="title">账号绑定信息</p>
        <el-form :model="formItem">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="绑定手机号：">{{formItem.userPhoneNumber}}</el-form-item>
                    <!--                    <el-form-item label="绑定微博："></el-form-item>-->
                    <!--                    <el-form-item label="绑定微信："></el-form-item>-->
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="绑定邮箱：">{{formItem.userEmail}}</el-form-item>
                    <!--                    <el-form-item label="绑定QQ："></el-form-item>-->
                    <!--                    <el-form-item label="绑定Twitter："></el-form-item>-->
                    <!--                    <el-form-item label="绑定Instagram："></el-form-item>-->
                    <!--                    <el-form-item label="绑定Facebook："></el-form-item>-->
                </el-col>
            </el-row>
        </el-form>
        <div class="tc">
            <el-button v-if="formItem.role.toString() === '0' && formItem.status.toString() === '1'"
                       size="small" type="primary"
                       @click="addToVip"
                       class="marRight10">开通VIP
            </el-button>
            <el-button
                v-if="formItem.status.toString() !== '2' && adminId.indexOf(userId) !== -1 && adminId.indexOf(formItem.userId) === -1"
                @click="getRoleList"
                size="small" type="warning">角色授权
            </el-button>
        </div>
        <!--角色授权蒙版-->
        <el-dialog
            :before-close="resetDialog"
            :visible.sync="dialogVisible"
            append-to-body
            :width="isWeb === false ? '95%' : '30%'"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="角色授权">
            <el-form :model="addEdit">
                <p class="star formTitle">选择角色</p>
                <el-form-item>
                    <el-select
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        @change="blurInput(addEdit,'roleFlag',addEdit.roleId)"
                        v-model="addEdit.roleId"
                        clearable>
                        <el-option v-for="(item,index) in roleList" :key="index" :label="item.roleName"
                                   :value="item.id"/>
                    </el-select>
                    <div v-if="addEdit.roleFlag" class="isNotNullText">必填项不能为空</div>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetDialog" class="marRight10" type="default">取消</el-button>
                <el-button @click="saveRole" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";
    import {dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "USERDETAILS",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    userId: '', // 用户ID
                    userName: '', // 用户名
                    userNickName: '', // 昵称
                    headImg: '', // 头像
                    userBirthday: '', // 生日
                    area: '', // 地区
                    registerWay: '', // 注册方式
                    registerTime: '', // 注册时间
                    role: '', // 用户身份
                    status: '', // 用户状态
                    recentTime: '', // 最近登录时间
                    userPhoneNumber: '', // 手机号
                    userSex: '', // 性别
                    userEmail: '', // 邮箱
                    roleName: '', // 角色名称
                },
                dialogVisible: false, // 蒙版
                roleList: [], // 角色集合
                // 角色授权表单
                addEdit: {
                    roleId: '', // 角色id
                    roleFlag: false, // 选择角色标识
                },
                adminId: this.$api.adminId(), // admin ID
                userId: this.getCookie('TEAM_WANG_USER_ID')
            }
        },
        methods: {
            // 校验函数
            blurInput(item, flag, val) {
                item[flag] = val.trim() === '' ? true : false;
            },
            // 返回
            goBack() {
                var _t = this;
                _t.$router.push({name: 'USER'});
            },
            // 获取详情数据
            getData() {
                var _t = this;
                _t.$api.post('user/getById', {
                        id: _t.formItem.userId
                    }, function (res) {
                        _t.$store.commit('setLoading', false);
                        switch (res.status) {
                            case 200:
                                // _t.formItem.userId = res.data.id !== undefined ? res.data.id : ''; // 用户ID
                                _t.formItem.userName = res.data.userName !== undefined ? res.data.userName : ''; // 用户名
                                _t.formItem.userNickName = res.data.userNickName !== undefined ? res.data.userNickName : ''; // 昵称
                                _t.formItem.userBirthday = res.data.userBirthday !== undefined && res.data.userBirthday !== null ? dateFilterDayCN(res.data.userBirthday) : ''; // 生日
                                if (res.data.areaType !== undefined && res.data.areaType === 0) {
                                    // 国内
                                    var province = res.data.province !== undefined ? res.data.province : '';
                                    var city = res.data.city !== undefined ? res.data.city : '';
                                    var detailAddress = res.data.detailAddress !== undefined ? res.data.detailAddress : '';
                                    _t.formItem.area = province + city + detailAddress; // 地区
                                } else if (res.data.areaType !== undefined && res.data.areaType === 1) {
                                    // 国外
                                    var address = res.data.detailAddress !== undefined ? res.data.detailAddress : '';
                                    _t.formItem.area = address; // 地区
                                } else {
                                    _t.formItem.area = '';
                                }
                                var registerWayText = '';
                                var registerWay = res.data.registWay !== undefined ? res.data.registWay : '';
                                if (registerWay === '0') {
                                    registerWayText = '账号';
                                } else if (registerWay === '1') {
                                    registerWayText = '手机';
                                } else if (registerWay === '2') {
                                    registerWayText = '邮箱';
                                } else if (registerWay === '3') {
                                    registerWayText = '微博';
                                } else if (registerWay === '4') {
                                    registerWayText = '微信';
                                } else if (registerWay === '5') {
                                    registerWayText = 'QQ';
                                } else if (registerWay === '6') {
                                    registerWayText = 'TWITTER';
                                } else if (registerWay === '7') {
                                    registerWayText = 'Facebook';
                                } else if (registerWay === '8') {
                                    registerWayText = 'Instagram';
                                }
                                _t.formItem.registerWay = registerWayText; // 注册方式
                                _t.formItem.registerTime = res.data.registTime !== undefined && res.data.registTime !== null ? dateFilter(res.data.registTime) : ''; // 注册时间
                                _t.formItem.role = res.data.role !== undefined ? res.data.role : '0'; // 用户身份
                                _t.formItem.status = res.data.status !== undefined ? res.data.status : ''; // 用户状态
                                _t.formItem.recentTime = res.data.recentTime !== undefined && res.data.recentTime !== null ? dateFilter(res.data.recentTime) : ''; // 最近登录时间
                                _t.formItem.userPhoneNumber = res.data.userPhoneNumber !== undefined ? res.data.userPhoneNumber : ''; // 手机号
                                _t.formItem.userEmail = res.data.userEmail !== undefined ? res.data.userEmail : ''; // 邮箱
                                _t.formItem.userSex = res.data.userSex !== undefined ? (res.data.userSex === 1 ? '男' : (res.data.userSex === 0 ? '女' : '')) : '';
                                // 头像
                                if (res.data.headImg !== undefined) {
                                    _t.formItem.headImg = res.data.headImg.indexOf('http') !== -1 ? res.data.headImg : _t.$api.imgUrl() + res.data.headImg;
                                }
                                // 角色名称
                                if (_t.formItem.role.toString() === '2') {
                                    _t.formItem.roleName = res.data.roleName !== undefined && res.data.roleName !== null ? res.data.roleName : '';
                                    if (_t.$api.adminId().indexOf(_t.formItem.userId) !== -1) {
                                        _t.formItem.roleName = '超级管理员';
                                    }
                                }
                                break;
                            case 2007: // 查询出错
                                _t.$message.error(res.message);
                                break;
                            default:
                                break;
                        }
                    }
                )
                ;
            },
            // 重置表单
            resetData() {
                var _t = this;
                _t.formItem.userId = ''; // 用户ID
                _t.formItem.userName = ''; // 用户名
                _t.formItem.userNickName = ''; // 昵称
                _t.formItem.headImg = ''; // 头像
                _t.formItem.userBirthday = ''; // 生日
                _t.formItem.area = ''; // 地区
                _t.formItem.registWay = ''; // 注册方式
                _t.formItem.registTime = ''; // 注册时间
                _t.formItem.role = ''; // 用户身份
                _t.formItem.status = ''; // 用户状态
                _t.formItem.recentTime = ''; // 最近登录时间
                _t.formItem.userPhoneNumber = ''; // 手机号
                localStorage.removeItem('USER_DETAIL_ID');
            }
            ,
            // 官方开通vip
            addToVip() {
                let _t = this;
                _t.$confirm('您确认要开通此用户的VIP身份吗?', '温馨提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.put('user/updateUserRole', {
                        id: _t.formItem.userId
                    }, function (res) {
                        switch (res.status) {
                            case 200:
                                // 操作成功
                                _t.$alert('开通成功', '温馨提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    _t.goBack();
                                }).catch(() => {
                                    _t.goBack();
                                });
                                break;
                            default:
                                break;
                        }
                    });
                }).catch(() => {
                    return false;
                });
            }
            ,
            // 点击角色授权
            getRoleList() {
                let _t = this;
                _t.dialogVisible = true;
                _t.$api.get('role/getRolesNoLimit', {}, function (res) {
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
            // 重置角色授权
            resetDialog() {
                let _t = this;
                _t.dialogVisible = false;
                _t.addEdit.roleId = '';
                _t.addEdit.roleFlag = false;
            },
            // 保存角色
            saveRole() {
                let _t = this;
                // 校验选中的角色
                _t.blurInput(_t.addEdit, 'roleFlag', _t.addEdit.roleId);
                // 用户id为空
                if (_t.formItem.userId === '' || _t.formItem.userId === null) {
                    _t.$message.warning('用户ID为空,请重新登录!');
                    return;
                }
                // 可以提交
                if (_t.addEdit.roleFlag === false) {
                    _t.$api.post('role/bidingUserAndRole', {
                        userId: _t.formItem.userId, // 用户id
                        roleId: _t.addEdit.roleId, // 角色id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 授权成功
                                _t.$message.success('授权成功!');
                                _t.resetDialog();
                                _t.getData();
                                break;
                            default: // 授权失败
                                _t.$message.error('授权失败!');
                                break;
                        }
                    });
                }
            }
        },
        created() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.$store.commit('setLoading', true);
            _t.formItem.userId = _t.$route.params.USER_DETAIL_ID ? _t.$route.params.USER_DETAIL_ID : localStorage.getItem('USER_DETAIL_ID');
            _t.getData();
        }
    }
</script>

<style scoped>
    p.title {
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        margin: 20px 0;
    }

    .pageHeader {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #e6e6e6;
    }

    .pageHeader i {
        cursor: pointer;
        margin-right: 10px;
    }

    .default_head {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
    }
</style>
