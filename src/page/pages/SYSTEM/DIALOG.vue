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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式</div>
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
                    :before-upload="beforeUploadMV"
                    :on-progress="uploadProcessMV"
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
            <el-form-item class="marBottom50">
                <el-button @click="addData" type="primary">保存</el-button>
                <el-button @click="delData" type="danger">清空数据</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "DIALOG",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 查询表单
                formItem: {
                    id: '', // id
                    accept: 'image/*', // 上传图片格式
                    mvAccept: 'video/*', // 上传视频格式
                    imgUrl: '', // 封面图
                    mvUrl: '', // 视频文件
                    title: '', // 标题
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressImgNum: 0, // 封面图上传进度
                    mvUrlFlag: false, // mv标识
                    mvUrlStatus: false, // mv视频进度标识
                    titleFlag: false, // 标题标识
                }
            }
        },
        methods: {
            // 图片上传前
            beforeUploadImg(file) {
                let _t = this;
                // 校验是否是jpg jpeg png图片
                let isImg = /^image\/(jpeg|png|jpg)$/.test(file.type);
                if (!isImg) {
                    _t.$message.error('只能上传jpeg、png、jpg格式的文件');
                }
                // 校验图片大小
                let isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于20M');
                }
                return isImg && isLt20M;
            },
            // 图片上传时
            uploadProcessImg(event, file, fileList) {
                let _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressImgNum = parseInt(file.percentage);
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
            // 上传mv前
            beforeUploadMV(file) {
                let _t = this;
                let mvType = _t.$api.mvType();
                let isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的视频格式');
                }
                // 校验视频大小
                let isLt100M = file.size / 1024 / 1024 < 100;
                if (!isLt100M) {
                    _t.$message.error('视频大小不能大于100M');
                }
                return isMv && isLt100M;
            },
            // 上传过程中
            uploadProcessMV(event, file, fileList) {
                let _t = this;
                _t.formItem.mvUrlStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 上传mv成功后
            mvUploadSuccess(val, file, fileList) {
                let _t = this;
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
                let _t = this;
                _t.formItem.mvUrlStatus = false;
                _t.formItem.mvUrlFlag = false;
                _t.$message.error('视频上传失败,请重新上传!');
            },
            // 校验不能为空
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 查询活动数据
            getData() {
                let _t = this;
                _t.$api.get('popup/getPopupMv', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                let resData = res.data[0];
                                // id
                                _t.formItem.id = resData.id !== undefined && resData.id !== null ? resData.id : '';
                                // 缩略图
                                _t.formItem.imgUrl = resData.thumbnail !== undefined && resData.thumbnail !== null ? resData.thumbnail : '';
                                // 标题
                                _t.formItem.title = resData.albumName !== undefined && resData.albumName !== null ? resData.albumName : '';
                                // 视频
                                _t.formItem.mvUrl = resData.mvPath !== undefined && resData.mvPath !== null ? resData.mvPath : '';
                            }
                            break;
                        case 204: // 暂无数据
                            _t.formItem.id = '';
                            _t.formItem.imgUrl = '';
                            _t.formItem.mvUrl = '';
                            _t.formItem.title = '';
                            break;
                        default: // 异常
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 保存按钮
            addData() {
                let _t = this;
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验缩略图
                _t.blurInput(_t.formItem, 'mvUrlFlag', _t.formItem.mvUrl);
                // 校验标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.mvUrlFlag === false
                    && _t.formItem.titleFlag === false) {
                    _t.$api.post('popup/save', {
                        id: _t.formItem.id === '' ? null : _t.formItem.id,
                        thumbnail: _t.formItem.imgUrl.trim() === '' ? null : _t.formItem.imgUrl.trim(), // 缩略图
                        albumName: _t.formItem.title.trim() === '' ? null : _t.formItem.title.trim(), // 标题
                        mvPath: _t.formItem.mvUrl.trim() === '' ? null : _t.formItem.mvUrl.trim(), // 视频路径
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 成功
                                _t.$message.success('保存成功!');
                                _t.getData();
                                break;
                            default: // 异常
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 清空数据接口
            delData() {
                let _t = this;
                _t.$confirm('确认清空数据吗?', '温馨提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (_t.formItem.id !== '') {
                        _t.$api.delete('popup/deletePopupMv/' + _t.formItem.id, {}, function (res) {
                            switch (res.status) {
                                case 200: // 删除成功
                                    _t.$message.success('删除成功');
                                    _t.getData();
                                    break;
                                default: // 删除异常
                                    _t.$message.error(res.message);
                                    break;
                            }
                        });
                    }
                }).catch(() => {
                    return false;
                });
            },
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
