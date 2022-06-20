<template>
    <Box>
        <el-form :model="formItem">
            <p class="star formTitle marBottom10">菜单名称</p>
            <el-form-item>
                <el-input
                    :class="isWeb ? 'widthFixed' : 'widthAll'"
                    v-model="formItem.name"
                    @blur="blurInput(formItem,'nameFlag',formItem.name)"
                    placeholder="请输入菜单名称"/>
                <div v-if="formItem.nameFlag" class="isNotNullText">必填项不能为空</div>
            </el-form-item>
            <el-form-item>
                <el-button type="default" @click="goBack">返回</el-button>
                <el-button type="primary" @click="saveData">保存</el-button>
            </el-form-item>
        </el-form>
    </Box>
</template>

<script>
    import Box from "../../../../components/Box";

    export default {
        name: "EDIT_MENU",
        components: {Box},
        data() {
            return {
                isWeb: false,
                // 查询表单
                formItem: {
                    id: '', // 菜单id
                    name: '', // 菜单名称
                    nameFlag: false, // 菜单标识
                }
            }
        },
        methods: {
            // 返回上一级
            goBack() {
                let _t = this;
                _t.$router.push({name: 'MENU_MANAGE'});
            },
            // 校验函数
            blurInput(item, flag, val) {
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                item[flag] = val.trim() === '' ? true : false;
            },
            // 查询详情
            getData() {
                var _t = this;
                _t.$store.commit('setLoading', true);
                _t.$api.get('menu/getMenuInfoById/' + _t.formItem.id, {}, function (res) {
                    _t.$store.commit('setLoading', false);
                    switch (res.status) {
                        case 200: // 获取成功
                            if (res.data !== undefined && res.data !== null) {
                                _t.formItem.name = res.data.menuName !== undefined && res.data.menuName !== null ? res.data.menuName : '';
                            }
                            break;
                        default: // 获取失败
                            break;
                    }
                });
            },
            // 保存按钮
            saveData() {
                var _t = this;
                if (_t.formItem.id === '') {
                    _t.$message.warning('菜单id为空!');
                    return;
                }
                // 校验菜单名称
                _t.blurInput(_t.formItem, 'nameFlag', _t.formItem.name);
                // 可以提交
                if (_t.formItem.nameFlag === false) {
                    _t.$api.post('menu/updateMenuInfoById', {
                        id: _t.formItem.id, // 菜单id
                        menuName: _t.formItem.name.trim()
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 修改成功
                                _t.$alert('修改成功', '温馨提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    _t.goBack();
                                }).catch(() => {
                                    _t.goBack();
                                });
                                break;
                            default: // 修改失败
                                _t.$message.error('修改失败!');
                                break;
                        }
                    })
                }
            }
        },
        created() {
            let _t = this;
            let equipment_type = document.body.getAttribute('data_equipment');
            // 设备状态
            _t.isWeb = equipment_type === 'web' ? true : false;
            let id = _t.$route.params.TEAM_WANG_MENU_ID ? _t.$route.params.TEAM_WANG_MENU_ID : localStorage.getItem('TEAM_WANG_MENU_ID');
            if (id !== null && id !== 'null') {
                _t.formItem.id = id;
            }
            _t.getData();
        }
    }
</script>

<style scoped>

</style>
