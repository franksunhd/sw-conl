<template>
    <Box>
        <el-form :model="formItem">
            <!--            <p class="star formTitle marBottom0">是否受版权保护：</p>-->
            <!--            <el-form-item class="marBottom10">-->
            <!--                <el-radio v-model="formItem.protect" :label="true">是</el-radio>-->
            <!--                <el-radio v-model="formItem.protect" :label="false">否</el-radio>-->
            <!--            </el-form-item>-->
            <div v-if="formItem.protect === true">
                <p class="star formTitle marBottom10">平台类型及地址：</p>
                <el-button @click="addType" class="marBottom10" icon="el-icon-plus" size="mini" type="primary">新增类型及地址
                </el-button>
                <el-form-item>
                    <div class="line_bg line_index marBottom10"
                         v-for="(item,index) in linkArr" :key="index">
                        <el-select
                            class="marBottom10"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            placeholder="请选择平台类型"
                            v-model="item.name"
                            clearable>
                            <el-option v-for="(val,i) in typeList" :key="i" :label="val.logoName"
                                       :value="val.logoAddress"/>
                        </el-select>
                        <div class="displayFlexRow marBottom10" :class="isWeb ? 'widthFixed' : 'widthAll'">
                            <el-input
                                class="flex_1 marRight10"
                                v-model="item.link"
                                placeholder="请输入链接地址"/>
                            <el-button @click="delType(item,index)" type="danger" size="mini" icon="el-icon-delete"/>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <p class="star formTitle marBottom10">上传封面图</p>
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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且宽高一致</div>
                </el-upload>
                <div class="isNotNullText">
                    <span v-if="formItem.imgUrlFlag">必传项不能为空</span>
                </div>
            </el-form-item>
            <div v-if="formItem.protect === false">
                <p class="star formTitle marBottom10">上传音频</p>
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
                            <img src="../../../../assets/img/music_icon.png" alt="">
                        </div>
                        <i v-else-if="formItem.songUrl === '' && formItem.songUrlStatus === false"
                           class="el-icon-upload"></i>
                        <el-progress
                            class="activity_progress"
                            v-if="formItem.songUrlStatus === true" type="circle"
                            :percentage="formItem.progressNumSong"/>
                        <div slot="tip" class="el-upload__tip">文件最大100M,只能上传mp3、m4a、wav音频格式文件</div>
                    </el-upload>
                    <div v-if="formItem.songUrlFlag" class="isNotNullText">必传项不能为空</div>
                </el-form-item>
                <p class="star formTitle marBottom10">歌词</p>
                <el-form-item>
                    <el-upload
                        class="musicUploader"
                        :action="this.$api.root() + 'upload/upload'"
                        name="file"
                        :show-file-list="false"
                        accept=".lrc"
                        :before-upload="beforeUploadLyrics"
                        :on-progress="uploadProcessLyrics"
                        :on-success="audioLyricsSuccess"
                        :on-error="audioLyricsError">
                        <div v-if="formItem.lyrics !== '' && formItem.lyrics !== null && formItem.lyricStatus === false"
                             class="music_avatar music_avatar_Img">
                            <img src="../../../../assets/img/music_icon.png" alt="">
                        </div>
                        <i v-else-if="formItem.lyrics === '' && formItem.lyricStatus === false"
                           class="el-icon-upload"></i>
                        <el-progress
                            class="activity_progress"
                            v-if="formItem.lyricStatus === true" type="circle"
                            :percentage="formItem.progressNumLyrics"/>
                        <div slot="tip" class="el-upload__tip">文件最大1M,只能上传lrc格式文件</div>
                    </el-upload>
                    <div v-if="formItem.lyricsFlag" class="isNotNullText">必传项不能为空</div>
                </el-form-item>
            </div>
            <p class="star formTitle marBottom10">歌曲名</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'songNameFlag',formItem.songName)"
                    v-model="formItem.songName"
                    maxlength="50"
                    placeholder="请输入歌曲名"/>
                <div v-if="formItem.songNameFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle marBottom10">歌手名(中文)</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'singerNameFlag',formItem.singerName)"
                    v-model="formItem.singerName"
                    maxlength="50"
                    placeholder="请输入中文歌手名"/>
                <div v-if="formItem.singerNameFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle marBottom10">歌手名(英文)</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'singerNameEnFlag',formItem.singerEnName)"
                    v-model="formItem.singerEnName"
                    maxlength="100"
                    placeholder="请输入英文歌手名"/>
                <div v-if="formItem.singerNameFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle marBottom10">发行时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'timeFlag',formItem.time)"
                    v-model="formItem.time"
                    type="date"
                    placeholder="选择时间">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle marBottom10">分组</p>
            <el-form-item>
                <el-select
                    clearable
                    @change="blurInput(formItem,'groupFlag',formItem.group)"
                    v-model="formItem.group">
                    <el-option
                        v-for="(item,index) in groupList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                </el-select>
                <div v-if="formItem.groupFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item label="同步到首页">
                <el-radio v-model="formItem.sync" :label="true">是</el-radio>
                <el-radio v-model="formItem.sync" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button class="marRight20" type="default" @click="goBack">返回</el-button>
                <el-button type="primary" @click="addData">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "ADDMUSIC",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    accept: 'image/*', // 上传图片格式
                    acceptAudio: 'audio/*', // 上传音频格式
                    imgUrl: '', // 封面图
                    songUrl: '', // 音频文件
                    songName: '', // 歌曲名称
                    lyrics: '', // 歌词
                    singerName: '', // 歌手名
                    time: '', // 发行时间
                    group: '', // 分组
                    sync: false, // 是否同步到首页
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    songUrlStatus: false, // 音频文件进度标识
                    progressNum: 0, // 封面图上传进度
                    progressNumSong: 0, // 音频文件进度
                    songUrlFlag: false, // 音频文件标识
                    songNameFlag: false, // 歌曲名标识
                    singerNameFlag: false, // 歌手名标识
                    timeFlag: false, // 发行时间标识
                    groupFlag: false, // 分组标识
                    lyricsFlag: false, // 歌词标识
                    lyricStatus: false, // 歌词状态
                    progressNumLyrics: 0, // 歌词进度标识
                    protect: true, // 是否受版权保护  false: 站内 true: 站外
                    link: '', // 外链地址
                    linkFlag: false, // 外链标识
                    type: '', // 平台类型
                    typeFlag: false, // 平台类型标识
                    singerEnName: '', // 英文名
                    singerNameEnFlag: false, // 英文标识
                },
                // 外链集合
                linkArr: [
                    {name: '', link: ''}, // 默认一行
                ],
                // 分组集合
                groupList: [
                    {label: 'personal', value: '0'},
                    {label: 'cooperative', value: '1'},
                ],
                // 平台类型
                typeList: []
            }
        },
        methods: {
            // 新增类型
            addType() {
                var _t = this;
                var Obj = new Object();
                if (_t.linkArr.length !== 0) {
                    // 不为空 判断上一个是否为空
                    if (_t.linkArr[_t.linkArr.length - 1].name.trim() !== '') {
                        Obj.name = '';
                        Obj.link = '';
                        _t.linkArr.push(Obj);
                    } else {
                        _t.$message.warning('您还有为空的输入!');
                    }
                } else {
                    // 为空直接添加
                    Obj.name = '';
                    Obj.link = '';
                    _t.linkArr.push(Obj);
                }
            },
            // 删除类型
            delType(item, index) {
                let _t = this;
                _t.linkArr.splice(index, 1);
            },
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
            // 发布音频前
            beforeUploadAudio(file) {
                var _t = this;
                var mvType = ['audio/mp3', 'audio/x-m4a', 'audio/wav'];
                var isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的音频格式');
                }
                // 校验视频大小
                var isLt100M = file.size / 1024 / 1024 < 100;
                if (!isLt100M) {
                    _t.$message.error('音频大小不能大于100M');
                }
                return isMv && isLt100M;
            },
            // 发布音频时
            uploadProcessAudio(event, file, fileList) {
                var _t = this;
                _t.formItem.songUrlStatus = true;
                _t.formItem.progressNumSong = parseInt(file.percentage);
            },
            // 发布音频成功
            audioUploadSuccess(val, file, fileList) {
                var _t = this;
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
                var _t = this;
                _t.formItem.songUrlFlag = false;
                _t.formItem.songUrlStatus = false;
                _t.$message.error('文件上传失败!');
            },
            // 上传歌词成功
            beforeUploadLyrics(file) {
                var _t = this;
                var isLrc = file.name.indexOf('.lrc') !== -1;
                if (!isLrc) {
                    _t.$message.error('请上传正确的lrc格式歌词文件!');
                }
                // 校验视频大小
                var isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    _t.$message.error('视频大小不能大于1M');
                }
                return isLrc && isLt1M;
            },
            // 上传歌词时
            uploadProcessLyrics(event, file, fileList) {
                var _t = this;
                _t.formItem.lyricStatus = true;
                _t.formItem.progressNumLyrics = parseInt(file.percentage);
            },
            // 上传歌词成功
            audioLyricsSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.lyrics = _t.$api.imgUrl() + val.url[0].filePath;
                    _t.formItem.lyricsFlag = false;
                    _t.formItem.lyricStatus = false;
                } else {
                    _t.formItem.lyricsFlag = false;
                    _t.formItem.lyricStatus = false;
                    _t.$message.error('歌词文件上传失败!');
                }
            },
            //歌词上传失败
            audioLyricsError(err, file, fileList) {
                var _t = this;
                _t.formItem.lyricsFlag = false;
                _t.formItem.lyricStatus = false;
                _t.$message.error('歌词文件上传失败!');
            },
            // 点击发布按钮
            addData() {
                var _t = this;
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验歌曲名及歌手名
                _t.blurInput(_t.formItem, 'songNameFlag', _t.formItem.songName);
                _t.blurInput(_t.formItem, 'singerNameFlag', _t.formItem.singerName);
                _t.blurInput(_t.formItem, 'singerNameEnFlag', _t.formItem.singerEnName);
                // 校验发行时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 校验分组
                _t.blurInput(_t.formItem, 'groupFlag', _t.formItem.group);
                // 受版权保护 需要校验链接地址及类型
                if (_t.formItem.protect === true) {
                    // 校验外链平台类型
                    var linkArr = new Array();
                    var isError = 0;
                    _t.linkArr.forEach((item) => {
                        // 不为空去解析
                        var Obj = new Object();
                        if (item.name.trim() !== '' && item.link.trim() !== '') {
                            Obj.k = item.name.trim(); // k 代表类型
                            Obj.v = item.link.trim(); // v 代表链接
                            linkArr.push(Obj);
                        } else {
                            isError++;
                        }
                    });
                    // 校验是否通过
                    if (isError !== 0) {
                        _t.$message.warning('您有类型或链接地址为空,请检查!');
                        return;
                    }
                } else {
                    // 公开 校验音频和歌词
                    // 校验音频
                    _t.blurInput(_t.formItem, 'songUrlFlag', _t.formItem.songUrl);
                    // 校验歌词是否为空
                    _t.blurInput(_t.formItem, 'lyricsFlag', _t.formItem.lyrics);
                }
                // 可以提交
                if ((_t.formItem.protect === true
                    && isError === 0
                    && linkArr.length !== 0
                    && _t.formItem.imgUrlFlag === false
                    && _t.formItem.songNameFlag === false
                    && _t.formItem.singerNameFlag === false
                    && _t.formItem.singerNameEnFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.groupFlag === false)
                    || (_t.formItem.protect === false
                        && _t.formItem.songUrlFlag === false
                        && _t.formItem.lyricsFlag === false
                        && _t.formItem.imgUrlFlag === false
                        && _t.formItem.songNameFlag === false
                        && _t.formItem.singerNameFlag === false
                        && _t.formItem.singerNameEnFlag === false
                        && _t.formItem.timeFlag === false
                        && _t.formItem.groupFlag === false)) {
                    var singer = new Array();
                    singer[0] = _t.formItem.singerName.trim();
                    singer[1] = _t.formItem.singerEnName.trim();
                    _t.$api.post('music/saveMusic/push', {
                        id: null,
                        contenId: null,
                        thumbnail: _t.formItem.imgUrl, // 封面图
                        musicPath: _t.formItem.songUrl.trim() === '' ? null : _t.formItem.songUrl.trim(), // 音频文件路径
                        musicName: _t.formItem.songName.trim(), // 歌曲名称
                        publishTime: new Date(_t.formItem.time).getTime(), // 发行时间
                        singer: JSON.stringify(singer), // 歌手名
                        grouping: _t.formItem.group, // 分组
                        hourLong: null, // 时长
                        lyrics: _t.formItem.lyrics.trim() === '' ? null : _t.formItem.lyrics.trim(),
                        copyrightProtection: _t.formItem.protect === true ? 0 : 1, // 是否受版权保护, 0: 受 1:公开
                        musicLike: _t.formItem.protect === true ? JSON.stringify(linkArr) : null, // 外链地址
                        showHome: _t.formItem.sync === true ? 1 : 0,  // 是否同步首页 1:同步 0:不同步
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
            },
            // 获取外链平台数据
            getTypeData() {
                var _t = this;
                _t.$api.post('logo/listMusicLogo', {
                    logoType: '2', // 1: 社交平台 2: 音乐平台
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null) {
                                _t.typeList = res.data;
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        created() {
            var _t = this;
            var equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.getTypeData();
        }
    }
</script>

<style scoped>

</style>
