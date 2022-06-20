<template>
    <Box>
        <el-form v-model="formItem">
            <!--编辑轮播图-->
            <div v-if="formItem.active === 0">
                <p class="headerTitle">编辑轮播图</p>
                <p class="star formTitle">上传图片：</p>
                <el-form-item>
                    <el-upload
                        class="uploadWeb"
                        :action="this.$api.root() + 'upload/upload'"
                        name="file"
                        :accept="formItem.accept"
                        :before-upload="beforeUploadSwiper"
                        :on-success="swiperSuccess"
                        :on-error="swiperError">
                        <img
                            v-if="formItem.imgUrl !== '' && formItem.imgUrl !== null"
                            :src="this.$api.imgUrl() + formItem.imgUrl"
                            class="swiper_avatar">
                        <i v-else class="el-icon-upload"></i>
                        <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式,且宽1920像素*900像素</div>
                    </el-upload>
                    <div v-if="formItem.imgUrlFlag" class="isNotNullText">必传项不能为空</div>
                </el-form-item>
                <p class="star formTitle">排序号：</p>
                <el-form-item>
                    <el-input
                        v-model="formItem.sort"
                        maxlength="1"
                        @blur="blurInputNull(formItem,'sortFlag',formItem.sort)"
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        placeholder="请输入显示序号"/>
                    <div v-if="formItem.sortFlag" class="isNotNullText">必填项不能为空</div>
                </el-form-item>
                <p class="formTitle marBottom0">链接页面：</p>
                <el-form-item>
                    <el-radio v-model="formItem.page" label="inWeb">链接到站内页面</el-radio>
                    <br>
                    <el-select
                        placeholder="请选择站内模块"
                        clearable
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        v-model="formItem.inSelect">
                        <el-option
                            v-for="(item,index) in inSelectList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                    <!--
                    @change="changeModule(formItem.inSelect)"
                    <div v-if="formItem.inSelectFlag" class="isNotNullText">必填项不能为空</div>
                    -->
                    <p class="formTitle marBottom0">关联内容编号</p>
                    <el-input
                        placeholder="请输入关联模块内容编号"
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        v-model="formItem.inInput"/>
                    <div>
                        <el-radio v-model="formItem.page" label="outWeb">链接到指定页面(新窗口打开)</el-radio>
                    </div>
                    <el-input
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        @blur="blurInput(formItem.outInput)"
                        v-model="formItem.outInput"
                        placeholder="请输入URL"/>
                    <div v-if="formItem.outInputFlag" class="isNotNullText">必填项不能为空</div>
                </el-form-item>
                <el-form-item class="marBottom50">
                    <el-button class="marRight20" type="default" @click="goBack">返回</el-button>
                    <el-button type="primary" @click="addSwiperData">发布</el-button>
                </el-form-item>
            </div>
            <!--编辑banner图-->
            <div v-else-if="formItem.active === 1">
                <p class="headerTitle">编辑Banner图</p>
                <p class="star formTitle">上传图片：</p>
                <el-form-item>
                    <el-upload
                        class="uploadWeb"
                        :action="this.$api.root() + 'upload/upload'"
                        name="file"
                        :accept="formItem.accept"
                        :before-upload="beforeUploadBanner"
                        :on-success="bannerSuccess"
                        :on-error="bannerError">
                        <img
                            v-if="formItem.bannerUrl !== '' && formItem.bannerUrl !== null"
                            :src="this.$api.imgUrl() + formItem.bannerUrl"
                            class="swiper_avatar">
                        <i v-else class="el-icon-upload"></i>
                        <div slot="tip" class="el-upload__tip">图片最大20M,只能上传png格式,且宽1920像素*700像素</div>
                    </el-upload>
                    <div v-if="formItem.bannerUrlFlag" class="isNotNullText">必填项不能为空</div>
                </el-form-item>
                <p class="star formTitle">板块：</p>
                <el-form-item>
                    <el-select
                        clearable
                        :class="isWeb ? 'widthFixed' : 'widthAll'"
                        placeholder="请选择板块"
                        @change="blurInputNull(formItem,'bannerSortFlag',formItem.bannerSort)"
                        v-model="formItem.bannerSort">
                        <el-option v-for="(item,index) in bannerList" :key="index" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                    <div v-if="formItem.bannerSortFlag" class="isNotNullText">必填项不能为空</div>
                </el-form-item>
                <el-form-item class="marBottom50">
                    <el-button class="marRight20" type="default" @click="goBack">返回</el-button>
                    <el-button type="primary" @click="addBannerData">发布</el-button>
                </el-form-item>
            </div>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "EDITIMG",
        components: {Box},
        data() {
            return {
                isWeb: false, // pc端还是移动端
                // 表单
                formItem: {
                    accept: 'image/*',
                    active: 0, // 当前选中的标签 0:轮播  1:Banner  2:VIP
                    imgUrl: '', // 轮播图
                    imgUrlFlag: false, //
                    page: 'inWeb', // 单选框 站内还是站外
                    inSelect: '', // 站内选中模块
                    inSelectFlag: false, // 站内标识
                    inInput: '', // 关联内容id
                    outInput: '', // 站外url地址
                    outInputFlag: false, // 站外标识
                    bannerUrl: '', // bannerUrl
                    bannerUrlFlag: false, // banner上传图片标识
                    sort: '',
                    sortFlag: false, // 排序标识
                    bannerSort: '', // banner板块
                    bannerSortFlag: false, // banner板块标识
                },
                // 站内模块可选值
                inSelectList: [
                    {label: "新闻", value: '1'},
                    // {label: "行程", value: '2'},
                    {label: "活动公告", value: '3'},
                    // {label: "综艺", value: '4'},
                    // {label: "音乐", value: '5'},
                    {label: "MV", value: '6'},
                    {label: "代言", value: '7'},
                ],
                // 轮播图板块
                bannerList: [
                    {label: '最新消息', value: '1'},
                    {label: '音乐', value: '2'},
                    {label: '独家动态', value: '3'},
                    {label: '会员', value: '4'},
                    {label: '商城', value: '5'},
                    {label: '关于王嘉尔', value: '6'},
                    {label: '关于我们', value: '7'},
                    {label: '个人中心', value: '8'},
                ],
                // 请求参数
                addEdit: {
                    foreignKey: '',
                    moduleNumber: '',
                    id: '', // 从详情获取id
                    contentId: '', // 从表格行获取
                    module: '', // 0:轮播, 1:banner
                },
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
                                if (res.data !== undefined && res.data !== null) {
                                    _t.formItem.active = res.data.module; // 判断页面显示标识
                                    _t.addEdit.id = res.data.id;
                                    if (_t.formItem.active === 0) {
                                        // 轮播
                                        if (res.data.carouselMapStr !== undefined && res.data.carouselMapStr !== null) {
                                            _t.formItem.imgUrl = res.data.carouselMapStr; // 图片
                                        }
                                        // 判断站内还是站外
                                        _t.formItem.page = res.data.site === 0 ? 'inWeb' : (res.data.site === 1 ? 'outWeb' : '');
                                        if (_t.formItem.page === 'inWeb') {
                                            // 站内 分隔判断模块和id
                                            let linkAddress = res.data.linkAddress !== undefined && res.data.linkAddress !== null ? res.data.linkAddress : '';
                                            if (linkAddress.split(',').length === 1) {
                                                _t.formItem.inSelect = linkAddress.split(',')[0];
                                            } else if (linkAddress.split(',').length === 2) {
                                                _t.formItem.inSelect = linkAddress.split(',')[0];
                                                _t.formItem.inInput = linkAddress.split(',')[1];
                                            }
                                        } else if (_t.formItem.page === 'outWeb') {
                                            // 站外
                                            _t.formItem.outInput = res.data.linkAddress !== undefined && res.data.linkAddress !== null ? res.data.linkAddress : '';
                                        }
                                        // 排序
                                        _t.formItem.sort = res.data.sort !== undefined ? res.data.sort.toString() : '';
                                    } else if (_t.formItem.active === 1) {
                                        // banner
                                        if (res.data.carouselMapStr !== undefined && res.data.carouselMapStr !== null) {
                                            _t.formItem.bannerUrl = res.data.carouselMapStr; // 图片
                                        }
                                        // 板块
                                        _t.formItem.bannerSort = res.data.site !== undefined ? res.data.site.toString() : '';
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
            // 轮播图上传前
            beforeUploadSwiper(file) {
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
                        let valid = img.width === 1920 && img.height === 900;
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
            // 轮播图上传成功
            swiperSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.imgUrl = val.url[0].filePath;
                    _t.formItem.imgUrlFlag = false;
                }
            },
            // 轮播图上传失败
            swiperError(err, file, fileList) {
                var _t = this;
                _t.$message.error('图片上传失败!');
            },
            // 返回
            goBack() {
                var _t = this;
                _t.$router.push({name: 'CONTENT'});
            },
            // 改变站内模块下拉框
            changeModule(val) {
                var _t = this;
                if (_t.formItem.page === 'inWeb') {
                    // 站内
                    _t.formItem.inSelectFlag = val.trim() === '' ? true : false;
                    _t.formItem.outInputFlag = false;
                }
            },
            // 失去焦点校验
            blurInput(val) {
                var _t = this;
                // 站外
                if (_t.formItem.page === 'outWeb') {
                    _t.formItem.outInputFlag = val.trim() === '' ? true : false;
                    _t.formItem.inSelectFlag = false;
                }
            },
            // 发布轮播图按钮
            addSwiperData() {
                var _t = this;
                // 校验排序号
                _t.blurInputNull(_t.formItem, 'sortFlag', _t.formItem.sort);
                // 校验图片地址是否为空
                if (_t.formItem.imgUrl === '' || _t.formItem.imgUrl === null) {
                    _t.formItem.imgUrlFlag = true;
                } else {
                    _t.formItem.imgUrlFlag = false;
                }
                // 校验链接页面
                // if (_t.formItem.page === 'inWeb') {
                //     _t.changeModule(_t.formItem.inSelect);
                // } else {
                //     _t.blurInput(_t.formItem.outInput);
                // }
                // 可以提交
                if (_t.formItem.imgUrlFlag === false
                    && _t.formItem.sortFlag === false
                // && _t.formItem.inSelectFlag === false
                // && _t.formItem.outInputFlag === false
                ) {
                    // 获取
                    var linkAddress = ''; // 图片链接地址
                    if (_t.formItem.page === 'inWeb') {
                        // 模块不为空拼接
                        if (_t.formItem.inSelect !== '') {
                            linkAddress = _t.formItem.inSelect + ',' + _t.formItem.inInput.trim();
                        }
                    } else {
                        linkAddress = _t.formItem.outInput.trim();
                    }
                    _t.$api.post('home/saveVipPhoto', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        carouselMap: _t.formItem.imgUrl, // 图片地址
                        module: 0, // 0: 首页轮播 1:banner 2:vip
                        site: _t.formItem.page === 'inWeb' ? 0 : 1, // 站内还是站外
                        linkAddress: linkAddress !== '' ? linkAddress : null, // 链接地址
                        sort: _t.formItem.sort.trim(), // 排序
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 操作人ID
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
            // banner上传前
            beforeUploadBanner(file) {
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
                        let valid = img.width === 1920 && img.height === 700;
                        valid ? resolve() : reject();
                    };
                    img.src = _URL.createObjectURL(file);
                }).then(() => {
                    return file;
                }, () => {
                    _t.$message.error('图片尺寸不符合要求!');
                    return Promise.reject();
                });
                return isImg && isLt20M && isSize;
            },
            // banner上传成功
            bannerSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.bannerUrl = val.url[0].filePath;
                    _t.formItem.bannerUrlFlag = false;
                }
            },
            // banner上传失败时
            bannerError(err, file, fileList) {
                var _t = this;
                _t.$message.error('图片上传失败!');
            },
            // 发布banner按钮
            addBannerData() {
                var _t = this;
                // 校验 板块
                _t.blurInputNull(_t.formItem, 'bannerSortFlag', _t.formItem.bannerSort);
                // 校验图片地址是否为空
                if (_t.formItem.bannerUrl === '' || _t.formItem.bannerUrl === null) {
                    _t.formItem.bannerUrlFlag = true;
                } else {
                    _t.formItem.bannerUrlFlag = false;
                }
                // 可以提交
                if (_t.formItem.bannerUrlFlag === false && _t.formItem.bannerSortFlag === false) {
                    _t.$api.post('home/saveVipPhoto', {
                        id: _t.addEdit.id,
                        contenId: _t.addEdit.contentId,
                        carouselMap: _t.formItem.bannerUrl, // 图片地址
                        module: 1, // 0: 首页轮播 1:banner 2:vip
                        site: _t.formItem.bannerSort.trim(), // 站内板块
                        releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 操作人ID
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
            },
            // 校验为空
            blurInputNull(item, flag, val) {
                item[flag] = val.trim() === '' ? true : false;
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
            var module = _t.$route.params.TEAM_WANG_MODULE ? _t.$route.params.TEAM_WANG_MODULE : localStorage.getItem('TEAM_WANG_MODULE');
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
                if (module.toString() === '0') {
                    // 轮播
                    _t.getData();
                } else if (module.toString() === '1') {
                    // banner
                    _t.getData();
                }
            }
        },
        destroyed() {
            localStorage.removeItem('TEAM_WANG_MODULE');
            localStorage.removeItem('TEAM_WANG_FOREIGN_KEY');
            localStorage.removeItem('TEAM_WANG_MODULE_NUM');
            localStorage.removeItem('TEAM_WANG_CONTENT_ID');
        }
    }
</script>

<style scoped>

</style>
