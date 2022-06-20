<template>
    <Box>
        <div class="roleBox">
            <!--全局操作-->
            <div class="btnBox">
                <el-button @click="addData" type="primary">添加角色</el-button>
            </div>
            <el-table :data="tableData" border stripe>
                <el-table-column label="ID" prop="id" header-align="center" align="center"/>
                <el-table-column label="角色名称" prop="roleName" header-align="center" align="center"/>
                <el-table-column label="角色类别" prop="roleTypeName" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button @click="editData(scope.row)" type="text" class="blueColor">编辑</el-button>
                        <el-button @click="deleteData(scope.row)" type="text" class="redColor">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
            <!--蒙版-->
            <el-dialog
                :before-close="resetData"
                :visible.sync="dialogVisible"
                append-to-body
                :width="isWeb === false ? '95%' : '50%'"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                title="新增/编辑角色">
                <el-form :model="addEdit">
                    <p class="star formTitle">角色名称</p>
                    <el-form-item class="marBottom10">
                        <el-input
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            @blur="blurInput(addEdit,'titleFlag',addEdit.title)"
                            v-model="addEdit.title"/>
                        <div v-if="addEdit.titleFlag" class="isNotNullText">必填项不能为空</div>
                    </el-form-item>
                    <p class="formTitle">关联菜单</p>
                    <el-form-item>
                        <el-tree
                            ref="menuTree"
                            show-checkbox
                            :check-on-click-node="true"
                            node-key="id"
                            :default-expanded-keys="defaultCheckedKeys"
                            :props="defaultProps"
                            :data="menuTree"/>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="resetData" class="marRight10" type="default">取消</el-button>
                    <el-button v-if="formItem.isAdd === true" @click="addDataPost" type="primary">保存</el-button>
                    <el-button v-if="formItem.isAdd === false" @click="editDataPost" type="primary">保存</el-button>
                </div>
            </el-dialog>
        </div>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "ROLE",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 查询表单
                formItem: {
                    isAdd: true, // 新增还是编辑
                },
                // 表格数据
                tableData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                dialogVisible: false, // 蒙版
                // 新增编辑表单
                addEdit: {
                    id: '', // id
                    title: '', // 角色名称
                    titleFlag: false, // 角色名标识
                },
                menuTree: [], // 菜单树
                defaultCheckedKeys: [], // 默认选中的节点
                defaultProps: {
                    children: 'children',
                    label: 'menuName'
                }
            }
        },
        methods: {
            // 失去焦点校验
            blurInput(item, flag, val) {
                item[flag] = val.trim() === '' ? true : false;
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
            // 获取表格数据
            getData() {
                let _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('role/getRoles', {
                    limit: _t.options.pageSize, // 每页显示条数
                    page: _t.options.currentPage, // 当前页
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            let resData = res.data.content !== undefined && res.data.content !== null ? res.data.content : [];
                            resData.forEach((item) => {
                                if (item.roleType !== undefined && item.roleType !== null) {
                                    item.roleTypeName = item.roleType === 2 ? '管理员' : '';
                                }
                            });
                            _t.tableData = resData;
                            _t.options.total = res.data.total;
                            break;
                        default: // 查询出错
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 重置表单
            resetData() {
                let _t = this;
                _t.dialogVisible = false;
                _t.addEdit.title = '';
                _t.addEdit.titleFlag = false;
                _t.addEdit.id = '';
                _t.formItem.isAdd = true;
                _t.$refs.menuTree.setCheckedKeys([]);
                _t.defaultCheckedKeys = [];
            },
            // 添加角色
            addData() {
                let _t = this;
                _t.formItem.isAdd = true;
                _t.dialogVisible = true;
                _t.getMenuTree(true);
            },
            // 添加校色保存
            addDataPost() {
                let _t = this;
                // 校验校色名称
                _t.blurInput(_t.addEdit, 'titleFlag', _t.addEdit.title);
                // 可以提交
                if (_t.addEdit.titleFlag === false) {
                    // 最终需要发送的数组
                    let menuArr = new Array();
                    // 半选节点
                    let halfArr = _t.$refs.menuTree.getHalfCheckedKeys();
                    if (halfArr.length !== 0) {
                        halfArr.forEach((item) => {
                            let obj = new Object();
                            obj.id = item;
                            obj.isChecked = false;
                            menuArr.push(obj);
                        });
                    }
                    // 全选节点
                    let allArr = _t.$refs.menuTree.getCheckedKeys();
                    if (allArr.length !== 0) {
                        allArr.forEach((item) => {
                            let obj = new Object();
                            obj.id = item;
                            obj.isChecked = true;
                            menuArr.push(obj);
                        });
                    }
                    _t.$api.post('role/saveRole', {
                        id: null, // 添加未null
                        roleName: _t.addEdit.title.trim(), // 角色名称
                        roleType: 2, // 2: 管理员角色
                        description: null, // 角色描述
                        menuList: menuArr.length === 0 ? null : menuArr, // 勾选的菜单集合
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 保存成功
                                _t.$message.success('保存成功!');
                                _t.resetData();
                                _t.getData();
                                break;
                            default: // 保存失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 编辑角色按钮
            editData(item) {
                let _t = this;
                _t.formItem.isAdd = false;
                _t.dialogVisible = true;
                _t.getMenuTree(false, item);
            },
            // 编辑角色保存
            editDataPost() {
                let _t = this;
                // 校验校色名称
                _t.blurInput(_t.addEdit, 'titleFlag', _t.addEdit.title);
                // 可以提交
                if (_t.addEdit.titleFlag === false) {
                    // 最终需要发送的数组
                    let menuArr = new Array();
                    // 半选节点
                    let halfArr = _t.$refs.menuTree.getHalfCheckedKeys();
                    if (halfArr.length !== 0) {
                        halfArr.forEach((item) => {
                            let obj = new Object();
                            obj.id = item;
                            obj.isChecked = false;
                            menuArr.push(obj);
                        });
                    }
                    // 全选节点
                    let allArr = _t.$refs.menuTree.getCheckedKeys();
                    if (allArr.length !== 0) {
                        allArr.forEach((item) => {
                            let obj = new Object();
                            obj.id = item;
                            obj.isChecked = true;
                            menuArr.push(obj);
                        });
                    }
                    _t.$api.post('role/saveRole', {
                        id: _t.addEdit.id, // 添加未null
                        roleName: _t.addEdit.title.trim(), // 角色名称
                        roleType: 2, // 2: 管理员角色
                        description: null, // 角色描述
                        menuList: menuArr.length === 0 ? null : menuArr, // 勾选的菜单集合
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 保存成功
                                _t.$message.success('保存成功!');
                                _t.resetData();
                                _t.getData();
                                break;
                            default: // 保存失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 获取菜单树
            getMenuTree(flag, item) {
                let _t = this;
                _t.$api.get('menu/getMenuByType', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                _t.menuTree = res.data;
                            }
                            if (flag === false) {
                                _t.getDetail(item);
                            }
                            break;
                        default: // 查询失败
                            _t.menuTree = [];
                            break;
                    }
                });
            },
            // 编辑查询详情
            getDetail(data) {
                let _t = this;
                _t.$api.get('role/getRoleById/' + data.id, {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                let resData = res.data;
                                // id
                                _t.addEdit.id = resData.id !== undefined && resData.id !== null ? resData.id : '';
                                // 角色名称
                                _t.addEdit.title = resData.roleName !== undefined && resData.roleName !== null ? resData.roleName : '';
                                let menuList = resData.roleMenus !== undefined && resData.roleMenus !== null ? resData.roleMenus : [];
                                if (menuList.length !== 0) {
                                    let defaultCheckedKeys = new Array();
                                    menuList.forEach((item) => {
                                        if (item.isChecked === true) {
                                            defaultCheckedKeys.push(item.menuId);
                                            _t.$refs.menuTree.setChecked(item.menuId, true);
                                        }
                                    });
                                    _t.defaultCheckedKeys = defaultCheckedKeys;
                                }
                            }
                            break;
                        default: // 查询详情失败
                            _t.$message.error('查询失败!');
                            break;
                    }
                });
            },
            // 删除角色
            deleteData(item) {
                let _t = this;
                _t.$confirm('确定删除此角色吗?', '温馨提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.delete('role/deleteRoleById/' + item.id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success('删除成功!');
                                _t.getData();
                                break;
                            case 2016: // 角色关联用户
                                _t.$message.error('当前角色关联有用户!');
                                break;
                            default: // 删除失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }).catch(() => {
                    return false;
                });
            }
        },
        created() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.getData();
        }
    }
</script>

<style scoped>
    .btnBox {
        text-align: right;
        margin-bottom: 20px;
    }
</style>
