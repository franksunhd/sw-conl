<template>
    <div class="paging">
        <el-pagination
            background
            :page-size="pageSize"
            :current-page="currentPageNum"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "pages",
        data() {
            return {
                // 组件内接收当前页码
                currentPageNum: this.currentPage
            }
        },
        props: {
            // 当前页
            currentPage: {
                type: Number,
                default: 1
            },
            // 每页数据条数
            pageSize: {
                type: Number,
                default: 10
            },
            // 总数据条数
            total: {
                type: Number,
                default: 0
            },
        },
        methods: {
            // 改变当前页码
            handleCurrentChange(val) {
                var _t = this;
                _t.currentPageNum = val;
                _t.$emit("handleCurrentChangeSub", val);
            },
            // 改变条数
            handleSizeChange(val) {
                var _t = this;
                _t.$emit("handleSizeChangeSub", val);
            }
        },
        watch: {
            currentPage: function (newData, oldData) {
                var _t = this;
                _t.currentPageNum = newData;
            }
        }
    }
</script>

<style scoped>
    .paging {
        margin: 15px 0;
        text-align: right;
    }

    .paging .el-pagination {
        white-space: normal;
    }

    .paging .el-pager .number,
    .paging .el-pagination__total {
        margin-bottom: 10px !important;
    }
</style>
