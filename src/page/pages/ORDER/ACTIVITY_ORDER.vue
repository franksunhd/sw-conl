<template>
    <Box>
        <!--查询表单-->
        <el-form :model="formItem" inline>
            <el-form-item label="活动票名称">
                <el-input v-model="formItem.activityTitle"/>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="formItem.orderItemId"/>
            </el-form-item>
            <el-form-item label="订单状态">
                <el-select clearable v-model="formItem.status">
                    <el-option label="待支付" value="0"/>
                    <el-option label="支付成功" value="1"/>
                    <el-option label="超时取消" value="2"/>
                    <el-option label="支付失败" value="3"/>
                </el-select>
            </el-form-item>
            <el-form-item label="证件号">
                <el-input v-model="formItem.userCardId"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData(true)">查询</el-button>
                <el-button type="warning" @click="resetData">重置</el-button>
            </el-form-item>
            <el-form-item class="fr marginRight0">
                <el-button type="primary" @click="downloadData">导出数据</el-button>
            </el-form-item>
        </el-form>
        <!--表格-->
        <el-table :data="tableData" border stripe>
            <el-table-column prop="activityTitle" label="活动票名称" header-align="center" align="center"/>
            <el-table-column prop="orderId" label="订单编号" header-align="center" align="center"/>
            <el-table-column prop="ticketCount" label="订单数量(张)" header-align="center" align="center"/>
            <el-table-column prop="orderPrice" label="订单总金额" header-align="center" align="center"/>
            <el-table-column label="订单状态" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 0">待支付</span>
                    <span class="greenColor" v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 1">支付成功</span>
                    <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 2">超时取消</span>
                    <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 3">支付失败</span>
                </template>
            </el-table-column>
            <el-table-column prop="orderTime" label="下单时间" header-align="center" align="center"/>
            <el-table-column prop="userCarId" label="证件号" header-align="center" align="center"/>
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
    import Box from "../../../components/Box";
    import {dateFilter} from "../../../assets/js/filters";

    export default {
        name: "ACTIVITY_ORDER",
        components: {Box},
        data() {
            return {
                isWeb: false, // 设备
                // 查询表单
                formItem: {
                    userCardId: '', // 证件号
                    activityTitle: '', // 活动票名称
                    orderItemId: '', // 订单编号
                    status: '', // 订单状态
                },
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
            // 查询表格
            getData(item) {
                let _t = this;
                _t.$store.commit('setLoading', true);
                if (item !== undefined) {
                    _t.options.currentPage = 1;
                }
                _t.$api.post('order/listOrders', {
                    page: _t.options.currentPage, // 当前页码
                    limit: _t.options.pageSize, // 每页显示的条数
                    orderStatus: _t.formItem.status.trim() === '' ? null : _t.formItem.status.trim(), // 订单状态
                    userCardId: _t.formItem.userCardId.trim() === '' ? null : _t.formItem.userCardId.trim(), // 证件号
                    activityTitle: _t.formItem.activityTitle.trim() === '' ? null : _t.formItem.activityTitle.trim(), // 活动名称
                    orderItemId: _t.formItem.orderItemId.trim() === '' ? null : _t.formItem.orderItemId.trim(), // 订单编号
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            let tableData = res.data.content !== undefined ? res.data.content : [];
                            tableData.forEach((item) => {
                                // 处理订单时间
                                if (item.orderTime !== undefined && item.orderTime !== null) {
                                    item.orderTime = dateFilter(Number(item.orderTime));
                                }
                                // 处理订单总金额
                                if (item.orderPrice !== undefined && item.orderPrice !== null) {
                                    if (item.orderPrice.toString() !== '0') {
                                        item.orderPrice = item.orderPrice / 100;
                                    }
                                }
                            });
                            _t.tableData = tableData;
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        case 204: // 暂无记录
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                        default: // 查询失败
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 重置查询表单
            resetData() {
                let _t = this;
                _t.formItem.userCardId = ''; // 证件号
                _t.formItem.activityTitle = ''; // 活动票名称
                _t.formItem.orderItemId = ''; // 订单编号
            },
            // 导出数据
            downloadData() {
                let _t = this;
                if (_t.tableData.length !== 0) {
                    _t.$prompt('请输入需要导出的活动名称', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPlaceholder: '默认不输入导出所有'
                    }).then(({value}) => {
                        // 判断如果value 为空默认查全部
                        if (value === null || value.trim() === '') {
                            let url = _t.$api.root() + 'orderIterm/exportOrderIterm';
                            window.location.href = url;
                        } else {
                            _t.$api.post('orderIterm/exportOrdersByTitle', {
                                activityTitle: value.trim()
                            }, function (res) {
                                switch (res.status) {
                                    case 200: // 成功
                                        window.location.href = _t.$api.root() + 'orderIterm/exportOrderItemByTitle';
                                        break;
                                    default:
                                        _t.$message.warning('暂无数据,无法导出!');
                                        break;
                                }
                            });
                        }
                    }).catch(() => {
                        return false;
                    });
                } else {
                    _t.$message.warning('没有可导出的数据！');
                }
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

</style>
