<template>
    <Box>
        <!-- 表格 -->
        <el-table :data="tableData" border stripe>
            <el-table-column prop="id" label="ID" width="100px" header-align="center" align="center"/>
            <el-table-column prop="menuName" label="菜单名称" header-align="center" align="center"/>
            <el-table-column prop="language" label="语言" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.language === 'zh_CN'">中文</span>
                    <span v-else-if="scope.row.language === 'en'">English</span>
                    <span v-else>中文/English</span>
                </template>
            </el-table-column>
            <el-table-column prop="menuLevel" label="级别" header-align="center" align="center"/>
            <el-table-column prop="menuHref" label="菜单地址" header-align="center" align="center"/>
            <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="editData(scope.row)">编辑</el-button>
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
        name: "MENU_MANAGE",
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
            // 查询菜单
            getData() {
                var _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('menu/listMenuInfos', {
                    page: _t.options.currentPage,
                    limit: _t.options.pageSize
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200:
                            let tableData = res.data.content !== undefined ? res.data.content : [];
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
            // 编辑按钮
            editData(row) {
                let _t = this;
                _t.$router.push({
                    name: 'EDIT_MENU', params: {
                        TEAM_WANG_MENU_ID: row.id
                    }
                });
                localStorage.setItem('TEAM_WANG_MENU_ID', row.id);
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
