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
            <p class="star formTitle">上传封面图</p>
            <el-form-item>
                <el-upload
                    class="uploadWeb"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    :accept="formItem.accept"
                    :before-upload="beforeUploadThumbnail"
                    :on-progress="uploadProcessThumbnail"
                    :on-success="thumbnailUploadSuccess"
                    :on-error="thumbnailUploadError"
                    :show-file-list="false">
                    <img
                        v-if="formItem.thumbnail !== '' && formItem.thumbnail !== null && formItem.thumbnailStatus === false"
                        :src="this.$api.imgUrl() + formItem.thumbnail"
                        class="swiper_avatar">
                    <i v-else-if="formItem.thumbnail === '' && formItem.thumbnailStatus === false"
                       class="el-icon-upload"></i>
                    <el-progress
                        class="activity_progress"
                        v-if="formItem.thumbnailStatus === true" type="circle"
                        :percentage="formItem.thumbnailProgressNum"/>
                    <div slot="tip" class="el-upload__tip">图片最大20M,只能上传jpg、jpeg、png格式</div>
                </el-upload>
                <div v-if="formItem.thumbnailFlag" class="isNotNullText">必传项不能为空</div>
            </el-form-item>
            <p class="star formTitle">上传活动图</p>
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
            <p class="star formTitle">抢票开始时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'startTimeFlag',formItem.startTime)"
                    v-model="formItem.startTime"
                    type="datetime"
                    placeholder="选择抢票时间">
                </el-date-picker>
                <div v-if="formItem.startTimeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star formTitle">抢票截至时间</p>
            <el-form-item>
                <el-date-picker
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @change="blurInput(formItem,'endTimeFlag',formItem.endTime)"
                    v-model="formItem.endTime"
                    type="datetime"
                    placeholder="选择抢票时间">
                </el-date-picker>
                <div v-if="formItem.endTimeFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <!--            <p class="star formTitle">活动描述</p>-->
            <!--            <el-form-item>-->
            <!--                <el-input-->
            <!--                    :class="isWeb ? 'widthFixed' : 'widthAll'"-->
            <!--                    @blur="blurInput(formItem,'purposeFlag',formItem.purpose)"-->
            <!--                    v-model="formItem.purpose"-->
            <!--                    :maxlength="formItem.language === 'zh_CN' ? 300 : 900"-->
            <!--                    placeholder="请输入活动描述"/>-->
            <!--                <div v-if="formItem.purposeFlag" class="isNotNullText">必填项不能为空</div>-->
            <!--            </el-form-item>-->
            <p class="star formTitle">活动地点</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    @blur="blurInput(formItem,'addressFlag',formItem.address)"
                    v-model="formItem.address"
                    :maxlength="formItem.language === 'zh_CN' ? 100 : 300"
                    placeholder="请输入活动地点"/>
                <div v-if="formItem.addressFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <!--            <p class="star formTitle">活动场次</p>-->
            <!--            <el-form-item>-->
            <!--                <el-date-picker-->
            <!--                    :class="isWeb ? 'widthFixed' : 'widthAll'"-->
            <!--                    @change="blurInput(formItem,'sessionFlag',formItem.session)"-->
            <!--                    v-model="formItem.session"-->
            <!--                    type="datetime"-->
            <!--                    placeholder="选择活动场次">-->
            <!--                </el-date-picker>-->
            <!--                <div v-if="formItem.sessionFlag" class="isNotNullText">必填项不能为空</div>-->
            <!--            </el-form-item>-->
            <p class="star formTitle">限购张数</p>
            <el-form-item>
                <el-input
                    @blur="blurInput(formItem,'limitNumFlag',formItem.limitNum)"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    maxlength="2"
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.limitNum"/>
                <div v-if="formItem.limitNumFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <p class="star fontSize14 marBottom10">票面价格及库存</p>
            <el-form-item>
                <div v-for="(item,index) in ticketNum" :key="index" :class="isWeb ? 'widthFixed' : 'widthAll'">
                    <p class="star fontSize14">票面价格</p>
                    <el-input
                        oninput="value=value.replace(/[^\d]/g,'')"
                        maxlength="6"
                        @blur="item.price = item.price.trim() === '' ? 0 : item.price.trim()"
                        v-model="item.price">
                        <template slot="append">HKD</template>
                    </el-input>
                    <p class="star fontSize14">库存数量</p>
                    <el-input-number
                        :min="0"
                        :max="999999"
                        @blur="item.count = item.count === undefined ? 0 : item.count"
                        v-model="item.count"/>
                    <!--新增-->
                    <el-button v-if="index === 0" @click="addTicket" icon="el-icon-plus" type="primary"/>
                    <!--删除-->
                    <el-button v-else @click="delTicket(item,index)" icon="el-icon-delete" type="danger"/>
                </div>
            </el-form-item>
            <p class="headerLine">支付验证问题</p>
            <el-form-item>
                <template v-for="(item,index) in problemList">
                    <p class="fontSize14">问题{{index + 1}}</p>
                    <div :class="isWeb ? 'widthFixed' : 'widthAll'">
                        <el-input
                            class="marBottom10"
                            :maxlength="formItem.language === 'zh_CN' ? 60 : 180"
                            v-model="item.question"
                            placeholder="请输入问题"/>
                    </div>
                    <div :class="isWeb ? 'widthFixed' : 'widthAll'">
                        <el-input
                            v-model="item.answer"
                            :maxlength="formItem.language === 'zh_CN' ? 60 : 180"
                            placeholder="请输入答案"/>
                    </div>
                </template>
            </el-form-item>
            <el-collapse class="vip_activity" v-model="activeNames">
                <el-collapse-item title="演出介绍" name="1">
                    <el-form-item>
                        <!--富文本-->
                        <div id="editor_perform" class="editor"></div>
                    </el-form-item>
                </el-collapse-item>
                <!--
                <el-collapse-item title="购票须知" name="2">
                    <el-form-item>
                        <p class="fontSize14">限购说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.a"
                            placeholder="请输入限购说明"/>
                        <p class="fontSize14">实名制说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.b"
                            placeholder="请输入实名制说明"/>
                        <p class="fontSize14">儿童购票说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.c"
                            placeholder="请输入儿童购票说明"/>
                        <p class="fontSize14">座位类型说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.d"
                            placeholder="请输入座位类型说明"/>
                        <p class="fontSize14">发票说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.e"
                            placeholder="请输入发票说明"/>
                        <p class="fontSize14">退换政策</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.f"
                            placeholder="请输入退换政策"/>
                        <p class="fontSize14">演出时长</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="ticketItem.g"
                            placeholder="请输入演出时长"/>
                    </el-form-item>
                </el-collapse-item>
                <el-collapse-item title="演出须知" name="3">
                    <el-form-item>
                        <p class="fontSize14">入场时间</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.a"
                            placeholder="请输入入场时间说明"/>
                        <p class="fontSize14">禁止携带物品</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.b"
                            placeholder="请输入禁止携带物品说明"/>
                        <p class="fontSize14">寄存说明</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.c"
                            placeholder="请输入寄存说明"/>
                        <p class="fontSize14">最低演出时长</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.d"
                            placeholder="请输入最低演出时长说明"/>
                        <p class="fontSize14">最低演出曲目数</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.e"
                            placeholder="请输入最低演出曲目数说明"/>
                        <p class="fontSize14">主要演员(团体)</p>
                        <el-input
                            :maxlength="formItem.language === 'zh_CN' ? 120 : 360"
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="viewItem.f"
                            placeholder="请输入主要演员(团体)说明"/>
                    </el-form-item>
                </el-collapse-item>
                -->
            </el-collapse>
            <el-form-item class="marBottom50 marginTop20">
                <el-button @click="goBack" class="marRight20" type="default">返回</el-button>
                <el-button type="primary" @click="addData">发布</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../../components/Box";
    import E from 'wangeditor';

    export default {
        name: "VIP_ADD_ACTIVITY",
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
                    session: '', // 活动场次
                    limitNum: '1', // 限购张数
                    editor: null, // 富文本编辑器
                    imgUrlFlag: false, // 封面图标识
                    titleFlag: false, // 活动标题标识
                    timeFlag: false, // 活动时间标识
                    imgStatus: false, // 封面图上传进度标识
                    progressNum: 0, // 封面图上传进度
                    purposeFlag: false, // 活动描述标识
                    addressFlag: false, // 活动地点标识
                    sessionFlag: false, // 活动场次标识
                    limitNumFlag: false, // 限购张数
                    startTime: '', // 抢票开始时间
                    endTime: '', // 抢票结束时间
                    startTimeFlag: false, // 抢票开始时间标识
                    endTimeFlag: false, // 抢票结束时间标识
                    thumbnail: '', // 横板缩略图
                    thumbnailStatus: false, // 横板封面图状态
                    thumbnailProgressNum: 0, // 横板缩略图上传进度标识
                    thumbnailFlag: false, // 横板封面图标识
                },
                // 购票须知 (a、b、c是直接以json字符串存入数据库的,避免占用字符过多)
                ticketItem: {
                    a: '', // 限购说明
                    b: '', // 实名制说明
                    c: '', // 儿童购票说明
                    d: '', // 座位类型说明
                    e: '', // 发票说明
                    f: '', // 退换政策
                    g: '', // 演出时长
                },
                // 观影须知 (a、b、c是直接以json字符串存入数据库的,避免占用字符过多)
                viewItem: {
                    a: '', // 入场时间
                    b: '', // 禁止携带物品
                    c: '', // 寄存说明
                    d: '', // 最低演出时长
                    e: '', // 最低演出曲目数
                    f: '', // 主要演员(团体)
                },
                // 票面价格及数量
                ticketNum: [
                    {inventoryId: null, activityId: null, price: '0', count: '0'},
                ],
                // 验证问题
                problemList: [
                    {
                        questionId: null,
                        activityId: null,
                        question: '',
                        answer: ''
                    },
                    {
                        questionId: null,
                        activityId: null,
                        question: '',
                        answer: ''
                    },
                ],
                // 折叠面板
                activeNames: ['1']
            }
        },
        methods: {
            // 返回按钮
            goBack() {
                var _t = this;
                _t.$router.push({name: 'VIP_CONTENT'});
            },
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                if (val === null) {
                    val = '';
                } else if (flag === 'timeFlag' || flag === 'startTimeFlag' || flag === 'endTimeFlag') {
                    val = val === '' ? val : new Date(val).getTime().toString()
                }
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
            // 横板封面图上传之前
            beforeUploadThumbnail(file) {
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
            // 横板封面图上传时
            uploadProcessThumbnail(event, file, fileList) {
                let _t = this;
                _t.formItem.thumbnailStatus = true;
                _t.formItem.thumbnailProgressNum = parseInt(file.percentage);
            },
            // 横板封面图上传成功
            thumbnailUploadSuccess(val, file, fileList) {
                let _t = this;
                if (val.status === 200) {
                    _t.formItem.thumbnail = val.url[0].filePath;
                    _t.formItem.thumbnailFlag = false;
                    _t.formItem.thumbnailStatus = false;
                }
            },
            // 横板封面图上传失败
            thumbnailUploadError(err, file, fileList) {
                let _t = this;
                _t.formItem.thumbnailFlag = false;
                _t.formItem.thumbnailStatus = false;
                _t.$message.error('图片上传失败!');
            },
            // 添加票价及库存
            addTicket() {
                var _t = this;
                var Obj = new Object();
                Obj.inventoryId = null;
                Obj.activityId = null;
                Obj.price = '0';
                Obj.count = '0';
                _t.ticketNum.push(Obj);
            },
            // 删除票面价格
            delTicket(item, index) {
                var _t = this;
                if (_t.ticketNum.length !== 0) {
                    _t.ticketNum.splice(index, 1);
                }
            },
            // 点击发布按钮
            addData() {
                var _t = this;
                // 校验语言
                _t.blurInput(_t.formItem, 'languageFlag', _t.formItem.language);
                // 校验横板封面图
                _t.blurInput(_t.formItem, 'thumbnailFlag', _t.formItem.thumbnail);
                // 校验竖版封面图
                _t.blurInput(_t.formItem, 'imgUrlFlag', _t.formItem.imgUrl);
                // 校验标题
                _t.blurInput(_t.formItem, 'titleFlag', _t.formItem.title);
                // 校验活动时间
                _t.blurInput(_t.formItem, 'timeFlag', _t.formItem.time);
                // 校验活动描述
                // _t.blurInput(_t.formItem, 'purposeFlag', _t.formItem.purpose);
                // 校验活动地点
                _t.blurInput(_t.formItem, 'addressFlag', _t.formItem.address);
                // 校验活动场次
                // _t.blurInput(_t.formItem, 'sessionFlag', _t.formItem.session);
                // 校验抢票开始时间
                _t.blurInput(_t.formItem, 'startTimeFlag', _t.formItem.startTime);
                // 校验抢票截至时间
                _t.blurInput(_t.formItem, 'endTimeFlag', _t.formItem.endTime);
                // 校验支付验证问题
                _t.problemList.forEach((item) => {
                    // 处理支付验证问题
                    if (item.question.trim() === '' && item.answer.trim() !== '') {
                        item.answer = '';
                    } else if (item.question.trim() !== '' && item.answer.trim() === '') {
                        item.question = '';
                    }
                });
                // 可以提交 发送请求
                if (_t.formItem.languageFlag === false
                    && _t.formItem.thumbnailFlag === false
                    && _t.formItem.imgUrlFlag === false
                    && _t.formItem.titleFlag === false
                    && _t.formItem.timeFlag === false
                    && _t.formItem.startTimeFlag === false
                    && _t.formItem.endTimeFlag === false
                    && _t.formItem.addressFlag === false) {
                    // 校验活动时间、抢票开始时间、结束时间
                    let activityTime = new Date(_t.formItem.time).getTime();
                    let startTime = new Date(_t.formItem.startTime).getTime();
                    // 抢票开始时间不能大于活动时间
                    if (startTime >= activityTime) {
                        _t.$message.warning('抢票开始时间不能大于活动时间');
                        return;
                    }
                    if (_t.formItem.endTime !== '' && _t.formItem.endTime !== null) {
                        let endTime = new Date(_t.formItem.endTime).getTime();
                        // 抢票截至时间不能小于开始时间
                        if (endTime <= startTime) {
                            _t.$message.warning('抢票截至时间不能小于开始时间');
                            return;
                        }
                        // 抢票截至时间不能大于活动时间
                        if (endTime > activityTime) {
                            _t.$message.warning('抢票截至时间不能大于活动时间');
                            return;
                        }
                    }
                    _t.saveActivity();
                }
            },
            // 保存活动信息
            saveActivity() {
                var _t = this;
                let formatText = _t.formItem.editor.txt.html().trim().replace(/\"/g, "'");
                // 拼接缩略图
                let thumbnail = new Array();
                // 先push竖版缩略图
                thumbnail.push(_t.formItem.imgUrl);
                // 后push横板缩略图
                thumbnail.push(_t.formItem.thumbnail);
                _t.$api.post('activity/saveActivity/push', {
                    id: null, // id
                    contenId: null, // 内容id
                    language: _t.formItem.language, // 语言
                    activityTitle: _t.formItem.title.trim(), // 标题
                    thumbnail: thumbnail.join(','), // 图片
                    activityTime: _t.formItem.time === '' ? null : new Date(_t.formItem.time).getTime(), // 活动时间
                    // activityPurpose: _t.formItem.purpose.trim(), // 活动描述
                    activityAddress: _t.formItem.address.trim(), // 活动地点
                    // activitySession: new Date(_t.formItem.session).getTime(), // 活动场次
                    activityRestriction: _t.formItem.limitNum.trim(), // 限购票数
                    isVipActivity: 1, // 是否vip
                    startTime: _t.formItem.startTime === '' ? null : new Date(_t.formItem.startTime).getTime(), // 抢票开始时间
                    endTime: _t.formItem.endTime === '' ? null : new Date(_t.formItem.endTime).getTime(), // 抢票截至时间
                    showIntroduce: formatText, // 演出介绍
                    // buyerReading: JSON.stringify(_t.ticketItem), // 购买须知
                    // viewingReading: JSON.stringify(_t.viewItem), // 观影须知
                    releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 用户id
                }, function (res) {
                    switch (res.status) {
                        case 200: // 保存成功
                            // 获取id 保存票面价格
                            if (res.data !== undefined && res.data !== null && res.data.id !== undefined) {
                                // 保存票价信息
                                _t.saveActivityPrice(res.data.id);
                            } else {
                                _t.$message.error('获取活动信息失败!');
                            }
                            break;
                        case 2010: // 名称重复
                            _t.$message.error('活动名称已存在,请重新输入!');
                            break;
                        default: // 失败
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 保存活动票价信息
            saveActivityPrice(id) {
                var _t = this;
                var ticketNum = new Array();
                _t.ticketNum.forEach((item) => {
                    var Obj = new Object();
                    Obj.inventoryId = item.inventoryId;
                    Obj.activityId = item.activityId;
                    Obj.price = item.price.trim() * 100;
                    Obj.count = item.count;
                    ticketNum.push(Obj);
                });
                _t.$api.post('inventory/saveInventory', {
                    activityId: id, // 活动id
                    ticketId: null, // 商品id
                    ticketNum: JSON.stringify(ticketNum), // 票价及库存集合
                    problemList: JSON.stringify(_t.problemList), // 问题及答案集合
                }, function (res) {
                    switch (res.status) {
                        case 200: // 保存成功
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
                        default: // 保存失败
                            _t.$message.error('保存票价信息失败!');
                            break;
                    }
                });
            }
        },
        mounted() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            // 初始化编辑器
            _t.formItem.editor = new E('#editor_perform');
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
            _t.formItem.editor.customConfig.uploadImgServer = _t.$api.root() + 'upload/upload';
            _t.formItem.editor.customConfig.uploadImgTimeout = 100000000; // 设置超时
            _t.formItem.editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024; // 设置图片上传大小
            //开启wangEditor的错误提示
            _t.formItem.editor.customConfig.debug = true;
            _t.formItem.editor.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result, editor) {
                    if (result.status === 200) {
                        insertImg(_t.$api.imgUrl() + result.url[0].filePath);
                    }
                }
            };
            _t.formItem.editor.create();
        }
    }
</script>

<style scoped>

</style>
