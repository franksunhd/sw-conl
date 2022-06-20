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
            <p class="star formTitle">关于 TEAM WANG</p>
            <el-form-item>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 5}"
                    v-model="formItem.team"/>
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
        name: "TEAM_DATA",
        components: {Box},
        data() {
            return {
                // 表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    id: '', // 数据id
                    team: '', // 团队资料
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
                                // 团队资料
                                if (res.data[0].autobioGraphyStr !== undefined && res.data[0].autobioGraphyStr !== null) {
                                    _t.formItem.team = res.data[0].autobioGraphyStr;
                                }
                            } else {
                                _t.formItem.team = '';
                            }
                            break;
                        default:
                            _t.formItem.team = '';
                            _t.$message.error('查询失败');
                            break;
                    }
                });
            },
            // 保存数据
            saveData() {
                var _t = this;
                // 校验团队资料不能为空
                if (_t.formItem.team.trim() === '') {
                    _t.$message.error('资料不能为空!');
                }
                // 可以提交
                if (_t.formItem.team.trim() !== '' && _t.formItem.languageFlag === false) {
                    _t.$api.post('artist/updateArtist', {
                        id: _t.formItem.id,// id
                        language: _t.formItem.language, // 语言标识
                        early: null, // 早年经历
                        perform: null, // 演艺经历
                        team: _t.formItem.team.trim(), // 团队资料
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
