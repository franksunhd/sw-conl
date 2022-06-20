<template>
    <Box>
        <el-form :model="formItem">
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
        name: "TEAM_INFORMATION",
        components: {Box},
        data() {
            return {
                isWeb: false,
                formItem: {},
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
            // 保存
            addData() {
                let _t = this;
                // 校验社交网站及链接
                var linkArr = new Array();
                var isError = 0;
                _t.listData.forEach((item) => {
                    // 不为空去解析
                    var Obj = new Object();
                    if (item.headPortrait.trim() !== '') {
                        Obj.judgeMark = '2'; // 团队社交
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
                // 可以提交
                if (isError === 0
                    && linkArr.length !== 0) {
                    _t.$api.post('artistSocial/saveArtistSocial', {
                        judgeMark: '2', // 0: 头像 1: 个人社交  2: 团队社交
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
                    judgeMark: '2', // 0: 头像 1: 个人社交  2: 团队社交
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            // 处理团队社交网站
                            if (res.type2 !== undefined && res.type2 !== null && res.type2.length !== 0) {
                                // 为 2 代表工作室社交网站
                                _t.listData = res.type2;
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
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
