<template>
    <Box>
        <!--查询表单-->
        <el-form :model="formItem" inline>
            <el-form-item label="类别">
                <el-select clearable v-model="formItem.type">
                    <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData">查询</el-button>
                <el-button type="warning" @click="resetData">重置</el-button>
            </el-form-item>
        </el-form>
        <!--全局按钮-->
        <div class="marBottom20">
            <el-button @click="addData" type="primary">添加</el-button>
        </div>
        <el-table :data="tableData" border stripe>
            <el-table-column label="类别" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.logoType !== undefined && scope.row.logoType === '1'">社交平台</span>
                    <span v-else-if="scope.row.logoType !== undefined && scope.row.logoType === '2'">音乐平台</span>
                </template>
            </el-table-column>
            <el-table-column label="图标" header-align="center" align="center">
                <template slot-scope="scope">
                    <img class="img_icon"
                         v-if="scope.row.logoAddress !== undefined && scope.row.logoAddress !== null"
                         :src="scope.row.logoAddress" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="logoName" label="名称" header-align="center" align="center"/>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button @click="delData(scope.row)" class="redColor" type="text">删除</el-button>
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
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "LOGO_MANAGE",
        components: {Box},
        data() {
            return {
                // 查询表单
                formItem: {
                    type: ''
                },
                // 表格数据
                tableData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 类别
                typeList: [
                    {label: '社交平台', value: '1'},
                    {label: '音乐平台', value: '2'},
                ]
            }
        },
        methods: {
            // 改变当前页码
            handleCurrentChange(val) {
                var _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                var _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 获取表格数据
            getData() {
                let _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('logo/listLogo', {
                    logoType: _t.formItem.type === '' ? null : _t.formItem.type,
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, //  每页显示条数
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                let tableData = res.data.content !== undefined ? res.data.content : [];
                                tableData.forEach((item) => {
                                    if (item.logoAddress !== undefined && item.logoAddress !== null) {
                                        item.logoAddress = _t.$api.imgUrl() + item.logoAddress;
                                    }
                                });
                                _t.tableData = tableData;
                                _t.options.total = res.data.total;
                            }
                            break;
                        default: // 查询失败
                            _t.$message.error('查询失败!');
                            break;
                    }
                });
            },
            // 重置查询表单
            resetData() {
                var _t = this;
                _t.formItem.type = '';
            },
            // 删除数据
            delData(row) {
                var _t = this;
                _t.$confirm('请确保此项资源没有在平台中使用,删除可能导致部分模块图片显示出错,您确定要删除吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('logo/deleteLogo', {
                        id: row.id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success('删除成功!');
                                _t.getData();
                                break;
                            default: // 操作失败
                                _t.$message.error('删除失败!');
                                break;
                        }
                    });
                }).catch(() => {
                    return false
                });
            },
            // 点击添加按钮
            addData() {
                var _t = this;
                _t.$router.push({name: 'ADD_LOGO'});
            }
        },
        created() {
            let _t = this;
            _t.getData();
        }
    }
</script>

<style scoped>
    .img_icon {
        width: 20px;
        height: 20px;
    }
</style>
