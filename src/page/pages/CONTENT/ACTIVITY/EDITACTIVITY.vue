<template>
    <Box>
        <el-form :model="formItem">
            <p class="star formTitle">发布到 活动公告 / VIP活动公告</p>
            <el-form-item>
                <el-select
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'defaultFlag',formItem.defaultVisible)"
                    v-model="formItem.defaultVisible"
                    clearable>
                    <el-option label="活动公告" :value="'0'"/>
                    <el-option label="VIP活动公告" :value="'1'"/>
                </el-select>
                <div v-if="formItem.defaultFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
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
                    class="activityUpload"
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
                        class="activity_avatar">
                    <i v-else-if="formItem.imgUrl === '' && formItem.imgStatus === false" class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.imgStatus === true" type="circle"
                        :percentage="formItem.progressNum"/>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低280像素</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">活动标题</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    placeholder="请输入活动标题"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">活动时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'timeFlag',formItem.time)"
                    v-model="formItem.time"
                    type="datetime"
                    placeholder="选择活动时间">
                </el-date-picker>
                <div v-if="formItem.timeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">活动描述</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'purposeFlag',formItem.purpose)"
                    v-model="formItem.purpose"
                    :maxlength="formItem.language === 'zh_CN' ? 300 : 900"
                    placeholder="请输入活动描述"/>
                <div v-if="formItem.purposeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">活动地点</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'addressFlag',formItem.address)"
                    v-model="formItem.address"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    show-word-limit
                    placeholder="请输入活动地点"/>
                <div v-if="formItem.addressFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="formTitle">具体内容</p>
            <el-form-item>
                <div id="editor" class="editor"></div>
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
    import E from 'wangeditor';

    export default {
        name: "EDITACTIVITY",
        components: {Box},
        data() {
            return {
                isWeb: false, // 是否pc端
                // 表单
                formItem: {
                    language: 'zh_CN', // 语言
                    languageFlag: false, // 语言标识
                    accept: 'image/*', // 图片上传格式
                    imgUrl: '', // 封面图
                    title: '', // 活动标题
                    time: '', // 活动时间
                    purpose: '', // 活动描述
                    address: '', // 活动地点
                    imgUrlFlag: false, // 封面图标识
                    titleFlag: false, // 活动标题标识
                    timeFlag: false, // 活动时间标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    purposeFlag: false, // 活动描述标识
                    addressFlag: false, // 活动地点标识
                    editor: '', // 编辑器
                    defaultVisible: '0', // 0:普通可见，1:VIP可见
                    defaultFlag: false, // 是否可见标识
                },
                // 请求参数
                addEdit: {
                    foreignKey: '',
                    moduleNumber: '',
                    id: '', // 从详情获取id
                    contentId: '', // 从表格行获取
                },
            }
        },
        methods: {
            // 获取详情接口
            getData() {
                var _t = this;
                if (_t.addEdit.foreignKey !== '' && _t.addEdit.moduleNumber !== '') {
                    _t.$api.get('contentManage/listAllById/' + _t.addEdit.moduleNumber + '/' + _t.addEdit.foreignKey, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                var resData = res.data !== null ? res.data : [];
                                if (resData.length !== 0) {
                                    _t.addEdit.id = resData[0].id; // id
                                    if (resData[0].thumbnail !== undefined && resData[0].thumbnail !== null) {
                                        _t.formItem.imgUrl = resData[0].thumbnail;
                                        _t.formItem.imgStatus = false;
                                    }
                                    _t.formItem.title = resData[0].activityTitle; // 活动标题
                                    _t.formItem.time = new Date(Number(resData[0].activityTime)); // 活动时间
                                    _t.formItem.purpose = resData[0].activityPurpose; // 活动描述
                                    _t.formItem.address = resData[0].activityAddress; // 活动地点
                                    _t.formItem.language = resData[0].language; // 语言
                                    // 是否vip用户可见
                                    if (resData[0].defaultVisible !== undefined && resData[0].defaultVisible !== null) {
                                        _t.formItem.defaultVisible = resData[0].defaultVisible.toString();
                                    }
                                    if (resData[0].activityContentStr !== undefined && resData[0].activityContentStr !== null) {
                                        _t.formItem.editor.txt.html(resData[0].activityContentStr); // 具体内容
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
            // 点击发布按钮
            addData() {
                var _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验活动时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 校验活动描述
                _t.blurInput(_t.formItem, 'purposeFlag', _t.formItem.purpose);
                // 校验活动地点
                _t.blurInput(_t.formItem, 'addressFlag', _t.formItem.address);
                // 校验是否普通用户可见
                _t.blurInput(_t.formItem, 'defaultFlag', _t.formItem.defaultVisible);
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.languageFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.purposeFlag === false
                    && _t.formItem.defaultFlag === false
                    && _t.formItem.addressFlag === false) {
                    let formatText = _t.formItem.editor.txt.html();
                    _t.$api.post('activity/saveActivity/push', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        language: _t.formItem.language, // 语言
                        thumbnail: _t.formItem.imgUrl, // 缩略图
                        activityTitle: _t.formItem.title.trim(), // 活动标题
                        activityTime: new Date(_t.formItem.time).getTime(), // 活动时间
                        activityPurpose: _t.formItem.purpose.trim(), // 活动描述
                        activityAddress: _t.formItem.address.trim(), // 活动地址
                        activityContent: formatText, // 具体内容
                        defaultVisible: _t.formItem.defaultVisible === '' ? 0 : Number(_t.formItem.defaultVisible), // 是否普通用户可见
                        isVipActivity: 0, // 是否VIP模块 1:VIP 0:不是
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID')
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
            // 返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: 'CONTENT'});
            }
        },
        mounted() {
            var _t = this;
            var equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            // 初始化编辑器
            _t.formItem.editor = new E('#editor');
            // 自定义菜单配置
            _t.formItem.editor.customConfig.menus = [
                'bold',
                'italic',
                'underline',
                'fontSize',
                'list',  // 列表
                'justify',  // 对齐方式
                'image',
            ];
            // 样式过滤
            _t.formItem.editor.customConfig.pasteFilterStyle = true;
            _t.formItem.editor.customConfig.showLinkImg = false;
            _t.formItem.editor.customConfig.uploadImgShowBase64 = false;
            _t.formItem.editor.customConfig.uploadFileName = 'file';
            _t.formItem.editor.customConfig.uploadImgParams = {};
            _t.formItem.editor.customConfig.uploadImgServer = this.$api.root() + 'upload/upload';
            _t.formItem.editor.customConfig.uploadImgTimeout = 100000000;
            _t.formItem.editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024;
            _t.formItem.editor.customConfig.debug = true;
            _t.formItem.editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {},
                success: function (xhr, editor, result) {},
                fail: function (xhr, editor, result) {},
                error: function (xhr, editor) {},
                timeout: function (xhr, editor) {},
                customInsert: function (insertImg, result, editor) {
                    if (result.status === 200) {
                        insertImg(_t.$api.imgUrl() + result.url[0].filePath);
                    }
                }
            };
            _t.formItem.editor.create();
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
