<template>
    <Box>
        <el-form :model="formItem">
            <p class="star formTitle">照片集名称</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    :maxlength="100"
                    placeholder="请输入照片集名称"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">拍摄时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'timeFlag',formItem.time)"
                    v-model="formItem.time"
                    type="date"
                    placeholder="选择拍摄时间">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">照片封面图</p>
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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低280像素</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="formTitle">照片图集</p>
            <el-form-item class="photosBox_VIP">
                <el-upload
                    class="photoCard"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    multiple
                    ref="fileList"
                    :accept="formItem.accept"
                    :file-list="formItem.fileList"
                    :before-upload="beforeVipPhoto"
                    :on-preview="previewVipPhoto"
                    :on-success="successVipPhoto"
                    :on-error="errorVipPhoto"
                    list-type="picture-card">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低280像素</div>
                </el-upload>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button type="primary" @click="addData">发布</el-button>
            </el-form-item>
        </el-form>
        <!--显示照片蒙版-->
        <el-dialog
            append-to-body
            :visible.sync="dialogVisible">
            <img class="widthAll" :src="dialogImageUrl" alt="">
        </el-dialog>
    </Box>
</template>

<script>
    import Box from "../../../../../components/Box";

    export default {
        name: "VIP_EDIT_PHOTOS",
        components: {Box},
        data() {
            return {
                isWeb: false, // 是否pc端
                // 表单
                formItem: {
                    accept: 'image/*', // 图片上传格式
                    imgUrl: '', // 封面图
                    title: '', // 照片集名称
                    time: '', // 活动时间
                    imgUrlFlag: false, // 封面图标识
                    titleFlag: false, // 照片集名称标识
                    timeFlag: false, // 活动时间标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    fileList: [], // 照片集
                },
                dialogImageUrl: '', // 蒙版图片
                dialogVisible: false, // 是否显示蒙版
                // 请求参数
                addEdit: {
                    foreignKey: '',
                    moduleNumber: '',
                    id: '', // 从详情获取id
                    contentId: '', // 从表格行获取
                    listId: '', // 编辑提交时 相册集id
                },
            }
        },
        methods: {
            // 获取详情
            getData() {
                var _t = this;
                if (_t.addEdit.foreignKey !== '' && _t.addEdit.moduleNumber !== '') {
                    _t.$store.commit('setLoading', true);
                    _t.$api.get('contentManage/listAllById/' + _t.addEdit.moduleNumber + '/' + _t.addEdit.foreignKey, {}, function (res) {
                        _t.$store.commit('setLoading', false);
                        switch (res.status) {
                            case 200:
                                if (res.data !== undefined && res.data !== null) {
                                    _t.addEdit.id = res.data.id;
                                    _t.formItem.title = res.data.title !== undefined ? res.data.title : ''; // 标题
                                    _t.formItem.time = res.data.publishTime !== undefined ? new Date(Number(res.data.publishTime)).getTime() : null; // 标题
                                    // 处理封面图
                                    if (res.data.carouselMapStr !== undefined && res.data.carouselMapStr !== null) {
                                        _t.formItem.imgUrl = res.data.carouselMapStr; // 封面图
                                    }
                                    if (res.photoList !== undefined && res.photoList !== null) {
                                        var fileList = new Array();
                                        var list = res.photoList.carouselMapStr !== undefined ? res.photoList.carouselMapStr : '';
                                        if (list !== '') {
                                            var listArr = list.split(',');
                                            listArr.forEach((item) => {
                                                var Obj = new Object();
                                                Obj.flag = 1;
                                                Obj.name = item;
                                                Obj.url = _t.$api.imgUrl() + item;
                                                fileList.push(Obj);
                                            });
                                            _t.formItem.fileList = fileList;
                                            _t.addEdit.listId = res.photoList.id !== undefined ? res.photoList.id : '';
                                        }
                                    }
                                }
                                break;
                            default:
                                _t.$message.error('查询详情失败!');
                                break;
                        }
                    });
                }
            },
            // 返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: "VIP_CONTENT"});
            },
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'timeFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
            },
            // 封面图上传前
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
                        let valid = img.height >= 280;
                        valid ? resolve() : reject();
                    };
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最低280像素!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // 封面图上传时
            uploadProcessImg(event, file, fileList) {
                var _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 封面图上传成功
            imgUploadSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.imgUrl = val.url[0].filePath;
                    _t.formItem.imgUrlFlag = false;
                    _t.formItem.imgStatus = false;
                }
            },
            // 封面图上传失败
            imgUploadError(err, file, fileList) {
                var _t = this;
                _t.formItem.imgUrlFlag = false;
                _t.formItem.imgStatus = false;
                _t.$message.error('图片上传失败!');
            },
            // 照片墙上传前
            beforeVipPhoto(file) {
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
                        let valid = img.height >= 280;
                        valid ? resolve() : reject();
                    };
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最低280像素!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // 照片墙预览
            previewVipPhoto(file) {
                var _t = this;
                _t.dialogImageUrl = file.url;
                _t.dialogVisible = true;
            },
            // 照片墙上传成功
            successVipPhoto(val, file, fileList) {
                var _t = this;
                // if (val.status === 200) {
                //     var Obj = new Object();
                //     Obj.id = val.url[0].filePath;
                //     Obj.name = val.url[0].fileName;
                //     Obj.url = _t.$api.imgUrl() + val.url[0].filePath;
                //     _t.formItem.fileList.push(Obj);
                // }
            },
            // 照片墙上传失败
            errorVipPhoto(err, file, fileList) {
                var _t = this;
                _t.$message.error('图片上传失败!');
            },
            // 照片墙移除
            removeVipPhoto(file, fileList) {
                var _t = this;
                // if (_t.formItem.fileList.length !== 0) {
                //     _t.formItem.fileList.forEach((item, index) => {
                //         if (item.uid === file.uid) {
                //             _t.formItem.fileList.splice(index, 1);
                //         }
                //     });
                // }
            },
            // 发布图片
            addData() {
                var _t = this;
                // 校验照片集名称
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验拍摄时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 校验照片封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 可以提交
                if (_t.formItem.titleFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.imgUrlFlag === false) {
                    // 处理照片集数据
                    let fileListArr = new Array();
                    let fileList = _t.$refs.fileList.uploadFiles;
                    if (fileList.length !== 0) {
                        fileList.forEach((item) => {
                            if (item.flag !== undefined && item.flag !== null && item.flag === 1) {
                                fileListArr.push(item.name);
                            } else if (item.response !== undefined && item.response !== null) {
                                fileListArr.push(item.response.url[0].filePath);
                            }
                        });
                    }
                    _t.$api.post('home/saveVipPhoto', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        listId: _t.addEdit.listId === '' ? null : _t.addEdit.listId,
                        module: 2, // 0：首页轮播、1：首页banner、2：vip模块 photo
                        title: _t.formItem.title.trim(), // 照片集名称
                        publishTime: new Date(_t.formItem.time).getTime(), // 拍摄时间
                        carouselMap: _t.formItem.imgUrl.trim(), // 封面图
                        carouselMaps: fileListArr.join(',') === '' ? null : fileListArr.join(','), // 相册集
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
            // 从上级获取数据
            var foreignKey = _t.$route.params.TEAM_WANG_VIP_FOREIGN_KEY ? _t.$route.params.TEAM_WANG_VIP_FOREIGN_KEY : localStorage.getItem('TEAM_WANG_VIP_FOREIGN_KEY');
            var moduleNumber = _t.$route.params.TEAM_WANG_VIP_MODULE_NUM ? _t.$route.params.TEAM_WANG_VIP_MODULE_NUM : localStorage.getItem('TEAM_WANG_VIP_MODULE_NUM');
            var contentId = _t.$route.params.TEAM_WANG_VIP_CONTENT_ID ? _t.$route.params.TEAM_WANG_VIP_CONTENT_ID : localStorage.getItem('TEAM_WANG_VIP_CONTENT_ID');
            var module = _t.$route.params.TEAM_WANG_VIP_MODULE ? _t.$route.params.TEAM_WANG_VIP_MODULE : localStorage.getItem('TEAM_WANG_VIP_MODULE');
            if (foreignKey !== null && foreignKey !== 'null') {
                _t.addEdit.foreignKey = foreignKey;
            }
            if (moduleNumber !== null && moduleNumber !== 'null') {
                _t.addEdit.moduleNumber = moduleNumber;
            }
            if (contentId !== null && contentId !== 'null') {
                _t.addEdit.contentId = contentId;
            }
            if (module !== null && module !== 'null') {
                _t.addEdit.module = module; // 判断模块
                if (module.toString() === '2') {
                    // vip
                    _t.getData();
                }
            }
        },
        destroyed() {
            localStorage.removeItem('TEAM_WANG_VIP_FOREIGN_KEY');
            localStorage.removeItem('TEAM_WANG_VIP_MODULE_NUM');
            localStorage.removeItem('TEAM_WANG_VIP_CONTENT_ID');
            localStorage.removeItem('TEAM_WANG_VIP_MODULE');
        }
    }
</script>

<style scoped>

</style>
