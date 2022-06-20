<template>
    <Box>
        <el-form :model="formItem">
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
            <p class="star formTitle">早年经历</p>
            <el-form-item>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 5}"
                    v-model="formItem.early"/>
            </el-form-item>
            <p class="star formTitle">演艺经历</p>
            <el-form-item>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 5}"
                    v-model="formItem.perform"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "PERSONAL_DATA",
        components: {Box},
        data() {
            return {
                // 表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    early: '', // 早年经历
                    perform: '', // 演艺经历
                }
            }
        },
        methods: {
            // 校验语言
            changeLanguage(val) {
                var _t = this;
                if (val.trim() === '') {
                    _t.formItem.languageFlag = true;
                } else {
                    _t.formItem.languageFlag = false;
                    _t.getData();
                }
            },
            // 获取旧数据
            getData() {
                var _t = this;
                _t.$api.post('artist/getArtist', {
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200:
                            if (res.data.length !== 0) {
                                _t.formItem.id = res.data[0].id !== undefined ? res.data[0].id : '';
                                // 早年经历
                                if (res.data[0].earlyExperienceStr !== undefined && res.data[0].earlyExperienceStr !== null) {
                                    _t.formItem.early = res.data[0].earlyExperienceStr;
                                }
                                // 演艺经历
                                if (res.data[0].performingExperienceStr !== undefined && res.data[0].performingExperienceStr !== null) {
                                    _t.formItem.perform = res.data[0].performingExperienceStr;
                                }
                            } else {
                                _t.formItem.early = '';
                                _t.formItem.perform = '';
                            }
                            break;
                        default:
                            _t.formItem.early = '';
                            _t.formItem.perform = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存数据
            saveData() {
                var _t = this;
                // 校验早年经历不能为空
                if (_t.formItem.early.trim() === '') {
                    _t.$message.error('早年经历不能为空!');
                }
                // 校验演艺经历不能为空
                if (_t.formItem.perform.trim() === '') {
                    _t.$message.error('演艺经历不能为空!');
                }
                // 可以提交
                if (_t.formItem.early.trim() !== ''
                    && _t.formItem.perform.trim() !== ''
                    && _t.formItem.languageFlag === false) {
                    _t.$api.post('artist/updateArtist', {
                        id: _t.formItem.id,// id
                        language: _t.formItem.language, // 语言标识
                        early: _t.formItem.early.trim(), // 早年经历
                        perform: _t.formItem.perform.trim(), // 演艺经历
                        team: null, // 团队资料
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
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
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
