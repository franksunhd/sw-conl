<template>
    <Box>
        <!--查询表单-->
        <el-form :model="formItem" inline label-width="90px">
            <el-form-item label="标题/名称：">
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    class="widthAll"
                    v-model="formItem.name"/>
            </el-form-item>
            <el-form-item label="所属模块：">
                <el-select
                    clearable
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.model">
                    <el-option
                        v-for="(item,index) in modelList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="语言：">
                <el-select
                    clearable
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.language">
                    <el-option
                        v-for="(item,index) in languageList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item label="发布时间：">
                <el-date-picker
                    :class="isWeb ? 'widthFixed marBottom20' : 'widthAll marBottom20'"
                    v-model="formItem.startTime"
                    type="date"
                    placeholder="开始日期">
                </el-date-picker>
                <span v-if="isWeb" class="marginLR10">至</span>
                <span v-else><br></span>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.endTime"
                    type="date"
                    placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getData(true)">查询</el-button>
                <el-button type="warning" @click="resetTable">重置</el-button>
            </el-form-item>
        </el-form>
        <!--全局按钮-->
        <div class="marBottom20">
            <el-button @click="dialogVisible = true" type="primary">内容发布</el-button>
        </div>
        <div class="tableBox">
            <el-table :data="tableData" border>
                <el-table-column label="所属模块" width="100px" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.moduleNumber !== undefined
                            && scope.row.moduleNumber === 0">VIP图片</span>
                        <span v-if="scope.row.moduleNumber !== undefined
                            && scope.row.moduleNumber === 3">VIP视频</span>
                        <span v-if="scope.row.moduleNumber !== undefined
                            && scope.row.moduleNumber === 4">VIP活动</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题/名称" header-align="center" align="center"/>
                <el-table-column prop="language" label="语言" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.language === 'zh_CN'">中文</span>
                        <span v-else-if="scope.row.language === 'en'">English</span>
                        <span v-else>中文/English</span>
                    </template>
                </el-table-column>
                <el-table-column prop="releaseTime" label="最后发布时间" header-align="center" align="center"/>
                <el-table-column prop="releaseName" label="操作人" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button @click="editData(scope.row)" class="text" type="text">编辑</el-button>
                        <el-button @click="deleteData(scope.row)" class="redColor" type="text">删除</el-button>
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
        </div>
        <!--选择模块-->
        <el-dialog
            title="选择所属模块"
            append-to-body
            class="dialogForm_VIP"
            :before-close="resetData"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisible">
            <el-form :model="addEdit">
                <el-form-item label="内容模块：">
                    <el-select v-model="addEdit.model">
                        <el-option v-for="(item,index) in modelList" :key="index" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="default" class="marRight10" @click="resetData">取消</el-button>
                <el-button type="primary" @click="addContent">下一步</el-button>
            </div>
        </el-dialog>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";
    import {dateFilter} from "../../../../assets/js/filters";

    export default {
        name: "VIP_CONTENT",
        components: {Box},
        data() {
            return {
                isWeb: false,// 是否pc端
                // 查询表单
                formItem: {
                    name: '', // 名称
                    model: '', // 模块
                    language: '', // 语言
                    startTime: null, // 开始时间
                    endTime: null, // 结束时间
                },
                // 模块集合
                modelList: [
                    {label: 'VIP图片', value: '0'},
                    {label: 'VIP视频', value: '3'},
                    {label: 'VIP活动', value: '4'},
                    // {label: 'VIP留言板', value: '9'},
                ],
                // 语言列表
                languageList: [
                    {label: '中文', value: 'zh_CN'},
                    {label: 'English', value: 'en'},
                ],
                // 表格
                tableData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                dialogVisible: false, // 选择内容模块蒙版
                // 内容模块
                addEdit: {
                    model: ''
                }
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
            // 获取数据
            getData(item) {
                var _t = this;
                if (item !== undefined) {
                    _t.options.currentPage = 1;
                }
                _t.$api.post('contentManage/listCContentManage/' + _t.options.currentPage + '/' + _t.options.pageSize, {
                    title: _t.formItem.name.trim() === '' ? null : _t.formItem.name.trim(), // 标题名称
                    moduleNumber: _t.formItem.model === '' ? null : _t.formItem.model, // 所属模块
                    language: _t.formItem.language === '' ? null : _t.formItem.language, // 语言
                    isVipContent: 1, // 1: VIP 0: 普通
                    registTime: _t.formItem.startTime === '' ? null : (_t.formItem.startTime === null ? null : new Date(_t.formItem.startTime).getTime()), // 开始时间
                    endTime: _t.formItem.endTime === '' ? null : (_t.formItem.endTime === null ? null : new Date(_t.formItem.endTime).getTime()), // 结束时间
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            _t.tableData = res.data.content !== null ? res.data.content : [];
                            _t.tableData.forEach((item) => {
                                item.releaseTime = dateFilter(item.releaseTime);
                            });
                            _t.options.total = res.data.total !== null ? res.data.total : 0;
                            break;
                        default:
                            _t.tableData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 重置查询表单
            resetTable() {
                var _t = this;
                _t.formItem.name = ''; // 标题名称
                _t.formItem.model = ''; // 所属模块
                _t.formItem.startTime = null; // 开始时间
                _t.formItem.endTime = null; // 结束时间
            },
            // 重置选择内容
            resetData() {
                var _t = this;
                // 隐藏蒙版
                _t.dialogVisible = false;
                _t.addEdit.model = '';
            },
            // 点击选择内容下一步
            addContent() {
                var _t = this;
                switch (_t.addEdit.model) {
                    case '0': // VIP 图片
                        _t.$router.push({name: 'VIP_ADD_PHOTOS'});
                        break;
                    case '3': // VIP 视频
                        _t.$router.push({name: 'VIP_ADD_VIDEOS'});
                        break;
                    case '4': // VIP 活动
                        _t.$router.push({name: 'VIP_ADD_ACTIVITY'});
                        break;
                    case '9': // VIP 留言板
                        _t.$router.push({name: 'VIP_ADD_MESSAGE'});
                        break;
                    default:
                        _t.$message.error('请选择所属内容模块!');
                        break;
                }
                if (_t.addEdit.model !== '') {
                    _t.setCookie('TEAM_WANG_MODULE_ID', _t.addEdit.model);
                }
            },
            // 编辑按钮
            editData(row) {
                var _t = this;
                switch (row.moduleNumber) {
                    case 0: // VIP 照片
                        _t.$router.push({
                            name: 'VIP_EDIT_PHOTOS', params: {
                                TEAM_WANG_VIP_MODULE: row.module, // 0:轮播 1: banner 2: vip照片
                                TEAM_WANG_VIP_CONTENT_ID: row.id, // 内容id
                                TEAM_WANG_VIP_FOREIGN_KEY: row.foreignKey, // 外键
                                TEAM_WANG_VIP_MODULE_NUM: row.moduleNumber, // 模块编号
                            }
                        });
                        localStorage.setItem('TEAM_WANG_VIP_MODULE', row.module);
                        localStorage.setItem('TEAM_WANG_VIP_CONTENT_ID', row.id);
                        localStorage.setItem('TEAM_WANG_VIP_FOREIGN_KEY', row.foreignKey);
                        localStorage.setItem('TEAM_WANG_VIP_MODULE_NUM', row.moduleNumber);
                        break;
                    case 3: // VIP 视频
                        _t.$router.push({
                            name: 'VIP_EDIT_VIDEOS', params: {
                                TEAM_WANG_VIP_CONTENT_ID: row.id,
                                TEAM_WANG_VIP_FOREIGN_KEY: row.foreignKey,
                                TEAM_WANG_VIP_MODULE_NUM: row.moduleNumber
                            }
                        });
                        localStorage.setItem('TEAM_WANG_VIP_CONTENT_ID', row.id);
                        localStorage.setItem('TEAM_WANG_VIP_FOREIGN_KEY', row.foreignKey);
                        localStorage.setItem('TEAM_WANG_VIP_MODULE_NUM', row.moduleNumber);
                        break;
                    case 4: // VIP活动
                        _t.$router.push({
                            name: 'VIP_EDIT_ACTIVITY', params: {
                                TEAM_WANG_VIP_CONTENT_ID: row.id,
                                TEAM_WANG_VIP_FOREIGN_KEY: row.foreignKey,
                                TEAM_WANG_VIP_MODULE_NUM: row.moduleNumber
                            }
                        });
                        localStorage.setItem('TEAM_WANG_VIP_CONTENT_ID', row.id);
                        localStorage.setItem('TEAM_WANG_VIP_FOREIGN_KEY', row.foreignKey);
                        localStorage.setItem('TEAM_WANG_VIP_MODULE_NUM', row.moduleNumber);
                        break;
                    default:
                        break;
                }
                if (_t.formItem.model !== '') {
                    _t.setCookie('TEAM_WANG_MODULE_ID', _t.formItem.model);
                }
            },
            // 删除内容
            deleteData(row) {
                var _t = this;
                _t.$confirm('您确定删除此条数据吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('contentManage/deleteContent', {
                        id: row.id, // id值
                        foreignKey: row.foreignKey, // 外键id
                        moduleNumber: row.moduleNumber, // 所属模块
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success(res.message);
                                _t.getData();
                                break;
                            case 2005: // 删除错误
                                _t.$message.error(res.message);
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
            var _t = this;
            var equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            // 先获取一次记录的所属模块 为空查全部
            let module = _t.getCookie('TEAM_WANG_MODULE_ID');
            if (module !== null && module !== 'null' && module !== '') {
                _t.formItem.model = module;
                _t.delCookie('TEAM_WANG_MODULE_ID');
            }
            // 获取表格数据
            _t.getData();
        }
    }
</script>

<style>
    .dialogForm_VIP .el-dialog {
        max-width: 500px;
    }

    @media screen and (max-width: 750px) {
        .dialogForm_VIP .el-dialog {
            width: 95%;
        }
    }
</style>
