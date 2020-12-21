<template>
	<div :class="{ mobile: isMobile }">
		<!-- 表格 -->
		<baseTable
			:theApi="theApi"
			:table-config="configData.tableConfig"
			:top-btn-config="configData.topBtnConfig"
			:bottom-btn-config="configData.bottomBtnConfig"
			:table-btn-config="configData.tableBtnConfig"
			:other-config="configData.otherConfig"
			:filter-config="configData.filterConfig"
			:grid-edit-width="200"
			form-title="角色"
			:form-label-width="isMobile ? '' : '80px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			@openDrawer="openDrawer"
			ref="table"
		></baseTable>
		<!-- 设置权限 -->
		<el-drawer
			:size="isMobile ? '100%' : '30%'"
			:title="`${drawerTitle}权限设置`"
			:visible.sync="drawerVisible"
			v-if="drawerVisible"
			direction="rtl"
			:before-close="closeDrawer"
		>
			<vue-scroll :ops="ops">
				<el-input placeholder="输入关键字进行查询" v-model="filterText"></el-input>
				<div class="tree-btn-container">
					<el-button class="tree-btn" plain type="primary" @click="$refs.tree.setCheckedNodes(permissionData)" :disabled="treeBtnLoading">
						全部选中
					</el-button>
					<el-button class="tree-btn" plain type="primary" @click="$refs.tree.setCheckedNodes([])" :disabled="treeBtnLoading">全部取消</el-button>
					<el-button class="tree-btn" plain type="success" @click="handlePermission" :loading="treeBtnLoading">
						{{ treeBtnLoading ? '保存中' : '保存' }}
					</el-button>
				</div>
				<el-tree
					ref="tree"
					:data="permissionData"
					:props="defaultProps"
					:default-checked-keys="defaultCheckedKeys"
					node-key="id"
					:default-expand-all="true"
					:filter-node-method="filterNode"
					show-checkbox
					:indent="28"
					v-loading="treeLoading"
				></el-tree>
			</vue-scroll>
		</el-drawer>
	</div>
</template>

<script>
import * as theApi from '@api/system/roles';
import { getData as getPermissionTree, getRolePermission, saveRolePermission } from '@api/system/permission';
import baseTable from '@components/baseTable';
import $_vuescroll from './mixins/vuescroll';
import { checkEnNum } from '@utils/verify';
import { mapState } from 'vuex';
import { log } from 'util';
export default {
	name: 'system-roles',
	data() {
		return {
			treeLoading: false,
			treeBtnLoading: false, // 提交按钮loading
			drawerTitle: '', // 侧边栏标题
			filterText: '', // 筛选树
			permissionData: [], // 整棵树
			defaultCheckedKeys: [], // 默认选中的节点数组
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			drawerVisible: false,
			roleId: '',
			lastpermissionIds: [], // 旧的权限
			//表格配置
			configData: {
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'createTime',
						order: 'desc'
					}), // 额外的请求参数
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					needSelect: true, // 是否可以多选
					hiddenFilter: true // 不展示筛选组件
				},
				tableConfig: [
					{ label: '角色名称', prop: 'roleName' },
					{ label: '角色编码', prop: 'roleCode' },
					{ label: '备注', prop: 'description' },
					{
						label: '创建日期',
						prop: 'createTime'
					},
					{
						label: '更新日期',
						prop: 'updateTime'
					}
				],
				tableBtnConfig: {
					width: 145, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						dataFromInterface: true // 编辑数据是否从接口获取
					},
					delete: true, // 是否需要删除
					deleteConfirm: true, // 删除是否需要输入密码进行确认
					expands: [
						{
							name: '设置权限',
							emitName: 'openDrawer',
							type: 'primary',
							icon: 'icon-quanxian'
						}
					]
				},
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: []
				},
				topBtnConfig: [
					{
						title: '添加角色',
						icon: 'el-icon-plus'
					}
				], // 表格上方自定义按钮配置
				filterConfig: {
					// 筛选组件配置
					filter_list: [], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: []
				},
				// table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
				formConfig: [
					{
						span: 24,
						label: '角色名称',
						prop: 'roleName',
						type: 'text',
						rules: {
							required: true,
							message: '请输入角色名称',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '角色编码',
						prop: 'roleCode',
						type: 'text',
						rules: {
							required: true,
							validator: (rule, value, callback) => {
								let reg = /^[0-9a-zA-Z_]*$/;
								if (!value) {
									return callback(new Error('不能为空'));
								} else if (reg.test(value) === false) {
									callback(new Error('格式必须为英文/数字/下划线组合'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '备注',
						prop: 'description',
						maxlength: 150,
						type: 'textarea'
					}
				],
				// 表单基础数据类型，需要预先赋值
				formModel: {
					roleName: '',
					roleCode: '',
					description: ''
				}
			},
			theApi // 表格用ajax
		};
	},
	mixins: [$_vuescroll],
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		}
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable },
	methods: {
		// 设置权限
		handlePermission: async function() {
			this.treeBtnLoading = true;
			this.defaultCheckedKeys = this.$refs.tree.getCheckedKeys(); // 获取选中项
			let data = {
				roleId: this.roleId,
				permissionIds: this.defaultCheckedKeys.join(','),
				lastpermissionIds: this.lastpermissionIds.join(',')
			};
			try {
				const res = await saveRolePermission(data);
				this.treeBtnLoading = false;
				if (res.code === 200) {
					this.$message.success('权限设置成功');
					this.drawerVisible = false;
				}
			} catch (err) {
				console.log(err);
				this.treeBtnLoading = false;
			}
		},
		// 打开
		openDrawer: async function(row = {}) {
			const { roleName, id } = row;
			this.roleId = id;
			this.drawerTitle = roleName;
			this.drawerVisible = true;
			this.treeLoading = true;
			try {
				const res1 = await getPermissionTree();
				const res2 = await getRolePermission({ roleId: id });
				if (res1.code === 200 && res2.code === 200) {
					this.permissionData = res1.result || [];
					this.defaultCheckedKeys = res2.result || [];
					this.lastpermissionIds = JSON.parse(JSON.stringify(this.defaultCheckedKeys));
				}
				this.treeLoading = false;
			} catch (err) {
				console.log(err);
				this.treeLoading = false;
			}
		},
		// 关闭drawer
		closeDrawer: function() {
			// 重置数值
			this.treeBtnLoading = false;
			this.filterText = '';
			this.permissionData = [];
			this.defaultCheckedKeys = [];
			this.drawerVisible = false;
		},
		// 节点筛选
		filterNode(value, data) {
			if (!value) {
				return true;
			}
			return data.name.indexOf(value) !== -1;
		}
	}
};
</script>
<style lang="less" scoped>
/deep/.el-drawer {
	// overflow-y: auto;
	.el-drawer__header {
		font-size: 28px;
	}
	.__vuescroll {
		height: calc(~'100vh - 100px') !important;
		padding: 20px !important;
		.el-input {
			margin-bottom: 10px;
		}
	}
	.el-tree {
		padding-bottom: 20px;
	}
	.el-tree-node__label {
		margin-left: 8px;
	}
	.submit {
		margin: 20px 0;
		text-align: right;
	}
	.tree-btn-container {
		width: 100%;
		margin-bottom: 5px;
	}
}
</style>
