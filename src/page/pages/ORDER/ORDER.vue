<template>
    <Box>
        <!--查询表单-->
        <el-form :model="formItem" inline>
            <el-form-item label="昵称">
                <el-input v-model="formItem.userId"/>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="formItem.id"/>
            </el-form-item>
            <el-form-item label="支付方式">
                <el-select v-model="formItem.payWay" clearable>
                    <el-option v-for="(item,index) in payWayList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="是否需要入会礼">
                <el-select
                    v-model="formItem.giftOrNot"
                    clearable>
                    <el-option label="是" value="1"/>
                    <el-option label="否" value="0"/>
                </el-select>
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
            <el-table-column prop="userId" label="昵称" header-align="center" align="center"/>
            <el-table-column prop="vipOrderId" label="订单编号" header-align="center" align="center"/>
            <el-table-column label="是否需要入会礼" header-align="center" align="center">
                <template slot-scope="scope">
                    <span class="warningColor" v-if="scope.row.giftOrNot === 1">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column prop="isTrue" label="是否充值成功" header-align="center" align="center"/>
            <el-table-column label="支付方式" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.payWay !== undefined && (scope.row.payWay === '0' || scope.row.payWay.indexOf('alipay_') !== -1)">支付宝</span>
                    <span v-if="scope.row.payWay !== undefined && (scope.row.payWay === '1' || scope.row.payWay.indexOf('wx_') !== -1)">微信</span>
                    <span v-if="scope.row.payWay !== undefined && (scope.row.payWay === '2' || scope.row.payWay.indexOf('paypal') !== -1)">PayPal</span>
                </template>
            </el-table-column>
            <el-table-column prop="payPrice" label="支付金额" header-align="center" align="center"/>
            <el-table-column label="会员有效期" header-align="center" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.openTime}}</span>
                    <span>-</span>
                    <span>{{scope.row.stopTime}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="operationTime" label="操作时间" header-align="center" align="center"/>
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
    import {dateFilter, dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "ORDER",
        components: {Box},
        data() {
            return {
                isWeb: false, // 设备
                // 查询表单
                formItem: {
                    userId: '', // 昵称
                    giftOrNot: '', // 是否需要入会礼
                    id: '', // 订单编号
                    payWay: '', // 支付方式
                },
                // 表格
                tableData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 支付方式
                payWayList: [
                    {label: '支付宝', value: 'alipay'},
                    {label: '微信', value: 'wx'},
                    {label: 'PayPal', value: 'paypal'}
                ]
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
                _t.$api.post('viporders/listVipOrders', {
                    page: _t.options.currentPage, // 当前页码
                    limit: _t.options.pageSize, // 每页显示的条数
                    userId: _t.formItem.userId.trim() === '' ? null : _t.formItem.userId.trim(), // 昵称
                    id: _t.formItem.id.trim() === '' ? null : _t.formItem.id.trim(), // 订单编号
                    payWay: _t.formItem.payWay === '' ? null : _t.formItem.payWay, // 支付方式
                    giftOrNot: _t.formItem.giftOrNot === '' ? null : _t.formItem.giftOrNot, // 是否需要入会礼
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            let tableData = res.data.content !== undefined ? res.data.content : [];
                            tableData.forEach((item) => {
                                // 处理是否充值成功
                                item.isTrue = '是';
                                // 处理有效期
                                if (item.openTime !== undefined && item.openTime !== null) {
                                    item.openTime = dateFilterDayCN(item.openTime);
                                }
                                // 处理结束时间
                                if (item.stopTime !== undefined && item.stopTime !== null) {
                                    item.stopTime = dateFilterDayCN(item.stopTime);
                                }
                                // 处理操作时间
                                if (item.operationTime !== undefined && item.operationTime !== null) {
                                    item.operationTime = dateFilter(item.operationTime);
                                }
                                // 处理支付金额
                                if (item.payPrice !== undefined && item.payPrice !== null) {
                                    if (item.payPrice.toString() !== '0') {
                                        item.payPrice = item.payPrice / 100;
                                    }
                                }
                            });
                            _t.tableData = tableData;
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
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
                _t.formItem.userId = ''; // 昵称
                _t.formItem.giftOrNot = ''; // 是否需要入会礼
                _t.formItem.id = ''; // 订单编号
                _t.formItem.payWay = ''; // 支付方式
            },
            // 导出数据
            downloadData() {
                let _t = this;
                if (_t.tableData.length !== 0) {
                    let url = _t.$api.root() + 'viporders/exportVipOrders';
                    window.location.href = url;
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
