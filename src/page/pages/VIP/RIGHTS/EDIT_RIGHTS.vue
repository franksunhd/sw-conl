<template>
    <Box>
        <el-form :model="formItem">
            <p class="star formTitle">语言版本</p>
            <el-form-item>
                <el-select
                    @change="blurInput(formItem,'languageFlag',formItem.language)"
                    v-model="formItem.language">
                    <el-option label="中文" value="zh_CN"/>
                    <el-option label="English" value="en"/>
                </el-select>
                <div v-if="formItem.languageFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">图标</p>
            <el-form-item>
                <el-upload
                    class="musicUploader"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    :accept="formItem.accept"
                    :show-file-list="false"
                    :before-upload="beforeUploadImg"
                    :on-progress="uploadProcessImg"
                    :on-success="imgUploadSuccess"
                    :on-error="imgUploadError">
                    <img
                        v-if="formItem.imgUrl !== '' && formItem.imgUrl !== null && formItem.imgStatus === false"
                        :src="this.$api.imgUrl() + formItem.imgUrl"
                        class="music_avatar">
                    <i v-else-if="formItem.imgUrl === '' && formItem.imgStatus === false" class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.imgStatus === true" type="circle"
                        :percentage="formItem.progressNum"/>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传png格式,且宽高一致</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">名称</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    placeholder="请输入名称"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">描述</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'descriptionFlag',formItem.description)"
                    v-model="formItem.description"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    placeholder="请输入描述"/>
                <div v-if="formItem.descriptionFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item class="marBottom50 marginTop20">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button @click="addData" type="primary">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "EDIT_RIGHTS",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    id: null, // id
                    title: '', // 标题
                    description: '', // 描述
                    imgUrl: '', // 图片
                    accept: 'image/png', // 图片上传格式
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    titleFlag: false, // 标题标识
                    descriptionFlag: false, // 描述标识
                    language: '', // 语言
                    languageFlag: false, // 语言标识
                }
            }
        },
        methods: {
            // 获取详情数据
            getData() {
                let _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.get('vipRights/getVipRightsById/' + _t.formItem.id, {}, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                let resData = res.data;
                                // 标题
                                _t.formItem.title = resData.title !== undefined ? resData.title : '';
                                // 描述
                                _t.formItem.description = resData.description !== undefined ? resData.description : '';
                                // 图片
                                _t.formItem.imgUrl = resData.iconPath !== undefined ? resData.iconPath : '';
                                // 语言
                                _t.formItem.language = resData.language !== undefined ? resData.language : '';
                            }
                            break;
                        default: // 查询失败
                            break;
                    }
                });
            },
            // 点击返回按钮
            goBack() {
                let _t = this;
                _t.$router.push({name: 'RIGHTS'});
            },
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 图片上传前
            beforeUploadImg(file) {
                let _t = this;
                // 校验是否是jpg jpeg png图片
                let isImg = file.type === 'image/png';
                if (!isImg) {
                    _t.$message.error('只能上传png格式的文件');
                }
                // 校验图片大小
                let isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于20M');
                }
                // 校验图片的宽高
                const isSize = new Promise(function (resolve, reject) {
                    let _URL = window.URL || window.webkitURL;
                    let img = new Image();
                    img.onload = function () {
                        let valid = img.width === img.height;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,宽高必须相等!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // 图片上传时
            uploadProcessImg(event, file, fileList) {
                let _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 图片上传成功
            imgUploadSuccess(val, file, fileList) {
                let _t = this;
                if (val.status === 200) {
                    _t.formItem.imgUrl = val.url[0].filePath;
                    _t.formItem.imgUrlFlag = false;
                    _t.formItem.imgStatus = false;
                }
            },
            // 图片上传失败
            imgUploadError(err, file, fileList) {
                let _t = this;
                _t.formItem.imgUrlFlag = false;
                _t.formItem.imgStatus = false;
                _t.$message.error('图片上传失败!');
            },
            // 点击发布按钮
            addData() {
                let _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验图标
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验名称
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验描述
                _t.blurInput(_t.formItem, 'descriptionFlag', _t.formItem.description);
                // 可以提交
                if (_t.formItem.languageFlag === false
                    && _t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.descriptionFlag === false) {
                    _t.$api.post('vipRights/saveVipRights', {
                        id: _t.formItem.id,  // id
                        language: _t.formItem.language, // 语言
                        iconPath: _t.formItem.imgUrl, // 图标路径
                        title: _t.formItem.title.trim(), // 标题
                        description: _t.formItem.description.trim(), // 描述
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$alert(res.message, '温馨提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    _t.goBack();
                                }).catch(() => {
                                    _t.goBack();
                                });
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
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            let id = _t.$route.params.TEAM_WANG_RIGHTS_ID ? _t.$route.params.TEAM_WANG_RIGHTS_ID : localStorage.getItem('TEAM_WANG_RIGHTS_ID');
            if (id !== null && id !== 'null') {
                _t.formItem.id = id;
                _t.getData();
            }
        }
    }
</script>

<style scoped>

</style>
