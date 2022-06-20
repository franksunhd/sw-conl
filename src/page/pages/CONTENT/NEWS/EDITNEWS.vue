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
            <p class="star formTitle">新闻标题</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'titleFlag',formItem.title)"
                    v-model="formItem.title"
                    :maxlength="formItem.language === 'zh_CN' ? 300 : 1000"
                    placeholder="请输入新闻标题"/>
                <div v-if="formItem.titleFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">内容描述</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'desFlag',formItem.description)"
                    v-model="formItem.description"
                    :maxlength="formItem.language === 'zh_CN' ? 300 : 1000"
                    placeholder="请输入内容描述"/>
                <div v-if="formItem.desFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">发布时间</p>
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
            <p class="formTitle">新闻内容</p>
            <el-form-item>
                <div id="editor" class="editor"></div>
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
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且高度最低300像素</div>
                </el-upload>
                <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="formTitle">是否需要置顶</p>
            <el-form-item>
                <el-select
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.sort"
                    clearable>
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="marBottom50">
                <el-button class="marRight20" type="default" @click="goBack">返回</el-button>
                <el-button @click="addData" type="primary">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import E from 'wangeditor';
    import Box from "../../../../components/Box";

    export default {
        name: "EDITNEWS",
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
                    title: '', // 新闻标题
                    description: '', // 内容描述
                    editor: '', // 编辑器
                    imgUrlFlag: false, // 封面图标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    titleFlag: false,// 标题标识
                    desFlag: false, // 描述标识
                    sort: '1', // 默认不置顶
                    time: '', // 新闻时间
                    timeFlag: false, // 发布时间
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
            // 获取回显数据
            getData() {
                var _t = this;
                if (_t.addEdit.foreignKey !== '' && _t.addEdit.moduleNumber !== '') {
                    _t.$api.get('contentManage/listAllById/' + _t.addEdit.moduleNumber + '/' + _t.addEdit.foreignKey, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                var resData = res.data !== null ? res.data : [];
                                if (resData.length !== 0) {
                                    _t.addEdit.id = resData[0].id; // id
                                    // 缩略图
                                    if (resData[0].thumbnail !== undefined && resData[0].thumbnail !== null) {
                                        _t.formItem.imgUrl = resData[0].thumbnail;
                                        _t.formItem.imgStatus = false;
                                    }
                                    _t.formItem.title = resData[0].newsTitle !== undefined && resData[0].newsTitle !== null ? resData[0].newsTitle : ''; // 标题
                                    _t.formItem.description = resData[0].newsDescribed !== undefined && resData[0].newsDescribed !== null ? resData[0].newsDescribed : ''; // 内容描述
                                    _t.formItem.language = resData[0].language; // 语言
                                    // 发布时间
                                    if (resData[0].newsTime !== undefined && resData[0] !== null) {
                                        _t.formItem.time = new Date(Number(resData[0].newsTime));
                                    }
                                    // 新闻详情
                                    if (resData[0].newsContentStr !== undefined && resData[0].newsContentStr !== null) {
                                        _t.formItem.editor.txt.html(resData[0].newsContentStr); // 新闻内容
                                    }
                                    // 是否置顶
                                    if (resData[0].sort !== undefined && resData[0].sort !== null) {
                                        _t.formItem.sort = resData[0].sort.toString(); // 0:置顶 1:取消置顶
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
            // 返回
            goBack() {
                let _t = this;
                _t.$router.push({name: 'CONTENT'})
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
                        let valid = img.height >= 300;
                        valid ? resolve() : reject()
                    };
                    img.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片不符合要求,高度最低300像素!');
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
                let _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验描述
                _t.blurInput(_t.formItem, 'desFlag', _t.formItem.description);
                // 校验发布时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                let formatText = _t.formItem.editor.txt.html();
                // 获取富文本内容
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.languageFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.desFlag === false) {
                    _t.$api.post('news/saveNews/push', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        language: _t.formItem.language, // 语言
                        newsTitle: _t.formItem.title.trim(), // 新闻标题
                        newsTime: _t.formItem.time === '' ? null : new Date(_t.formItem.time).getTime(), // 发布时间
                        newsDescribed: _t.formItem.description.trim(), // 新闻描述
                        thumbnail: _t.formItem.imgUrl, // 封面图
                        newsContent: formatText.trim(), // 新闻内容
                        sort: _t.formItem.sort !== '' && _t.formItem.sort !== null ? _t.formItem.sort : '1', // 0:置顶 1:取消置顶
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
        mounted() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
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
                before: function (xhr, editor, files) {
                },
                success: function (xhr, editor, result) {
                },
                fail: function (xhr, editor, result) {
                },
                error: function (xhr, editor) {
                },
                timeout: function (xhr, editor) {
                },
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
