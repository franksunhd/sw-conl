<template>
    <Box>
        <!--表单-->
        <div class="rightsBox marBottom20">
            <el-button type="primary" class="marRight20" @click="getData">查询</el-button>
            <el-button type="warning" @click="addData">添加权益</el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" border stripe>
            <el-table-column prop="title" label="标题/名称" header-align="center" align="center"/>
            <el-table-column prop="language" label="语言" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.language === 'zh_CN'">中文</span>
                    <span v-else-if="scope.row.language === 'en'">English</span>
                </template>
            </el-table-column>
            <el-table-column prop="operationTime" label="操作时间" header-align="center" align="center"/>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button @click="editData(scope.row)" type="text">编辑</el-button>
                    <el-button class="redColor" @click="deleteData(scope.row)" type="text">删除</el-button>
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
    import {dateFilter} from "../../../../assets/js/filters";

    export default {
        name: "RIGHTS",
        components: {Box},
        data() {
            return {
                // 表格
                tableData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            // 添加权益
            addData() {
                let _t = this;
                _t.$router.push({name: 'ADD_RIGHTS'});
            },
            // 获取数据
            getData() {
                let _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('vipRights/listVipRights', {
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示条数
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            let tableData = res.data.content !== undefined ? res.data.content : [];
                            tableData.forEach((item) => {
                                // 处理操作时间
                                if (item.operationTime !== undefined && item.operationTime !== null) {
                                    item.operationTime = dateFilter(Number(item.operationTime));
                                }
                            });
                            _t.tableData = tableData;
                            _t.options.total = res.data.total;
                            break;
                        default: // 查询异常
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
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
            // 点击编辑按钮
            editData(row) {
                let _t = this;
                _t.$router.push({
                    name: 'EDIT_RIGHTS', params: {
                        TEAM_WANG_RIGHTS_ID: row.id
                    }
                });
                localStorage.setItem('TEAM_WANG_RIGHTS_ID', row.id);
            },
            // 点击删除按钮
            deleteData(row) {
                let _t = this;
                _t.$confirm('您确定删除此项权益吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.delete('vipRights/deleteVipRightsById/' + row.id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success('删除成功');
                                _t.getData();
                                break;
                            default: // 删除失败
                                _t.$message.error('删除失败');
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
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
