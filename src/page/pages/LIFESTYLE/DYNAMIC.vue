<template>
    <Box>
        <!--内容输入模块-->
        <div class="inputBox">
            <el-form :model="formItem">
                <el-input
                    type="textarea"
                    v-model="formItem.textarea"
                    :rows="15"
                    resize="none"/>
                <!--富文本输入框-->
                <!--
                <el-form-item>
                    <div id="editor" class="editor"></div>
                </el-form-item>
                -->
            </el-form>
            <ul class="optionsBox clearFix">
                <li
                    id="optionsPhoto"
                    :class="isActive === 'photo' ? 'is-active': ''"
                    @click="clickUpload('photo')">
                    <i class="el-icon-picture fontSize14"></i>
                    <span class="rightSpan">照片</span>
                </li>
                <li
                    id="optionsVideo"
                    :class="isActive === 'video' ? 'is-active': ''"
                    @click="clickUpload('video')">
                    <i class="el-icon-video-camera fontSize14"></i>
                    <span class="rightSpan">视频</span>
                </li>
                <li class="fr marginRight0">
                    <el-button @click="addData" type="primary">发布</el-button>
                </li>
            </ul>
            <!--显示-->
            <div v-if="isActive === 'photo'">
                <el-upload
                    ref="imgFile"
                    :action="this.$api.root() + 'upload/upload'"
                    list-type="picture-card"
                    name="file"
                    :limit="9"
                    :accept="formItem.accept"
                    :before-upload="beforeUploadImg"
                    :on-success="handleSuccessImg"
                    :on-error="handleErrorImg"
                    :on-remove="handleRemoveImg">
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">最多上传9张,只能上传jpeg、png、jpg格式的文件,且图片大小不能大于20M</div>
                </el-upload>
            </div>
            <div v-else-if="isActive === 'video'">
                <p class="formTitle_mv">上传视频</p>
                <el-upload
                    ref="mvFile"
                    class="uploadWeb"
                    :action="this.$api.root() + 'upload/upload'"
                    name="file"
                    :show-file-list="false"
                    :accept="formItem.acceptVideo"
                    :on-progress="uploadProcessMV"
                    :before-upload="beforeUploadMV"
                    :on-success="mvUploadSuccess"
                    :on-error="mvUploadError">
                    <video
                        v-if="formItem.mvPathUrl !=='' && formItem.mvUrlStatus === false"
                        :src="this.$api.imgUrl() + formItem.mvPathUrl"
                        class="mv_avatar"
                        controls="controls">您的浏览器不支持视频播放
                    </video>
                    <i v-else-if="formItem.mvPathUrl ==='' && formItem.mvUrlStatus === false" class="el-icon-plus"></i>
                    <el-progress
                        v-if="formItem.mvUrlStatus === true" type="circle"
                        style="margin-top: 10px;"
                        :percentage="formItem.progressNum"/>
                    <div slot="tip" class="el-upload__tip">只能上传mp4、ogg、flv、avi、wmv、rmvb、mov格式,且文件大小不能大于500M</div>
                </el-upload>
            </div>
            <hr>
        </div>
        <!--发布内容模块-->
        <div class="contentModule marBottom50">
            <!--头部选择年份及是否vip-->
            <div class="titleBox">
                <el-form v-model="addEdit" :inline="isWeb ? true : false">
                    <el-form-item label="年份">
                        <el-select
                            :class="isWeb ? 'widthFixed' : 'widthAll'"
                            v-model="addEdit.year">
                            <el-option
                                v-for="(item,index) in yearList"
                                :key="index" :label="item.label"
                                :value="item.value"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <ul class="content_box">
                <!--循环内容项-->
                <li v-for="(item,index) in listData" :key="index">
                    <!--头部区域-->
                    <div class="content_titleBox">
                        <!--头像-->
                        <div class="content_img">
                            <img :src="item.headImagePath" alt="head">
                        </div>
                        <div class="content_text">
                            <div class="content_title">
                                <p class="title">{{item.releaseName}}</p>
                                <div class="deleteBtn">
                                    <el-button @click="deleteDynamic(item)" class="redColor" type="text">删除动态
                                    </el-button>
                                </div>
                            </div>
                            <p class="time">{{item.releaseTime}}</p>
                            <!--动态内容-->
                            <div v-html="item.dynamicContentStrShow" class="content_des wordBreak"></div>
                            <div v-if="item.flag !== 0">
                                <el-button type="text" @click="showOrNot(item)">
                                    {{item.flag === 1 ? '展开' : (item.flag === 2 ? '收起' : '')}}
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <!--图片视频区域-->
                    <div class="content_mvOrPhoto">
                        <!--图片-->
                        <div class="content_photoBox" v-if="item.dynamicType === 0">
                            <div @click="showImg(val)" class="content_photo"
                                 v-for="(val,i) in item.dynamicFilePathCache" :key="i">
                                <div class="message_img" :style="{backgroundImage:'url('+val+')'}">
                                    <img class="visibilityHidden" src="../../../assets/img/lifestyle.png" alt="">
                                </div>
                            </div>
                        </div>
                        <!--视频-->
                        <div class="contentMvBox" v-else-if="item.dynamicType === 1">
                            <div class="play_print" @click="clickVideo(item)">
                                <div class="message_img fixedMvBg">
                                    <img class="visibilityHidden" src="../../../assets/img/lifestyle_mv.png" alt="">
                                </div>
                                <div class="play_imgBox">
                                    <img :class="isWeb ? '' : 'play'" class="icon"
                                         src="../../../assets/img/play_icon.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--评论区域-->
                    <div class="discussList">
                        <!--循环评论-->
                        <div class="for_discuss">
                            <div class="for" v-for="(review,j) in item.discussArr" :key="j">
                                <div class="dis_content">
                                    <div class="headImg">
                                        <img :src="review.headImg" alt="">
                                    </div>
                                    <div class="flex_1">
                                        <div class="fontSize14">
                                            <span class="discuss-blue">{{review.fromReplyUserName}}</span>
                                            <span>：</span>
                                            <span class="wordBreak">{{review.replyMessage}}</span>
                                            <el-button
                                                type="text"
                                                @click="deleteReview(review,item)"
                                                class="redColor marginLR10 reviewBox_delete">删除评论
                                            </el-button>
                                        </div>
                                        <div class="font13 marginTop5 grayColor">{{review.replyTime}}</div>
                                    </div>
                                </div>
                                <div class="dis_content_base marginTop5">
                                    <div v-if="review.sonList.length !== 0 && review.sonList !== null">
                                        <div class="sonList" v-for="(data,k) in review.sonList" :key="k">
                                            <div class="base-img"><img :src="data.headImg" alt=""></div>
                                            <div class="flex_1">
                                                <div class="fontSize14">
                                                    <span class="discuss-blue">{{data.fromReplyUserName}}：</span>
                                                    <span class="blueColor">@{{review.fromReplyUserName}}</span>
                                                    <span class="text wordBreak">{{data.replyMessage}}</span>
                                                    <el-button @click="deleteReturn(data,review)"
                                                               class="redColor marginLR10 reviewBox_delete"
                                                               type="text">删除回复
                                                    </el-button>
                                                </div>
                                                <div class="font13 marginTop5 grayColor">{{data.replyTime}}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="reviewBox">
                                        <div v-if="review.status === true">
                                            <div class="inputGroup">
                                                <el-input class="inputBox" maxlength="300" show-word-limit
                                                          v-model="review.contentText"/>
                                                <el-button class="inputBtn" type="text" @click="send_msg(review)">
                                                    提 交
                                                </el-button>
                                            </div>
                                        </div>
                                        <div class="displayInlineBlock" v-if="review.status === false">
                                            <el-button type="text" @click="reviewContent(item.discussArr,review)">回复
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @click="getMoreData(item,true)" class="discussMore" v-if="item.discussArr !== null">MORE
                        </div>
                    </div>
                </li>
            </ul>
            <!--分页-->
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--详情-->
        <el-dialog
            class="videoDialog"
            :visible.sync="dialogVisible"
            append-to-body
            :before-close="resetVideo"
            :close-on-press-escape="false"
            :close-on-click-modal="false">
            <video
                ref="videoDialog"
                width="100%"
                height="100%"
                controls="controls"
                :poster="detailForm.img" class="video">
                <source :src="detailForm.url">
            </video>
        </el-dialog>
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="false"
            :visible.sync="dialogVisibleImg"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgItem">
        </el-dialog>
    </Box>
