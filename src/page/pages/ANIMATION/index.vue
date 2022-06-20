<template>
    <Box>
        <!--图片文件-->
        <el-form :model="formItem">
            <p class="star formTitle">图片文件</p>
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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传gif图,且宽1920px、高1080px</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <!--音频文件-->
            <p class="star formTitle">音频文件</p>
            <el-form-item>
                <el-upload
                    class="musicUploader"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    :show-file-list="false"
                    :accept="formItem.acceptAudio"
                    :before-upload="beforeUploadAudio"
                    :on-progress="uploadProcessAudio"
                    :on-success="audioUploadSuccess"
                    :on-error="audioUploadError">
                    <div
                        v-if="formItem.songUrl !== '' && formItem.songUrl !== null && formItem.songUrlStatus === false"
                        class="music_avatar music_avatar_Img">
                        <img src="../../../assets/img/music_icon.png" alt="">
                    </div>
                    <i v-else-if="formItem.songUrl === '' && formItem.songUrlStatus === false"
                       class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.songUrlStatus === true" type="circle"
                        :percentage="formItem.progressNumSong"/>
                    <div slot="tip" class="el-upload__tip">文件最大10M,只能上传mp3、m4a、wav音频格式文件</div>
                </el-upload>
                <div v-if="formItem.songUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button type="primary" @click="addData">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "ANIMATION",
        components: {Box},
        data() {
            return {
                // 查询表单
                formItem: {
                    accept: 'image/gif', // 上传图片格式
                    acceptAudio: 'audio/*', // 上传音频格式
                    imgUrl: '', // 图片
                    songUrl: '', // 音频文件
                    imgUrlFlag: false, // 图片标识
                    songUrlFlag: false, // 音频文件标识
                    imgStatus: false, // 图片上传进度标识
                    songUrlStatus: false, // 音频文件进度标识
                    progressImgNum: 0, // 图片上传进度值
                    progressNumSong: 0, // 音频文件进度
                },
            }
        },
        methods: {
            // 图片上传前
            beforeUploadImg(file) {
                let _t = this;
                // 校验是否是gif图片
                let isImg = file.type === 'image/gif';
                if (!isImg) {
                    _t.$message.error('只能上传gif格式的文件');
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
                        let valid = img.width === 1920 && img.height === 1080;
                        valid ? resolve() : reject();
                    };
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
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
            // 发布音频前
            beforeUploadAudio(file) {
                let _t = this;
                let mvType = ['audio/mp3', 'audio/x-m4a', 'audio/wav'];
                let isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的音频格式');
                }
                // 校验视频大小
                let isLt100M = file.size / 1024 / 1024 < 10;
                if (!isLt100M) {
                    _t.$message.error('音频大小不能大于10M');
                }
                return isMv && isLt100M;
            },
            // 发布音频时
            uploadProcessAudio(event, file, fileList) {
                let _t = this;
                _t.formItem.songUrlStatus = true;
                _t.formItem.progressNumSong = parseInt(file.percentage);
            },
            // 发布音频成功
            audioUploadSuccess(val, file, fileList) {
                let _t = this;
                if (val.status === 200) {
                    _t.formItem.songUrl = val.url[0].filePath;
                    _t.formItem.songUrlFlag = false;
                    _t.formItem.songUrlStatus = false;
                } else {
                    _t.formItem.songUrlFlag = false;
                    _t.formItem.songUrlStatus = false;
                    _t.$message.error('文件上传失败!');
                }
            },
            // 发布音频失败
            audioUploadError(err, file, fileList) {
                let _t = this;
                _t.formItem.songUrlFlag = false;
                _t.formItem.songUrlStatus = false;
                _t.$message.error('文件上传失败!');
            },
            // 查询表格数据
            getData() {
                let _t = this;
                _t.$api.get('vip/indexDrawing/11001100', {}, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                _t.formItem.imgUrl = res.data.ConfidentialNoticeContextStr !== undefined && res.data.ConfidentialNoticeContextStr !== null ? res.data.ConfidentialNoticeContextStr : ''; // 图片文件
                                _t.formItem.songUrl = res.data.vipId !== undefined && res.data.vipId !== null ? res.data.vipId : ''; // 图片文件
                            }
                            break;
                        default: // 查询失败
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 校验是否为空
            blurInput(item, flag, val) {
                item[flag] = val.trim() === '' ? true : false;
            },
            // 点击发布按钮
            addData() {
                let _t = this;
                // 校验图片文件
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验音频文件
                _t.blurInput(_t.formItem, 'songUrlFlag', _t.formItem.songUrl);
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.songUrlFlag === false) {
                    _t.$api.post('vip/saveIndexDrawing', {
                        id: 11001100, // 固定id
                        ConfidentialNoticeContext: _t.formItem.imgUrl.trim(), // 动画链接
                        vipId: _t.formItem.songUrl.trim(), // 音频链接
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 成功
                                _t.$message.success('保存成功');
                                break;
                            default: // 保存失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            }
        },
        created() {
            let _t = this;
            _t.$store.commit('setLoading', true);
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
