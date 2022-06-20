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
            <p class="star formTitle">上传封面图</p>
            <el-form-item>
                <el-upload
                    class="uploadWeb"
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
                        class="swiper_avatar">
                    <i v-else-if="formItem.imgUrl === '' && formItem.imgStatus === false" class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.imgStatus === true" type="circle"
                        :percentage="formItem.progressNum"/>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低250像素</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">行程标题</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    placeholder="请输入标题"
                    :maxlength="formItem.language === 'zh_CN' ? 30 : 90"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">行程时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'timeFlag',formItem.time)"
                    v-model="formItem.time"
                    type="datetime"
                    placeholder="选择时间">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">行程地点</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'addressFlag',formItem.address)"
                    v-model="formItem.address"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    placeholder="请输入详细地址"/>
                <div v-if="formItem.addressFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button @click="addData" type="primary">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "ADDTRAVEL",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    accept: 'image/*', // 图片上传格式
                    imgUrl: '', // 封面图
                    title: '', // 行程标题
                    time: '', // 选中时间
                    province: '',// 选中省
                    city: '', // 选中市
                    address: '', // 详细地址
                    sync: true, // 国内还是国外 true:国内 false:国外
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    titleFlag: false, // 行程标题标识
                    timeFlag: false, // 行程时间标识
                    addressFlag: false, // 行程地点标识
                    addressTip: '', // 行程地点提示
                },
            }
        },
        methods: {
            // 点击返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: 'CONTENT'});
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
                var isImg = /^image\/(jpeg|png|jpg)$/.test(file.type);
                if (!isImg) {
                    _t.$message.error('只能上传jpeg、png、jpg格式的文件');
                }
                // 校验图片大小
                var isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于20M');
                }
                // 校验图片的宽高
                const isSize = new Promise(function (resolve, reject) {
                    let _URL = window.URL || window.webkitURL;
                    let img = new Image();
                    img.onload = function () {
                        let valid = img.height >= 250;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最低250像素!');
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
            // 发布按钮
            addData() {
                var _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验行程标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验行程时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 校验行程地点
                _t.blurInput(_t.formItem, 'addressFlag', _t.formItem.address);
                // 可以发布
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.languageFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.addressFlag === false) {
                    _t.$api.post('travelInfo/saveTravel/push', {
                        id: null,
                        contenId: null,
                        language: _t.formItem.language, // 语言
                        thumbnail: _t.formItem.imgUrl, // 封面图
                        travelTitle: _t.formItem.title.trim(), // 标题
                        travelTime: _t.formItem.time === '' ? null : new Date(_t.formItem.time).getTime(), // 行程时间
                        travelAddress: _t.formItem.address.trim(), // 行程地点
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 发布人id
                    }, function (res) {
                        switch (res.status) {
                            case 200:
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
                            default:
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
