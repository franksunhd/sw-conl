<template>
    <Box>
        <!--表单-->
        <el-form :model="formItem">
            <p class="star formTitle">平台类别</p>
            <el-form-item>
                <el-select
                    @change="blurInput(formItem,'typeFlag',formItem.type)"
                    v-model="formItem.type"
                    placeholder="请选择平台类别"
                    clearable>
                    <el-option
                        v-for="(item,index) in typeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
                <div v-if="formItem.typeFlag" class="isNotNullText">必选项不能为空</div>
            </el-form-item>
            <p class="star formTitle">上传图片</p>
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
                    <div slot="tip" class="el-upload__tip">图片最大1M,只能上传png格式,且宽高一致,建议上传18px*18px</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">标题/名称(此名称将作为下拉框显示名称)</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    placeholder="请输入标题/名称"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item class="marBottom50 marginTop20">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button @click="addData" type="primary">提交</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "ADD_LOGO",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    accept: 'image/png',
                    imgUrl: '', // 图片
                    imgUrlFlag: false, //
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    title: '', // 名称
                    titleFlag: false, // 名称标识
                    type: '', // 平台类型
                    typeFlag: false, // 平台标识
                },
                // 类别
                typeList: [
                    {label: '社交平台', value: '1'},
                    {label: '音乐平台', value: '2'},
                ]
            }
        },
        methods: {
            // 点击返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: 'LOGO_MANAGE'});
            },
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 图片上传前
            beforeUploadImg(file) {
                var _t = this;
                // 校验是否是jpg jpeg png图片
                var isImg = file.type === 'image/png';
                if (!isImg) {
                    _t.$message.error('只能上传png格式的文件');
                }
                // 校验图片大小
                var isLt20M = file.size / 1024 / 1024 < 1;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于1M');
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
                var _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 图片上传成功
            imgUploadSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.imgUrl = val.url[0].filePath;
                    _t.formItem.imgUrlFlag = false;
                    _t.formItem.imgStatus = false;
                }
            },
            // 图片上传失败
            imgUploadError(err, file, fileList) {
                var _t = this;
                _t.formItem.imgUrlFlag = false;
                _t.formItem.imgStatus = false;
                _t.$message.error('图片上传失败!');
            },
            // 添加数据
            addData() {
                var _t = this;
                // 校验平台类型
                _t.blurInput(_t.formItem, 'typeFlag', _t.formItem.type);
                // 校验图片
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 可以提交
                if (_t.formItem.typeFlag === false
                    && _t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false) {
                    _t.$api.post('logo/saveLogo', {
                        logoName: _t.formItem.title.trim(), // 标题
                        logoType: _t.formItem.type, // 类型
                        logoAddress: _t.formItem.imgUrl, // 链接
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 添加成功
                                // 操作成功
                                _t.$alert(res.message, '温馨提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    _t.goBack();
                                    return false;
                                }).catch(() => {
                                    _t.goBack();
                                    return false;
                                });
                                break;
                            default: // 错误
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            }
        },
        created() {
            var _t = this;
            var equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
        }
    }
</script>

<style scoped>

</style>
