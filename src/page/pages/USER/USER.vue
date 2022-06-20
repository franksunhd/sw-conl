<template>
    <Box>
        <!--查询表单-->
        <el-form inline :model="formItem" label-width="90px">
            <el-form-item label="用户身份：">
                <el-select v-model="formItem.role" clearable>
                    <el-option v-for="(item,index) in roleList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名：">
                <el-input v-model="formItem.userName"/>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')"/>
            </el-form-item>
            <el-form-item label="注册方式：">
                <el-select v-model="formItem.type" clearable>
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="formItem.status" clearable>
                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="注册时间：">
                <el-date-picker
                    class="marBottom20"
                    v-model="formItem.startTime"
                    type="date"
                    placeholder="开始日期">
                </el-date-picker>
                <span v-if="isWeb || bIsIPad" class="marginLR10">至</span>
                <span v-else><br></span>
                <el-date-picker
                    v-model="formItem.endTime"
                    type="date"
                    placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="getData(true)" type="primary">查询</el-button>
                <el-button @click="resetData" type="warning">重置</el-button>
            </el-form-item>
            <el-form-item class="fr marginRight0">
                <el-button v-if="addEdit.adminId.indexOf(addEdit.userId) !== -1" type="primary" @click="addUser">添加管理员
                </el-button>
                <el-button type="primary" @click="downloadData">导出数据</el-button>
            </el-form-item>
        </el-form>
        <!--表格-->
        <div>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="id" label="用户ID" width="160px" header-align="center" align="center"/>
                <el-table-column prop="userName" label="用户名" width="150px" header-align="center" align="center"/>
                <el-table-column prop="userNickName" label="昵称" header-align="center" align="center"/>
                <el-table-column prop="userPhoneNumber" label="手机号" width="120px" header-align="center" align="center"/>
                <el-table-column label="注册方式" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '0'">账号</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '1'">手机</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '2'">邮箱</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '3'">微博</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '4'">微信</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '5'">QQ</span>
                        <span
                            v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '6'">TWITTER</span>
                        <span v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '7'">Facebook</span>
                        <span v-if="scope.row.registWay !== undefined && scope.row.registWay.toString() === '8'">Instagram</span>
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" width="160px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.registTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户身份" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.role === undefined || (scope.row.role !== undefined && scope.row.role.toString() === '0')">普通</span>
                        <span class="warningColor"
                              v-if="scope.row.role !== undefined && scope.row.role.toString() === '1'">VIP</span>
                        <span class="warningColor"
                              v-if="scope.row.role !== undefined && scope.row.role.toString() === '2'">管理员</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员有效期" width="160px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.startTime}}-</div>
                        <div>{{scope.row.endTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="用户状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span class="greenColor"
                              v-if="scope.row.status !== undefined && scope.row.status.toString() === '1'">正常</span>
                        <span class="redColor"
                              v-else-if="scope.row.status !== undefined && scope.row.status.toString() === '0'">锁定</span>
                        <span class="blueColor"
                              v-else-if="scope.row.status !== undefined && scope.row.status.toString() === '2'">新注册</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="clickDetail(scope.row)">编辑</el-button>
                        <el-button
                            v-if="scope.row.status !== undefined && scope.row.status.toString() === '1' && scope.row.id !== '1'"
                            type="text"
                            class="redColor"
                            @click="addLock(scope.row,true)">锁定
                        </el-button>
                        <el-button
                            v-else-if="scope.row.status !== undefined && scope.row.status.toString() === '0' && scope.row.id !== '1'"
                            class="redColor"
                            type="text"
                            @click="addLock(scope.row,false)">解锁
                        </el-button>
                        <el-button v-else type="text">
                            <span class="visibilityHidden">占位</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <pages
            :total='options.total'
            :currentPage='options.currentPage'
            :page-size="options.pageSize"
            @handleSizeChangeSub="handleSizeChangeSub"
            @handleCurrentChangeSub="handleCurrentChange"/>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";
    import {dateFilter} from "../../../assets/js/filters";

    export default {
        name: "USER",
        components: {Box},
        data() {
            return {
                isWeb: false,// 是否pc端
                bIsIPad: false, // 是否iPad
                // 查询表单
                formItem: {
                    userName: '',
                    mobile: '',
                    type: '',
                    role: '',
                    status: '',
                    startTime: null,
                    endTime: null
                },
                // 表格
                tableData: [],
                // 注册方式
                typeList: [
                    {label: '账号', value: '0'},
                    {label: '手机', value: '1'},
                    // {label: '邮箱', value: '2'},
                    {label: '微博', value: '3'},
                    {label: '微信', value: '4'},
                    {label: 'QQ', value: '5'},
                    // {label: 'TWITTER', value: '6'},
                    // {label: 'Facebook', value: '7'},
                    // {label: 'Instagram', value: '8'},
                ],
                // 用户身份列表
                roleList: [
                    {label: '所有用户', value: '-1'},
                    {label: 'VIP用户', value: '1'},
                    {label: '普通用户', value: '0'},
                    {label: '管理员', value: '2'},
                ],
                // 状态列表
                statusList: [
                    {label: '正常', value: '1'},
                    {label: '锁定', value: '0'},
                    {label: '新注册', value: '2'},
                ],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 表单
                addEdit: {
                    adminId: this.$api.adminId(), // admin账户
                    userId: this.getCookie('TEAM_WANG_USER_ID'),
                }
            }
        },
        methods: {
            // 重置按钮
            resetData() {
                let _t = this;
                _t.formItem.userName = '';
                _t.formItem.mobile = '';
                _t.formItem.type = '';
                _t.formItem.role = '';
                _t.formItem.status = '';
                _t.formItem.startTime = null;
                _t.formItem.endTime = null;
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 获取数据
            getData(item) {
                let _t = this;
                if (item !== undefined) {
                    _t.options.currentPage = 1;
                }
                _t.$api.post('user/listUserInfo/' + _t.options.currentPage + '/' + _t.options.pageSize, {
                    userName: _t.formItem.userName.trim() === '' ? null : _t.formItem.userName.trim(), // 用户名
                    userPhoneNumber: _t.formItem.mobile.trim() === '' ? null : _t.formItem.mobile.trim(), // 手机号
                    registWay: _t.formItem.type.trim() === '' ? null : _t.formItem.type.trim(), // 注册方式
                    role: _t.formItem.role.trim() === '' ? null : (_t.formItem.role.trim() === '-1' ? null : _t.formItem.role.trim()), // 用户身份
                    status: _t.formItem.status.trim() === '' ? null : _t.formItem.status.trim(), // 用户状态
                    registTime: _t.formItem.startTime !== null ? new Date(_t.formItem.startTime).getTime() : null,
                    endTime: _t.formItem.endTime !== null ? new Date(_t.formItem.endTime).getTime() : null,
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200:
                            let tableData = res.data.content !== undefined ? res.data.content : [];
                            tableData.forEach((item) => {
                                // 注册时间
                                if (item.registTime !== undefined && item.registTime !== null) {
                                    item.registTime = dateFilter(item.registTime);
                                }
                                // 最近登录时间
                                if (item.recentTime !== undefined && item.recentTime !== null) {
                                    item.recentTime = dateFilter(item.recentTime);
                                }
                                // 会员有效期开始时间
                                if (item.startTime !== undefined && item.startTime !== null) {
                                    item.startTime = dateFilter(item.startTime);
                                }
                                // 会员有效期结束时间
                                if (item.endTime !== undefined && item.endTime !== null) {
                                    item.endTime = dateFilter(item.endTime);
                                }
                            });
                            _t.tableData = tableData;
                            _t.options.total = res.data.total;
                            break;
                        default:
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 查看详情
            clickDetail(row) {
                let _t = this;
                _t.$router.push({
                    name: 'USER_DETAILS', params: {
                        USER_DETAIL_ID: row.id
                    }
                });
                localStorage.setItem('USER_DETAIL_ID', row.id);
            },
            // 锁定和解锁
            addLock(row, flag) {
                let _t = this;
                _t.$confirm(flag === true ? '您确定锁定该用户吗?' : '您确定解锁该用户吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.getLock(row);
                }).catch(() => {
                    return false;
                });
            },
            // 请求锁定用户的接口
            getLock(val) {
                let _t = this;
                _t.$api.post('user/updateUserInfoStatus/' + val.id, {}, function (res) {
                    switch (res.status) {
                        case 200:
                            _t.$message.success(res.message);
                            _t.getData();
                            break;
                        default:
                            break;
                    }
                });
            },
            // 导出数据
            downloadData() {
                let _t = this;
                if (_t.tableData.length !== 0) {
                    let url = _t.$api.root() + '/user/listUser';
                    window.location.href = url;
                } else {
                    _t.$message.warning('没有可导出的数据！');
                }
            },
            // 添加管理员
            addUser() {
                let _t = this;
                _t.$router.push({name: 'USER_EDIT'});
            }
        },
        created() {
            let _t = this;
            _t.$store.commit('setLoading', true);
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            let sUserAgent = navigator.userAgent.toLowerCase();
            let bIsIPad = sUserAgent.match(/ipad/i) == "ipad";
            if (bIsIPad) {
                _t.bIsIPad = true;
            } else {
                _t.bIsIPad = false;
            }
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
