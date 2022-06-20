<template>
    <Box>
        <!--留言板-->
        <div class="messageBox marBottom50">
            <div class="message_notData" v-if="replyData.length === 0">
                暂无用户给您留言
            </div>
            <!--循环部分-->
            <div class="message_box" v-for="(item,index) in replyData" :key="index">
                <!--头像区域-->
                <div class="headImg">
                    <img :src="item.imgUrl" alt="">
                </div>
                <!--内容区域-->
                <div class="contentBox">
                    <!--头部-->
                    <div class="header_Box">
                        <div class="title">{{item.fromReplyUserName}}</div>
                        <div class="time">{{item.replyTime}}</div>
                    </div>
                    <!--描述-->
                    <div class="content_desBox">
                        <div class="content_des wordBreak marRight10">{{item.replyMessage}}</div>
                        <el-button
                            type="text"
                            @click="deleteReview(item)"
                            class="buttonBox redColor">删除留言
                        </el-button>
                    </div>
                    <!--回复内容区域-->
                    <div v-if="item.sonList.length !== 0 && item.sonList !== null">
                        <div class="sonList" v-for="(data,k) in item.sonList" :key="k">
                            <div class="base-img"><img :src="data.headImg" alt=""></div>
                            <div class="flex_1">
                                <span class="discuss-blue">{{data.fromReplyUserName}}：</span>
                                <span class="blueColor">@{{item.fromReplyUserName}}</span>
                                <span class="wordBreak">{{data.replyMessage}}</span>
                                <el-button
                                    @click="deleteReturn(data,item)"
                                    class="redColor marginLR10 reviewBox_delete"
                                    type="text">删除回复
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <!--回复按钮及输入框区域-->
                    <div v-else class="reviewBox">
                        <div v-if="item.status === true">
                            <div class="inputGroup">
                                <el-input class="inputBox" maxlength="300" show-word-limit v-model="item.contentText"/>
                                <el-button class="inputBtn" type="text" @click="send_msg(item)">
                                    提 交
                                </el-button>
                            </div>
                        </div>
                        <div class="displayInlineBlock" v-if="item.status === false">
                            <el-button
                                type="text"
                                class="buttonBox"
                                @click="reviewContent(replyData,item)">
                                回复
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!--分页-->
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
    </Box>
</template>

<script>
    import Box from "../../../../../components/Box";
    import {dateFilter} from "../../../../../assets/js/filters";

    export default {
        name: "MESSAGE",
        components: {Box},
        data() {
            return {
                // 留言表列表
                replyData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            // 改变当前页码
            handleCurrentChange(val) {
                var _t = this;
                _t.options.currentPage = val;
                _t.getLeaveMessage();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                var _t = this;
                _t.options.pageSize = val;
                _t.getLeaveMessage();
            },
            // 查询留言
            getLeaveMessage() {
                var _t = this;
                _t.$api.get('leavemessage/get/leavemessage/' + _t.options.currentPage + '/' + _t.options.pageSize, {}, function (res) {
                    switch (res.status) {
                        case 200:
                            var replyData = res.data.content === null ? [] : res.data.content;
                            var parentIdArr = new Array();
                            replyData.forEach((item) => {
                                item.status = false; // 回复状态
                                item.contentText = ''; // 回复输入框的值
                                // 处理时间戳
                                item.replyTime = dateFilter(item.replyTime);
                                // 处理图片
                                if (item.headImg !== undefined && item.headImg !== null) {
                                    item.imgUrl = _t.$api.imgUrl() + item.headImg;
                                } else {
                                    item.imgUrl = '';
                                }
                                item.sonList = new Array();
                                parentIdArr.push(item.id);
                            });
                            if (parentIdArr.length !== 0) {
                                _t.getDynamicData(parentIdArr, replyData);
                            } else {
                                _t.replyData = [];
                                _t.$store.commit('setLoading', false);
                            }
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        default:
                            _t.replyData = [];
                            _t.options.total = 0;
                            _t.$message.error('查询出错!');
                            break;
                    }
                });
            },
            // 查询留言列表下回复详情
            getDynamicData(parentIdArr, replyData) {
                var _t = this;
                _t.$api.post('dynamic/getleavemessageReply', {
                    privateInfoIds: parentIdArr.join(','),
                }, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200:  // 查询成功
                            var resData = res.data !== null ? res.data : [];
                            replyData.forEach((item) => {
                                resData.forEach((val) => {
                                    // 目前只取第一条回复
                                    if (val !== null && val.length !== 0) {
                                        if (item.id === val[0].privateInfoId) {
                                            val.forEach((data) => {
                                                if (data.headImg !== undefined && data.headImg !== null) {
                                                    data.headImg = _t.$api.imgUrl() + data.headImg;
                                                } else {
                                                    data.headImg = '';
                                                }
                                            });
                                            item.sonList = val;
                                        }
                                    }
                                });
                            });
                            _t.replyData = replyData;
                            break;
                        default:
                            _t.$message.error('查询出错!');
                            break;
                    }
                });
            },
            // 删除留言
            deleteReview(item) {
                var _t = this;
                _t.$confirm('确认删除粉丝对您的的留言吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('leavemessage/delete/leavemessage/' + item.id, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                // 删除成功
                                _t.$message.success(res.message);
                                _t.getLeaveMessage();
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
            // 删除回复
            deleteReturn(data, item) {
                var _t = this;
                _t.$confirm('确认删除您对粉丝的回复吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _t.$api.post('dynamic/delete/ownreply/' + data.id, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                // 删除成功
                                _t.$message.success(res.message);
                                if (item.sonList !== null) {
                                    item.sonList.forEach((val, index) => {
                                        if (data.id === val.id) {
                                            item.sonList.splice(index, 1);
                                        }
                                    });
                                }
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
            // 发送回复
            send_msg(item) {
                var _t = this;
                _t.$api.post('dynamic/reply', {
                    privateInfoId: item.id, // 动态信息表id
                    fromReplyUserId: _t.getCookie('TEAM_WANG_USER_ID'), // 回复人id
                    replyMessage: item.contentText.trim(), // 回复内容
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            _t.getLeaveMessage();
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        created() {
            var _t = this;
            _t.$store.commit('setLoading', true);
            _t.getLeaveMessage();
        }
    }
</script>

<style scoped>
    .message_notData {
        text-align: center;
        line-height: 100px;
        border-bottom: 1px solid #e6e6e6;
    }

    .message_box {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #DEDFE4;
    }

    .message_box .headImg {
        margin-right: 10px;
    }

    .message_box .headImg img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
    }

    .message_box .contentBox {
        flex: 1;
    }

    .header_Box {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
    }

    .header_Box .title {
        font-size: 18px;
        font-weight: bold;
    }

    .content_desBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .content_des {
        margin-bottom: 10px;
        font-size: 14px;
        flex: 1;
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

    .sonList {
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .sonList span {
        vertical-align: middle;
    }

    .base-img {
        width: 30px;
        height: 30px;
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;
        font-size: 0;
        margin-right: 10px;
    }

    .base-img img {
        width: 100%;
        height: 100%;
        vertical-align: baseline;
    }

    .base-img + div {
        line-height: 20px;
    }

    .reviewBox_delete {
        padding: 0;
        font-size: 14px;
    }

    .buttonBox {
        padding-top: 0 !important;
    }
</style>
