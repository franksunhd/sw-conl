<template>
    <Box>
        <el-form :model="formItem">
            <el-tabs class="noticeBox" v-model="activeName" type="border-card">
                <el-tab-pane label="VIP 公告" name="first">
                    <p class="star formTitle">语言版本</p>
                    <el-form-item>
                        <el-select
                            @change="changeLanguage(formItem.language)"
                            v-model="formItem.language">
                            <el-option label="中文" value="zh_CN"/>
                            <el-option label="English" value="en"/>
                        </el-select>
                        <div v-if="formItem.languageFlag" class="isNotNullText">必填项不能为空</div>
                    </el-form-item>
                    <p class="star formTitle">VIP 公告</p>
                    <el-form-item>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows:20}"
                            v-model="formItem.textarea"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="注册协议" name="second">
                    <p class="star formTitle">语言版本</p>
                    <el-form-item>
                        <el-select
                            @change="changeLanguage(registerItem.language)"
                            v-model="registerItem.language">
                            <el-option label="中文" value="zh_CN"/>
                            <el-option label="English" value="en"/>
                        </el-select>
                        <div v-if="registerItem.languageFlag" class="isNotNullText">必填项不能为空</div>
                    </el-form-item>
                    <p class="star formTitle">注册协议</p>
                    <el-form-item>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows:20}"
                            v-model="registerItem.textarea"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveRegisterData">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="支付协议" name="third">
                    <p class="star formTitle">语言版本</p>
                    <el-form-item>
                        <el-select
                            @change="changeLanguage(payItem.language)"
                            v-model="payItem.language">
                            <el-option label="中文" value="zh_CN"/>
                            <el-option label="English" value="en"/>
                        </el-select>
                        <div v-if="payItem.languageFlag" class="isNotNullText">必填项不能为空</div>
                    </el-form-item>
                    <p class="star formTitle">支付协议</p>
                    <el-form-item>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows:20}"
                            v-model="payItem.textarea"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="savePayData">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
                <!--
                <el-tab-pane label="意见反馈" name="four">
                    <p class="star formTitle">语言版本</p>
                    <el-form-item>
                        <el-select
                            @change="changeLanguage(feedBackItem.language)"
                            v-model="feedBackItem.language">
                            <el-option label="中文" value="zh_CN"/>
                            <el-option label="English" value="en"/>
                        </el-select>
                        <div v-if="feedBackItem.languageFlag" class="isNotNullText">必填项不能为空</div>
                    </el-form-item>
                    <p class="star formTitle">意见反馈</p>
                    <el-form-item>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 5, maxRows:20}"
                            v-model="feedBackItem.textarea"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveFeedBackData">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
                -->
            </el-tabs>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "VIP_NOTICE",
        components: {Box},
        data() {
            return {
                // 当前选中的页签
                activeName: 'first',
                // VIP 公告表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    textarea: '', // VIP 公告
                },
                // 注册协议表单
                registerItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    textarea: '', // VIP 公告
                },
                // 支付协议表单
                payItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    textarea: '', // VIP 公告
                },
                // 意见反馈表单
                feedBackItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    textarea: '', // VIP 公告
                }
            }
        },
        methods: {
            // 校验语言
            changeLanguage(val) {
                var _t = this;
                if (_t.activeName === 'first') {
                    // 校验VIP 公告语言
                    if (val.trim() === '') {
                        _t.formItem.languageFlag = true;
                    } else {
                        _t.formItem.languageFlag = false;
                        _t.getData();
                    }
                } else if (_t.activeName === 'second') {
                    // 校验注册协议语言
                    if (val.trim() === '') {
                        _t.registerItem.languageFlag = true;
                    } else {
                        _t.registerItem.languageFlag = false;
                        _t.getRegisterData();
                    }
                } else if (_t.activeName === 'third') {
                    // 校验支付协议语言
                    if (val.trim() === '') {
                        _t.payItem.languageFlag = true;
                    } else {
                        _t.payItem.languageFlag = false;
                        _t.getPayItemData();
                    }
                } else if (_t.activeName === 'four') {
                    // 校验意见反馈语言
                    if (val.trim() === '') {
                        _t.feedBackItem.languageFlag = true;
                    } else {
                        _t.feedBackItem.languageFlag = false;
                        _t.getFeedBackData();
                    }
                }
            },
            // 获取VIP 公告数据
            getData() {
                var _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '2', // 0: 注册 1: 支付 2: VIP 公告
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                _t.formItem.id = res.data[0].id !== undefined ? res.data[0].id : '';
                                // VIP 公告
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    _t.formItem.textarea = res.data[0].ConfidentialNoticeContextStr;
                                }
                            } else {
                                _t.formItem.textarea = '';
                                _t.formItem.id = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.formItem.textarea = '';
                            _t.formItem.id = '';
                            break;
                        default:
                            _t.formItem.textarea = '';
                            _t.formItem.id = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存VIP 公告数据
            saveData() {
                var _t = this;
                // 校验VIP 公告不能为空
                if (_t.formItem.textarea.trim() === '') {
                    _t.$message.warning('VIP 公告不能为空!');
                }
                // 可以提交
                if (_t.formItem.textarea.trim() !== '' && _t.formItem.languageFlag === false) {
                    _t.$api.post('vip/saveConfidentiality', {
                        id: _t.formItem.id === '' ? null : _t.formItem.id, // id
                        vipId: '2', // 类型 0: 注册 1: 支付 2: VIP 公告
                        language: _t.formItem.language, // 语言标识
                        ConfidentialNoticeContext: _t.formItem.textarea.trim(), // VIP 公告
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
                                _t.getData();
                                break;
                            default: // 操作失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 获取注册协议数据
            getRegisterData() {
                var _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '0', // 0: 注册 1: 支付 2: VIP 公告
                    language: _t.registerItem.language, // 语言
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                _t.registerItem.id = res.data[0].id !== undefined ? res.data[0].id : '';
                                // 团队资料
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    _t.registerItem.textarea = res.data[0].ConfidentialNoticeContextStr;
                                }
                            } else {
                                _t.registerItem.textarea = '';
                                _t.registerItem.id = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.registerItem.textarea = '';
                            _t.registerItem.id = '';
                            break;
                        default:
                            _t.registerItem.textarea = '';
                            _t.registerItem.id = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存注册协议
            saveRegisterData() {
                var _t = this;
                // 校验注册协议不能为空
                if (_t.registerItem.textarea.trim() === '') {
                    _t.$message.warning('注册协议不能为空!');
                }
                // 可以提交
                if (_t.registerItem.textarea.trim() !== '' && _t.registerItem.languageFlag === false) {
                    _t.$api.post('vip/saveConfidentiality', {
                        id: _t.registerItem.id === '' ? null : _t.registerItem.id, // id
                        vipId: '0', // 类型 0: 注册 1: 支付 2: VIP 公告
                        language: _t.registerItem.language, // 语言标识
                        ConfidentialNoticeContext: _t.registerItem.textarea.trim(), // 注册协议
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
                                _t.getRegisterData();
                                break;
                            default: // 操作失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 获取支付协议数据
            getPayItemData() {
                var _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '1', // 0: 注册 1: 支付 2: VIP 公告
                    language: _t.payItem.language, // 语言
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                _t.payItem.id = res.data[0].id !== undefined ? res.data[0].id : '';
                                // 支付协议
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    _t.payItem.textarea = res.data[0].ConfidentialNoticeContextStr;
                                }
                            } else {
                                _t.payItem.textarea = '';
                                _t.payItem.id = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.payItem.textarea = '';
                            _t.payItem.id = '';
                            break;
                        default:
                            _t.payItem.textarea = '';
                            _t.payItem.id = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存支付协议
            savePayData() {
                var _t = this;
                // 校验支付协议不能为空
                if (_t.payItem.textarea.trim() === '') {
                    _t.$message.warning('支付协议不能为空!');
                }
                // 可以提交
                if (_t.payItem.textarea.trim() !== '' && _t.payItem.languageFlag === false) {
                    _t.$api.post('vip/saveConfidentiality', {
                        id: _t.payItem.id === '' ? null : _t.payItem.id, // id
                        vipId: '1', // 类型 0: 注册 1: 支付 2: VIP 公告
                        language: _t.payItem.language, // 语言标识
                        ConfidentialNoticeContext: _t.payItem.textarea.trim(), // 支付协议
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
                                _t.getPayItemData();
                                break;
                            default: // 操作失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 获取意见反馈
            getFeedBackData() {
                let _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '3', // 0: 注册 1: 支付 2: VIP 公告 3: 意见反馈
                    language: _t.feedBackItem.language, // 语言
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                _t.feedBackItem.id = res.data[0].id !== undefined ? res.data[0].id : '';
                                // 支付协议
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    _t.feedBackItem.textarea = res.data[0].ConfidentialNoticeContextStr;
                                }
                            } else {
                                _t.feedBackItem.textarea = '';
                                _t.feedBackItem.id = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.feedBackItem.textarea = '';
                            _t.feedBackItem.id = '';
                            break;
                        default:
                            _t.feedBackItem.textarea = '';
                            _t.feedBackItem.id = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存意见反馈
            saveFeedBackData(){
                let _t = this;
                // 校验支付协议不能为空
                if (_t.feedBackItem.textarea.trim() === '') {
                    _t.$message.warning('意见反馈不能为空!');
                }
                // 可以提交
                if (_t.feedBackItem.textarea.trim() !== '' && _t.feedBackItem.languageFlag === false) {
                    _t.$api.post('vip/saveConfidentiality', {
                        id: _t.feedBackItem.id === '' ? null : _t.feedBackItem.id, // id
                        vipId: '3', // 0: 注册 1: 支付 2: VIP 公告 3: 意见反馈
                        language: _t.feedBackItem.language, // 语言标识
                        ConfidentialNoticeContext: _t.feedBackItem.textarea.trim(), // 意见反馈
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
                                _t.getFeedBackData();
                                break;
                            default: // 操作失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            }
        },
        created() {
            var _t = this;
            _t.$store.commit('setLoading', true);
            // 获取VIP 公告数据
            _t.getData();
            // 获取注册协议数据
            _t.getRegisterData();
            // 获取支付协议数据
            _t.getPayItemData();
            // 获取意见反馈数据
            // _t.getFeedBackData();
        }
    }
</script>

<style>
    .noticeBox .el-tabs__header {
        margin-bottom: 0;
    }

    .noticeBox .el-tabs__content {
        padding: 20px 20px 0;
    }
</style>