</template>
<script>
    import Box from "../../../components/Box";
    import E from 'wangeditor';
    import {dateFilter} from "../../../assets/js/filters";
    import {emotions} from "../../../assets/js/emotions";

    export default {
        name: "DYNAMIC",
        components: {Box},
        data() {
            return {
                isActive: 'photo', // 选中
                isWeb: false, // 是否web端
                // 输入表单
                formItem: {
                    accept: 'image/*',
                    acceptVideo: 'video/*',
                    textarea: '', // 发布内容
                    vipLifestyle: '1', // 0:vip 1:普通
                    imgUrl: [], // 图片集合
                    mvPathUrl: '', // 视频路径地址
                    progressNum: 0, // 视频上传进度
                    mvUrlStatus: false, // 视频上传状态
                    editor: null, // 富文本
                },
                // 查询表单
                addEdit: {
                    year: new Date().getFullYear(), // 当前年
                    vipLifestyle: '1', // 0:vip 1:普通
                },
                // 列表数据
                listData: [],
                // 年份列表
                yearList: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
                },
                // 初始化more分页
                moreOptions: {
                    pageSize: 5, // 每页显示条数
                    total: 0, // 初始化总条数
                },
                // 蒙版
                dialogVisible: false,
                // 视频蒙版
                detailForm: {
                    img: '', // 蒙版图片
                    url: '', // 视频文件
                },
                dialogVisibleImg: false, // 图片蒙版
                imgItem: '', // 图片地址
            }
        },
        methods: {
            // 动态展开还是收缩
            showOrNot(item) {
                let _t = this;
                if (item.flag === 1) {
                    // 展开操作
                    let str = _t.returnHtmlContent(item.dynamicContentStr, true);
                    item.dynamicContentStrShow = str.data;
                    item.flag = 2;
                } else {
                    // 收起操作
                    let obj = _t.returnHtmlContent(item.dynamicContentStr, false);
                    item.dynamicContentStrShow = obj.data;
                    item.flag = 1;
                }
            },
            // 重置图片
            resetImg() {
                var _t = this;
                _t.dialogVisibleImg = false;
                _t.imgItem = '';
            },
            // 显示图片
            showImg(item) {
                var _t = this;
                _t.dialogVisibleImg = true;
                _t.imgItem = item;
            },
            // 上传时
            handleSuccessImg(file) {
                var _t = this;
                if (file.status === 200) {
                    if (file.url.length !== 0 && file.url[0].filePath !== undefined && file.url[0].filePath !== null) {
                        _t.formItem.imgUrl.push(file.url[0].filePath);
                    }
                }
            },
            // 点击删除
            handleRemoveImg(file) {
                var _t = this;
                _t.formItem.imgUrl.forEach((item, index) => {
                    if (item === file.response.url[0].filePath) {
                        _t.formItem.imgUrl.splice(index, 1);
                    }
                });
            },
            // 点击上传图片还是视频
            clickUpload(item) {
                var _t = this;
                _t.isActive = _t.isActive === item ? '' : item;
            },
            // 上传mv前
            beforeUploadMV(file) {
                var _t = this;
                var mvType = _t.$api.mvType();
                var isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的视频格式');
                }
                // 校验视频大小
                var isLt100M = file.size / 1024 / 1024 < 500;
                if (!isLt100M) {
                    _t.$message.error('视频大小不能大于500M');
                }
                return isMv && isLt100M;
            },
            // 上传过程中
            uploadProcessMV(event, file, fileList) {
                var _t = this;
                _t.formItem.mvUrlStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 上传mv成功后
            mvUploadSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.mvPathUrl = val.url[0].filePath;
                } else {
                    _t.$message.error('视频上传失败,请重新上传!');
                }
                _t.formItem.mvUrlStatus = false;
            },
            // 上传mv失败后
            mvUploadError(err, file, fileList) {
                var _t = this;
                _t.formItem.mvUrlStatus = false;
                _t.$message.error('视频上传失败,请重新上传!');
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
                return isImg && isLt20M;
            },
            // 图片上传失败
            handleErrorImg(err, file, fileList) {
                var _t = this;
                _t.$message.error('图片上传失败!');
            },
            // 点击回复按钮
            reviewContent(item, val) {
                // 全部转为不显示
                item.forEach((key) => {
                    key.status = false;
                    key.contentText = '';
                });
                // 当前转为显示
                val.status = true;
            },
            // 点击删除评论按钮 --- 粉丝对王嘉尔的评论
            deleteReview(item, itemFlag) {
                var _t = this;
                _t.$confirm('确认删除粉丝对您的的评论吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('dynamic/delete/message/' + item.privateInfoId + '/' + item.id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success(res.message);
                                _t.getMoreData(itemFlag, false);
                                break;
                            default:
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }).catch(() => {
                    return false;
                });
            },
            // 获取more 的数据
            getMoreData(item, flag) {
                var _t = this;
                if (flag === true) {
                    item.moreLimit += _t.moreOptions.pageSize;
                }
                _t.$api.post('dynamic/get/message', {
                    privateInfoIds: item.id, // 动态表id
                    limit: item.moreLimit, // 每页显示条数
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== null && res.data.length !== 0) {
                                // 数据条数相同 且点击more
                                if (res.data[0].length === item.discussArr.length && flag === true) {
                                    _t.$message.warning('没有更多数据了!');
                                } else {
                                    var discussArr = res.data[0] === undefined || res.data[0] === null ? [] : res.data[0];
                                    discussArr.forEach((val) => {
                                        val.status = false; // 是否回复
                                        val.contentText = ''; // 回复输入框的值
                                        // 处理一级头像
                                        if (val.headImg !== undefined && val.headImg !== null) {
                                            val.headImg = _t.$api.imgUrl() + val.headImg;
                                        } else {
                                            val.headImg = '';
                                        }
                                        // 处理评论时间
                                        if (val.replyTime !== undefined && val.replyTime !== null) {
                                            val.replyTime = dateFilter(val.replyTime);
                                        }
                                        // 判断是否有二级
                                        if (val.sonList !== undefined && val.sonList !== null && val.sonList.length !== 0) {
                                            val.sonList.forEach((data) => {
                                                // 处理二级头像
                                                if (data.headImg !== undefined && data.headImg !== null) {
                                                    data.headImg = _t.$api.imgUrl() + data.headImg;
                                                } else {
                                                    data.headImg = '';
                                                }
                                                // 处理评论时间
                                                if (data.replyTime !== undefined && data.replyTime !== null) {
                                                    data.replyTime = dateFilter(data.replyTime);
                                                }
                                            });
                                        }
                                    });
                                    item.discussArr = discussArr;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 点击删除回复按钮 --- 王嘉尔对粉丝的回复
            deleteReturn(item, review) {
                var _t = this;
                _t.$confirm('确认删除您对粉丝的回复吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('dynamic/delete/ownreply/' + item.id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success(res.message);
                                if (review.sonList !== null) {
                                    review.sonList.forEach((val, index) => {
                                        // 找到id相同的
                                        if (item.id === val.id) {
                                            review.sonList.splice(index, 1);
                                        }
                                    });
                                }
                                break;
                            default: // 删除失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }).catch(() => {
                    return false;
                });
            },
            // 王嘉尔删除自己发的动态
            deleteDynamic(item) {
                var _t = this;
                _t.$confirm('确认删除您发的动态吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('dynamic/delete/' + item.id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 删除成功
                                _t.$message.success(res.message);
                                // 刷新数据
                                _t.getData();
                                break;
                            default: // 删除失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }).catch(() => {
                    return false;
                });
            },
            // 点击播放
            clickVideo(item) {
                var _t = this;
                _t.detailForm.url = item.dynamicFilePathMvCache;
                _t.detailForm.img = item.dynamicFilePathMvThumbnail;
                _t.dialogVisible = true;
                _t.$nextTick(function () {
                    // 重新加载src指定的资源
                    _t.$refs.videoDialog.load();
                    // 自动播放
                    _t.$refs.videoDialog.play()
                })
            },
            // 点击关闭蒙版
            resetVideo() {
                var _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause()
            },
            // 改变当前页码
            handleCurrentChange(val) {
                var _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                var _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 获取列表数据
            getData() {
                var _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('dynamic/all', {
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示条数
                    vipLifestyle: _t.addEdit.vipLifestyle, // 0: 普通  1: VIP
                    year: _t.addEdit.year, // 年份
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200:
                            let listData = res.data.content !== null ? res.data.content : [];
                            let total = res.data.total !== undefined ? res.data.total : 0;
                            // 需要拼接数据的数组
                            let askArrIds = new Array();
                            listData.forEach((item, index) => {
                                item.discussArr = new Array(); // 评论集合初始化
                                item.moreLimit = _t.moreOptions.pageSize; // 初始化评论显示条数
                                item.moreTotal = _t.moreOptions.total; // 初始化评论总条数
                                item.dynamicContentStrShow = ''; // 展示的动态内容
                                item.flag = 0; // 未截取
                                // 处理内容 flase 代表默认收起操作 true：代表展开操作
                                if(item.dynamicContentStr === undefined || item.dynamicContentStr === null) {
                                	item.dynamicContentStr = '';
                                }
                                let obj = _t.returnHtmlContent(item.dynamicContentStr, false);
                                item.dynamicContentStrShow = obj.data;
                                item.flag = obj.flag;
                                if (item.flag === 2) {
                                    item.flag = 0;
                                }
                                // 处理时间戳
                                if (item.releaseTime !== null) {
                                    item.releaseTime = dateFilter(item.releaseTime);
                                }
                                if (item.id !== undefined) {
                                    askArrIds.push(item.id);
                                }
                                // 处理一级数据 头像
                                if (item.headImagePath !== undefined && item.headImagePath !== null && item.headImagePath !== '') {
                                    item.headImagePath = _t.$api.imgUrl() + item.headImagePath;
                                } else {
                                    item.headImagePath = require('../../../assets/img/head.png');
                                }
                                // 处理图片和视频 0:图片 1:视频
                                if (item.dynamicType === 0) {
                                    // 图片 逗号分隔解析
                                    var dynamicFilePathCache = item.dynamicFilePath !== undefined ? item.dynamicFilePath.split(',') : [];
                                    for (var i = 0; i < dynamicFilePathCache.length; i++) {
                                        dynamicFilePathCache[i] = _t.$api.imgUrl() + dynamicFilePathCache[i]
                                    }
                                    item.dynamicFilePathCache = dynamicFilePathCache;
                                    item.dynamicFilePathMvCache = null;
                                    item.dynamicFilePathMvThumbnail = null;
                                } else if (item.dynamicType === 1) {
                                    item.dynamicFilePathCache = null;
                                    // 视频 文件
                                    item.dynamicFilePathMvCache = item.dynamicFilePath !== undefined ? _t.$api.imgUrl() + item.dynamicFilePath : null;
                                    // 视频缩略图
                                    item.dynamicFilePathMvThumbnail = require("../../../assets/img/mvPath.jpg");
                                }
                            });
                            // 有id集合数据才发送请求评论的接口
                            if (askArrIds.length !== 0) {
                                _t.getRecovery(listData, askArrIds, total);
                            } else {
                                _t.$store.commit('setLoading', false);
                                _t.listData = [];
                                _t.options.total = 0;
                                _t.options.currentPage = 1;
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 查询动态下的留言
            getRecovery(listData, ids, total) {
                var _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.post('dynamic/get/message', {
                    privateInfoIds: ids.join(','),
                    limit: _t.moreOptions.pageSize, // 初始每页显示的条数
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    var resData = res.data === null ? [] : res.data;
                    resData.forEach((item) => {
                        if (item.length !== 0) {
                            item.forEach((val) => {
                                val.status = false; // 是否回复
                                val.contentText = ''; // 回复输入框的值
                                // 判断1级头像
                                if (val.headImg !== undefined && val.headImg !== null) {
                                    val.headImg = _t.$api.imgUrl() + val.headImg;
                                } else {
                                    val.headImg = '';
                                }
                                // 处理评论时间
                                if (val.replyTime !== undefined && val.replyTime !== null) {
                                    val.replyTime = dateFilter(val.replyTime);
                                }
                                // 判断2级头像
                                if (val.sonList !== null && val.sonList.length !== 0) {
                                    val.sonList.forEach((data) => {
                                        if (data.headImg !== undefined && data.headImg !== null) {
                                            data.headImg = _t.$api.imgUrl() + data.headImg;
                                        } else {
                                            data.headImg = '';
                                        }
                                        // 处理评论时间
                                        if (data.replyTime !== undefined && data.replyTime !== null) {
                                            data.replyTime = dateFilter(data.replyTime);
                                        }
                                    });
                                }
                            });
                        }
                    });
                    listData.forEach((key) => {
                        resData.forEach((val) => {
                            // 目前只有一条评论
                            if (val.length !== 0 && key.id === val[0].privateInfoId) {
                                // 赋值
                                key.discussArr = val;
                                key.moreTotal = key.discussArr.length; // 总条数
                            }
                        });
                    });
                    _t.listData = listData;
                    _t.options.total = total;
                });
            },
            // 初始化年份
            initYear() {
                var _t = this;
                var year = new Date().getFullYear(); // 当前年份
                var yearList = new Array();
                do {
                    var obj = new Object();
                    obj.label = year + '年';
                    obj.value = year;
                    year--;
                    yearList.push(obj);
                } while (year !== 2018);
                _t.yearList = yearList;
            },
            // 发布按钮
            addData() {
                let _t = this;
                let formatText = _t.formItem.textarea.trim();
                // 判断发布内容是否为空
                if (formatText === ''
                    && _t.formItem.imgUrl.length === 0
                    && _t.formItem.mvPathUrl === '') {
                    _t.$message.warning('不能发布为空的数据');
                } else {
                    _t.addPost(formatText);
                }
            },
            // 发送请求
            addPost(formatText) {
                var _t = this;
                var dynamicType = null; // 上传标识
                var dynamicFilePath = null; // 资源路径
                var thumbnail = null; // 缩略图
                if (_t.isActive === 'photo' && _t.formItem.imgUrl.length !== 0) {
                    dynamicType = 0;
                    dynamicFilePath = _t.formItem.imgUrl.join(',');
                    thumbnail = null;
                } else if (_t.isActive === 'video' && _t.formItem.mvPathUrl !== '') {
                    dynamicType = 1;
                    dynamicFilePath = _t.formItem.mvPathUrl;
                    thumbnail = null;
                } else {
                    dynamicType = null;
                    dynamicFilePath = null;
                    thumbnail = null
                }
                _t.$api.post('dynamic/push', {
                    dynamicContent: formatText, // 发布内容
                    vipLifestyle: _t.formItem.vipLifestyle, // 是否vip模块
                    releaseId: _t.getCookie('TEAM_WANG_USER_ID'), // 发布人id
                    dynamicType: dynamicType, // 数据类别
                    dynamicFilePath: dynamicFilePath, // 资源路径
                    thumbnail: thumbnail, // 视频缩略图
                }, function (res) {
                    switch (res.status) {
                        case 200: // 操作成功
                            _t.getData();
                            // _t.formItem.editor.txt.clear(); // 清空富文本
                            _t.formItem.imgUrl = []; // 图片数组置为空
                            _t.formItem.mvPathUrl = ''; // 视频存为空
                            _t.formItem.textarea = ''; // 发布内容置为空
                            _t.$refs.imgFile.clearFiles(); // 清空照片墙
                            _t.$refs.mvFile.clearFiles(); // 清空视频
                            break;
                        default:
                            break;
                    }
                });
            },
            // 王嘉尔回复用户评论
            send_msg(item) {
                var _t = this;
                if (item.contentText.trim() !== '') {
                    _t.$api.post('dynamic/reply', {
                        privateInfoId: item.privateInfoId, // 动态信息表id
                        fromReplyUserId: _t.getCookie('TEAM_WANG_USER_ID'), // 回复人id
                        replyMessage: item.contentText.trim(), // 回复内容
                        parentId: item.id, // 给该id回复
                    }, function (res) {
                        switch (res.status) {
                            case 200:
                                _t.$message.success(res.message);
                                item.status = false;
                                // 手动给该项添加子级
                                var obj = new Object();
                                obj.id = res.data; // id 用于删除时使用
                                let headImg = _t.getCookie('TEAM_WANG_HEAD_IMG');
                                if (headImg !== null && headImg !== 'null') {
                                    obj.headImg = _t.$api.imgUrl() + headImg;
                                } else {
                                    obj.headImg = '';
                                }
                                obj.fromReplyUserName = _t.getCookie('TEAM_WANG_NICK_NAME');
                                obj.replyMessage = item.contentText.trim();
                                obj.replyTime = dateFilter(new Date().getTime());
                                if (item.sonList !== null) {
                                    item.sonList.push(obj);
                                }
                                break;
                            default:
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                } else {
                    _t.$confirm('不能回复为空的内容!', '温馨提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return false;
                    }).catch(() => {
                        return false;
                    });
                }
            }
        },
        mounted() {
            let _t = this;
            _t.$store.commit('setLoading', true);
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            _t.initYear();
            // 初始化编辑器
            // _t.formItem.editor = new E('#editor');
            // 自定义菜单配置
            // _t.formItem.editor.customConfig.menus = [
            //     'bold',
            //     'italic',
            //     'underline',
            //     'list',  // 列表
            //     'justify',  // 对齐方式
            //     // 'emoticon', // 自定义表情
            // ];
            // 样式过滤
            // _t.formItem.editor.customConfig.pasteFilterStyle = true;
            // _t.formItem.editor.customConfig.showLinkImg = false;

            // 配置表情
            // _t.formItem.editor.customConfig.emotions = emotions;

            // 开启wangEditor的错误提示
            // _t.formItem.editor.customConfig.debug = true;
            // _t.formItem.editor.create();
            _t.getData();
        }
    }
</script>

<style scoped>
    .optionsBox {
        margin: 10px 0;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }

    .optionsBox li {
        float: left;
        cursor: pointer;
        margin-right: 15px;
    }

    .optionsBox li.is-active {
        color: #4D91FE;
    }

    .optionsBox li.fr {
        float: right;
    }

    .content_box li {
        margin-bottom: 30px;
    }

    .content_titleBox {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #DFDEE4;
        padding-bottom: 20px;
    }

    .content_img {
        width: 60px;
        text-align: center;
        margin-right: 10px;
        padding-top: 10px;
    }

    .content_img img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
    }

    .content_text {
        flex: 1;
    }

    .content_title {
        margin-top: 10px;
        line-height: 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .content_title .title {
        font-size: 20px;
        font-weight: bold;
    }

    .content_text .time {
        font-size: 14px;
        color: #8c939d;
        text-align: left;
    }

    .content_des {
        font-size: 16px;
        margin-top: 10px;
    }

    .content_photo {
        width: 33.33%;
        font-size: 0;
        padding: 10px;
        display: inline-block;
        box-sizing: border-box;
        cursor: pointer;
    }

    .content_photo img {
        width: 100%;
    }

    .contentMvBox {
        padding-top: 20px;
    }

    .play_print {
        width: 33.33%;
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        cursor: pointer;
    }

    .play_print img {
        width: 100%;
        height: 100%;
    }

    .play_imgBox {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .play_imgBox .icon.play {
        width: 30px;
    }

    .dis_content {
        display: flex;
        align-items: baseline;
    }

    .dis_content .headImg {
        width: 40px !important;
        height: 40px !important;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 10px;
    }

    .dis_content .headImg img {
        width: 100%;
    }

    .dis_content_base {
        margin-left: 40px;
    }

    .dis_content_base div.sonList {
        display: flex;
        align-items: baseline;
        margin-bottom: 10px;
        font-size: 14px;
    }

    .dis_content_base .base-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
    }

    .dis_content_base .base-img img {
        width: 100%;
    }

    .discuss-blue {
        white-space: nowrap;
    }

    .discuss_text {
        flex: 1;
        word-wrap: break-word;
    }

    .discuss_text .text {
        margin-left: 10px;
    }

    .for_discuss {
        margin: 15px 0;
    }

    .for_discuss .for {
        padding: 10px 0;
        border-bottom: 1px solid #DFDEE4;
    }

    .discussMore {
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
    }

    .reviewBox {
        padding-left: 10px;
    }

    .inputGroup {
        display: flex;
        padding-top: 10px;
        margin-bottom: 10px;
    }

    .inputGroup .inputBox {
        flex: 1;
    }

    .inputGroup .inputBtn {
        width: 100px;
        padding: 0 20px;
        margin-left: 10px;
        background-color: #3c8dbc;
        color: #fff;
    }

    .reviewBox_delete {
        padding: 0;
        font-size: 14px;
    }

    @media screen and  (max-width: 1000px) {
        .content_title .title {
            font-size: 18px;
        }

        .content_photo {
            padding: 5px;
        }
    }
</style>
<style>
    .videoDialog .el-dialog {
        width: 80%;
    }

    @media screen and  (max-width: 1000px) {
        .videoDialog .el-dialog {
            width: 95%;
        }
    }

    .reviewBox .el-button {
        padding-top: 0;
    }
</style>
