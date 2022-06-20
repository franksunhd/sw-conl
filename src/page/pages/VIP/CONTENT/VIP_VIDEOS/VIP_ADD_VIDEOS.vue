<template>
    <Box>
        <el-form :model="formItem">
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
                    <img v-if="formItem.imgUrl !== '' && formItem.imgUrl !== null && formItem.imgStatus === false"
                         :src="this.$api.imgUrl() + formItem.imgUrl"
                         class="swiper_avatar">
                    <i v-else-if="formItem.imgUrl === '' && formItem.imgStatus === false" class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.imgStatus === true" type="circle"
                        :percentage="formItem.progressImgNum"/>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低430像素</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">上传视频</p>
            <el-form-item>
                <el-upload
                    class="uploadWeb"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    :show-file-list="false"
                    :accept="formItem.mvAccept"
                    :on-progress="uploadProcessMV"
                    :before-upload="beforeUploadMV"
                    :on-success="mvUploadSuccess"
                    :on-error="mvUploadError">
                    <video
                        v-if="formItem.mvUrl !=='' && formItem.mvUrlStatus === false"
                        :src="this.$api.imgUrl() + formItem.mvUrl"
                        class="mv_avatar"
                        controls="controls">您的浏览器不支持视频播放
                    </video>
                    <i v-else-if="formItem.mvUrl ==='' && formItem.mvUrlStatus === false" class="el-icon-plus"></i>
                    <el-progress
                        v-if="formItem.mvUrlStatus === true" type="circle"
                        style="margin-top: 10px;"
                        :percentage="formItem.progressNum"/>
                    <div slot="tip" class="el-upload__tip">文件最大100M,只能上传mp4、ogg、flv、avi、wmv、rmvb、mov格式</div>
                </el-upload>
                <div v-if="formItem.mvUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">标题</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem, 'titleFlag', formItem.title)"
                    v-model="formItem.title"
                    maxlength="30"
                    placeholder="请输入标题"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">时长</p>
            <el-form-item>
                <el-select
                    :class="isWeb ? 'widthFixed' : 'widthHalf'"
                    v-model="formItem.minutes"
                    placeholder="请选择分">
                    <el-option
                        v-for="item in minutesList"
                        :key="item"
                        :label="item + ' 分'"
                        :value="item"/>
                </el-select>
                <el-select
                    :class="isWeb ? 'widthFixed' : 'widthHalf'"
                    v-model="formItem.seconds"
                    placeholder="请选择秒">
                    <el-option
                        v-for="item in secondsList"
                        :key="item"
                        :label="item + ' 秒'"
                        :value="item"/>
                </el-select>
                <div v-if="formItem.timeLengthFlag" class="isNotNullText">分和秒均不能为空</div>
            </el-form-item>
            <p class="star formTitle">时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem, 'timeFlag', formItem.time)"
                    v-model="formItem.time"
                    type="date"
                    placeholder="选择时间">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button @click="addData" type="primary">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../../components/Box";

    export default {
        name: "VIP_ADD_VIDEOS",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    accept: 'image/*', // 上传图片格式
                    mvAccept: 'video/*', // 上传视频格式
                    imgUrl: '', // 封面图
                    mvUrl: '', // 视频文件
                    title: '', // mv名称
                    minutes: '00', // 分钟
                    seconds: '00', // 秒
                    time: '', // 发行时间
                    progressNum: 0, // 视频进度值
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressImgNum: 0, // 封面图上传进度
                    mvUrlFlag: false, // mv标识
                    mvUrlStatus: false, // mv视频进度标识
                    titleFlag: false, // 标题标识
                    timeLengthFlag: false, // 时长标识
                    timeFlag: false, // 发行时间标识
                },
                minutesList: [], // 分钟
                secondsList: [], // 秒
            }
        },
        methods: {
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
                        let valid = img.height >= 430;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最低430像素!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // 图片上传时
            uploadProcessImg(event, file, fileList) {
                var _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressImgNum = parseInt(file.percentage);
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
            // 初始化分钟和秒数
            initData(length, flag) {
                var _t = this;
                var arr = new Array();
                for (var i = 0; i <= length; i++) {
                    arr.push(i < 10 ? '0' + i : i.toString());
                }
                _t[flag] = arr;
            },
            // 上传mv前
            beforeUploadMV(file) {
                var _t = this;
                var mvType = _t.$api.mvType();
                var isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的视频格式');
                }
                // 校验视频大小
                var isLt100M = file.size / 1024 / 1024 < 100;
                if (!isLt100M) {
                    _t.$message.error('视频大小不能大于100M');
                }
                return isMv && isLt100M;
            },
            // 上传过程中
            uploadProcessMV(event, file, fileList) {
                var _t = this;
                _t.formItem.mvUrlStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 上传mv成功后
            mvUploadSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.mvUrl = val.url[0].filePath;
                } else {
                    _t.$message.error('视频上传失败,请重新上传!');
                }
                _t.formItem.mvUrlStatus = false;
                _t.formItem.mvUrlFlag = false;
            },
            // 上传mv失败后
            mvUploadError(err, file, fileList) {
                var _t = this;
                _t.formItem.mvUrlStatus = false;
                _t.formItem.mvUrlFlag = false;
                _t.$message.error('视频上传失败,请重新上传!');
            },
            // 返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: "VIP_CONTENT"});
            },
            // 校验不能为空
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 发布按钮
            addData() {
                var _t = this;
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验视频文件
                _t.blurInput(_t.formItem, 'mvUrlFlag', _t.formItem.mvUrl);
                // 校验名称
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验发行时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.mvUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.timeLengthFlag === false
                    && _t.formItem.timeFlag === false) {
                    var videoLong = 0; // 时长
                    videoLong = _t.formItem.minutes * 60 + _t.formItem.seconds * 1;
                    _t.$api.post('video/saveMusicVideo/push', {
                        id: null,
                        contenId: null,
                        thumbnail: _t.formItem.imgUrl, // 缩略图
                        videoName: _t.formItem.title.trim(), // 标题名称
                        videoPath: _t.formItem.mvUrl, // 视频路径
                        singer: '王嘉尔', // 歌手
                        videoTime: videoLong, // 时长
                        releaseTime: new Date(_t.formItem.time).getTime(), // 发行时间
                        showHome: 2, // 发布模块 2: vip mv
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 发布人姓名
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
                                }).catch(() => {
                                    _t.goBack();
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
            // 初始化分钟下拉框和秒下拉框
            _t.initData(100, 'minutesList');
            _t.initData(59, 'secondsList');
        }
    }
</script>

<style scoped>

</style>
