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
            <p class="star formTitle">品牌LOGO</p>
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
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">品牌名称</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    :maxlength="formItem.language === 'zh_CN' ? 15 : 45"
                    placeholder="请输入品牌名称"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">代言期限</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed marBottom20' : 'widthAll marBottom20'"
                    @change="ruleDate(formItem,'timeFlag',formItem.startTime,formItem.endTime,'timeTip')"
                    v-model="formItem.startTime"
                    type="date"
                    placeholder="开始日期">
                </el-date-picker>
                <span v-if="isWeb" class="marginLR10">至</span>
                <span v-else><br></span>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="ruleDate(formItem,'timeFlag',formItem.startTime,formItem.endTime,'timeTip')"
                    v-model="formItem.endTime"
                    type="date"
                    placeholder="结束日期">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">{{formItem.timeTip}}</div>
            </el-form-item>
            <!--新加-->
            <p class="formTitle marBottom0">
                <span class="marRight20">代言详情</span>
                <el-button @click="addType" type="text" class="fw">添加一组</el-button>
            </p>
            <el-collapse class="advocacy_Box" v-model="activeNames">
                <el-collapse-item
                    v-for="(item,index) in listData"
                    :key="index"
                    :title="'第'+ (index + 1) +'组'"
                    :name="index + 1">
                    <el-form-item class="marBottom0 paddingLeft20">
                        <el-upload
                            class="marBottom20"
                            :action="rootUrl"
                            name="file"
                            list-type="picture-card"
                            :accept="formDetail.accept"
                            :file-list="item.photosList"
                            :on-success="(res,file) => {return imgUploadSuccessPhotos(res, file, item)}"
                            :on-remove="(res,file) => {return handleRemove(res, file, item)}"
                            :before-upload="beforeUploadPhoto"
                            :on-error="imgUploadErrorPhoto"
                            :on-preview="handlePictureCardPreview">
                            <i class="el-icon-plus"></i>
                            <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低400像素</div>
                        </el-upload>
                        <div class="marBottom20">
                            <el-input
                                type="textarea"
                                :class="isWeb ? 'widthFixed' : 'widthAll'"
                                v-model="item.content"
                                placeholder="请输入代言内容"/>
                        </div>
                        <div class="marBottom20">
                            <el-input
                                :class="isWeb ? 'widthFixed' : 'widthAll'"
                                v-model="item.link"
                                placeholder="请输入链接地址"/>
                        </div>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
            <el-form-item class="marBottom50 marginTop20">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button @click="addData" type="primary">发布</el-button>
            </el-form-item>
        </el-form>
        <!--查看照片详情-->
        <el-dialog
            width="50%"
            append-to-body
            :visible.sync="formDetail.dialogVisible">
            <img class="widthAll" :src="formDetail.dialogImageUrl" alt="photo">
        </el-dialog>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "EDITADVOCACY",
        components: {Box},
        data() {
            return {
                isWeb: false,
                rootUrl: this.$api.root() + 'upload/upload',
                // 表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    accept: 'image/*', // 图片上传格式
                    imgUrl: '', // 封面图
                    title: '', // 品牌名称
                    startTime: null, // 开始时间
                    endTime: null, // 截止时间
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    titleFlag: false, // 品牌名称标识
                    timeFlag: false, // 代言期限标识
                    timeTip: '', // 代言期限提示
                },
                // 请求参数
                addEdit: {
                    foreignKey: '',
                    moduleNumber: '',
                    id: '', // 从详情获取id
                    contentId: '', // 从表格行获取
                },
                // 详情表单
                listData: [
                    {photosList: [], content: '', link: ''}
                ],
                formDetail: {
                    accept: 'image/*', // 图片上传格式
                    dialogVisible: false, //图片是否显示
                    dialogImageUrl: '', // 展示详情大图
                },
                // 折叠面板 默认展开项
                activeNames: [1], // 折叠面板默认展开第一个
            }
        },
        methods: {
            // 获取详情数据
            getData() {
                var _t = this;
                if (_t.addEdit.foreignKey !== '' && _t.addEdit.moduleNumber !== '') {
                    _t.$api.get('contentManage/listAllById/' + _t.addEdit.moduleNumber + '/' + _t.addEdit.foreignKey, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                var resData = res.data !== null ? res.data : [];
                                if (resData.length !== 0) {
                                    _t.addEdit.id = resData[0].id; // id
                                    if (resData[0].brandLogo !== undefined && resData[0].brandLogo !== null) {
                                        _t.formItem.imgUrl = resData[0].brandLogo;
                                        _t.formItem.imgStatus = false;
                                    }
                                    _t.formItem.title = resData[0].brandName; // 品牌名称
                                    _t.formItem.startTime = new Date(Number(resData[0].representTime)); // 代言期限
                                    _t.formItem.endTime = new Date(Number(resData[0].endTime)); // 代言期限
                                    _t.formItem.language = resData[0].language; // 语言
                                    // 处理详情数据
                                    if (resData[0].representContentStr !== undefined && resData[0].representContentStr !== null) {
                                        var listData = JSON.parse(resData[0].representContentStr);
                                        if (listData.length !== 0) {
                                            let newArr = new Array();
                                            listData.forEach((item) => {
                                                let obj = new Object();
                                                obj.content = item.content;
                                                obj.link = item.link;
                                                obj.photosList = new Array();
                                                if (item.photos.length !== 0) {
                                                    item.photos.forEach((val) => {
                                                        let newObj = new Object();
                                                        newObj.id = val;
                                                        newObj.name = val;
                                                        newObj.url = _t.$api.imgUrl() + val;
                                                        obj.photosList.push(newObj);
                                                    });
                                                }
                                                newArr.push(obj);
                                            });
                                            _t.listData = newArr;
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
            // 校验代言期限
            ruleDate(item, flag, start, end, tip) {
                if (start !== '' && start !== null && end !== '' && end !== null) {
                    // 不为空
                    start = new Date(start).getTime();
                    end = new Date(end).getTime();
                    if (start > end) {
                        item[flag] = true;
                        item[tip] = '开始日期不能大于结束日期!';
                    } else {
                        item[flag] = false;
                        item[tip] = '';
                    }
                } else {
                    // 为空
                    item[flag] = true;
                    item[tip] = '日期均不能为空!';
                }
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
            /*------------------------------------------------start------------------------------------------------*/
            // 图片上传前
            beforeUploadPhoto(file) {
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
                        let valid = img.height >= 400;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最小400px!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // 内容详情查看原图
            handlePictureCardPreview(file) {
                var _t = this;
                _t.formDetail.dialogImageUrl = file.url;
                _t.formDetail.dialogVisible = true;
            },
            // 添加一组内容
            addType() {
                let _t = this;
                let lastData = _t.listData[_t.listData.length - 1]; // 最后一组数据
                if (lastData.content.trim() !== ''
                    || lastData.link.trim() !== ''
                    || lastData.photosList.length !== 0) {
                    // 三者均不为空 可以添加下一项
                    let obj = new Object();
                    obj.content = ''; // 内容
                    obj.link = ''; // 链接
                    obj.photosList = new Array();
                    _t.listData.push(obj);
                } else {
                    _t.$message.warning('您还有为空的数据,请检查!');
                }
            },
            // 上传成功
            imgUploadSuccessPhotos(res, file, item) {
                let _t = this;
                if (res.status === 200) {
                    let Obj = new Object();
                    Obj.id = res.url[0].filePath;
                    Obj.name = res.url[0].fileName;
                    Obj.url = _t.$api.imgUrl() + res.url[0].filePath;
                    item.photosList.push(Obj);
                }
            },
            // 删除图片
            handleRemove(res, file, item) {
                if (item.photosList.length !== 0) {
                    item.photosList.forEach((val, index) => {
                        if (val.uid === res.uid) {
                            item.photosList.splice(index, 1);
                        }
                    });
                }
            },
            // 图片上传失败
            imgUploadErrorPhoto(err, file, fileList) {
                var _t = this;
                _t.$message.error('图片上传失败!');
            },
            /*---------------------------------------------end---------------------------------------------*/
            // 发布按钮
            addData() {
                var _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验logo
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验品牌名称
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验代言期限
                _t.ruleDate(_t.formItem, 'timeFlag', _t.formItem.startTime, _t.formItem.endTime, 'timeTip');
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.languageFlag === false
                    && _t.formItem.timeFlag === false) {
                    let listDataArr = new Array(); // 需要传的数组
                    _t.listData.forEach((item) => {
                        if (item.content !== '' || item.link !== '' || item.photosList.length !== 0) {
                            let obj = new Object();
                            obj.content = item.content.trim(); // 内容
                            obj.link = item.link; // 链接
                            obj.photos = new Array();
                            item.photosList.forEach((val) => {
                                if (val.name !== undefined && val.name !== null) {
                                    obj.photos.push(val.name);
                                }
                            });
                            listDataArr.push(obj);
                        }
                    });
                    _t.$api.post('represent/saveRepresent/push', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        language: _t.formItem.language, // 语言
                        brandLogo: _t.formItem.imgUrl, // 品牌logo
                        brandName: _t.formItem.title.trim(), // 品牌名称
                        representTime: _t.formItem.startTime === '' ? null : new Date(_t.formItem.startTime).getTime(), // 开始时间
                        endTime: _t.formItem.endTime === '' ? null : new Date(_t.formItem.endTime).getTime(), // 开始时间
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 发布人id
                        representContent: listDataArr.length !== 0 ? JSON.stringify(listDataArr) : null //代言图片与代言描述
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
            // 从上级获取数据
            var foreignKey = _t.$route.params.TEAM_WANG_FOREIGN_KEY ? _t.$route.params.TEAM_WANG_FOREIGN_KEY : localStorage.getItem('TEAM_WANG_FOREIGN_KEY');
            var moduleNumber = _t.$route.params.TEAM_WANG_MODULE_NUM ? _t.$route.params.TEAM_WANG_MODULE_NUM : localStorage.getItem('TEAM_WANG_MODULE_NUM');
            var contentId = _t.$route.params.TEAM_WANG_CONTENT_ID ? _t.$route.params.TEAM_WANG_CONTENT_ID : localStorage.getItem('TEAM_WANG_CONTENT_ID');
            if (foreignKey !== null && foreignKey !== 'null') {
                _t.addEdit.foreignKey = foreignKey;
            }
            if (moduleNumber !== null && moduleNumber !== 'null') {
                _t.addEdit.moduleNumber = moduleNumber;
            }
            if (contentId !== null && contentId !== 'null') {
                _t.addEdit.contentId = contentId;
            }
            _t.getData();
        },
        destroyed() {
            localStorage.removeItem('TEAM_WANG_FOREIGN_KEY');
            localStorage.removeItem('TEAM_WANG_MODULE_NUM');
            localStorage.removeItem('TEAM_WANG_CONTENT_ID');
        }
    }
</script>

<style scoped>

</style>
