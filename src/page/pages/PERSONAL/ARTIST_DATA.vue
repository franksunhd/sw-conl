<template>
    <Box>
        <el-form class="advocacy_Box" :model="formItem">
            <p class="star formTitle">艺人头像</p>
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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且宽145像素*高170像素</div>
                </el-upload>
                <div class="isNotNullText">
                    <span v-if="formItem.imgUrlFlag">必传项不能为空</span>
                </div>
            </el-form-item>
            <p class="star formTitle marBottom0">社交网站及链接</p>
            <el-form-item class="marBottom0">
                <el-button @click="addType" class="marBottom10" type="primary" icon="el-icon-plus" size="mini">新增社交网站
                </el-button>
                <div
                    class="line_bg line_index marBottom10"
                    v-for="(item,index) in listData" :key="index">
                    <el-select
                        class="marBottom10"
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        placeholder="请选择社交网站类型"
                        v-model="item.headPortrait"
                        clearable>
                        <el-option v-for="(val,i) in typeList" :key="i" :label="val.logoName" :value="val.logoAddress"/>
                    </el-select>
                    <br>
                    <div class="displayFlexRow marBottom10" :class="isWeb ? 'widthFixed' : 'widthAll'">
                        <el-input
                            class="flex_1 marRight10"
                            v-model="item.sociallatform"
                            placeholder="请输入链接地址"/>
                        <el-button @click="delType(item,index)" type="danger" size="mini" icon="el-icon-delete"/>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addData">保存</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../components/Box";

    export default {
        name: "ARTIST_DATA",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 表单
                formItem: {
                    accept: 'image/*', // 上传图片格式
                    imgUrl: '', // 封面图
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                },
                // 社交网站集合
                typeList: [],
                // 用户添加的社交网站集合
                listData: []
            }
        },
        methods: {
            // 添加网站类型
            addType() {
                let _t = this;
                let Obj = new Object();
                if (_t.listData.length !== 0) {
                    // 不为空 判断上一个是否为空
                    if (_t.listData[_t.listData.length - 1].headPortrait.trim() !== '') {
                        Obj.headPortrait = '';
                        Obj.sociallatform = '';
                        _t.listData.push(Obj);
                    } else {
                        _t.$message.warning('您还有为空的选择!');
                    }
                } else {
                    // 为空直接添加
                    Obj.headPortrait = '';
                    Obj.sociallatform = '';
                    _t.listData.push(Obj);
                }
            },
            // 删除网站类型
            delType(item, index) {
                let _t = this;
                _t.listData.splice(index, 1);
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
                        let valid = img.width === 145 && img.height === 170;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,宽145像素*高170像素!');
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
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 保存艺人资料
            addData() {
                let _t = this;
                // 校验社交网站及链接
                var linkArr = new Array();
                var isError = 0;
                _t.listData.forEach((item) => {
                    // 不为空去解析
                    var Obj = new Object();
                    if (item.headPortrait.trim() !== '') {
                        Obj.judgeMark = '1'; // 个人社交
                        Obj.headPortrait = item.headPortrait.trim(); // 网站类型
                        Obj.sociallatform = item.sociallatform.trim(); // 链接
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
                // 校验艺人头像
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && isError === 0) {
                    // 处理艺人头像
                    var artist = new Object();
                    artist.judgeMark = '0'; // 头像标识
                    artist.headPortrait = _t.formItem.imgUrl;
                    artist.sociallatform = null;
                    linkArr.unshift(artist);
                    _t.$api.post('artistSocial/saveArtistSocial', {
                        judgeMark: '0,1', // 0: 头像 1: 个人社交  2: 团队社交
                        list: linkArr, // 数据集合
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$message.success(res.message);
                                // 刷新数据
                                _t.getData();
                                break;
                            default: // 操作失败
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
                    logoType: '1', // 1: 社交平台 2: 音乐平台
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
            },
            // 获取详情数据
            getData() {
                let _t = this;
                _t.$api.post('artistSocial/getArtistSocial', {
                    judgeMark: '0,1', // 0: 头像 1: 个人社交  2: 团队社交
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            // 处理艺人头像
                            if (res.type0 !== undefined && res.type0 !== null && res.type0.length !== 0) {
                                // 为 0 代表头像
                                _t.formItem.imgUrl = res.type0[0].headPortrait !== undefined ? res.type0[0].headPortrait : '';
                            }

                            // 处理艺人社交网站
                            if (res.type1 !== undefined && res.type1 !== null && res.type1.length !== 0) {
                                // 为 1 代表个人社交网站
                                _t.listData = res.type1;
                            }
                            break;
                        default: // 查询失败
                            _t.$message.error('查询详情失败!');
                            break;
                    }
                });
            },
        },
        created() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.getTypeData();
            // 获取详情数据
            _t.getData();
        }
    }
</script>

<style scoped>
    .line_index:last-child {
        border-bottom: none;
    }
</style>
