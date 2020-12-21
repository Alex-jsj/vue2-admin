<template>
	<div id="system-permission">
		<!-- 表格 -->
		<baseTable
			ref="table"
			:theApi="theApi"
			:table-config="configData.tableConfig"
			:tree-table="configData.treeTable"
			:top-btn-config="configData.topBtnConfig"
			:bottom-btn-config="configData.bottomBtnConfig"
			:table-btn-config="configData.tableBtnConfig"
			:other-config="configData.otherConfig"
			:filter-config="configData.filterConfig"
			form-title="菜单"
			:form-label-width="isMobile ? '' : '100px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			@addChild="addChild"
			@changeNeedRef="changeNeedRef"
		></baseTable>
		<!-- 添加子类 -->
		<el-dialog title="添加子菜单" :visible.sync="childDialogVisible" :width="isMobile ? '90%' : '500px'" :before-close="beforeAddClose">
			<el-form :rules="addChildRules" :model="addChildForm" ref="addChildForm" label-width="100px">
				<el-form-item label="父级菜单:">
					<p>{{ parentTitle }}</p>
				</el-form-item>
				<el-form-item prop="name" label="类型:">
					<el-radio-group v-model="addChildForm.menuType">
						<el-radio :label="1">菜单</el-radio>
						<el-radio :label="2">按钮级权限</el-radio>
						<el-radio :label="3">普通权限</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="name" label="菜单名称:">
					<el-input v-model="addChildForm.name" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item prop="url" label="菜单路径:">
					<el-input v-model="addChildForm.url" placeholder="请输入菜单路径"></el-input>
				</el-form-item>
				<el-form-item label="菜单图标:">
					<el-input v-model="addChildForm.icon" placeholder="请输入菜单图标"></el-input>
				</el-form-item>
				<el-form-item label="菜单权限编码:">
					<el-input v-model="addChildForm.perms" placeholder="请输入菜单权限编码"></el-input>
				</el-form-item>
				<el-form-item prop="sortNo" label="排序:">
					<el-input v-model="addChildForm.sortNo" placeholder="请输入排序"></el-input>
				</el-form-item>
				<el-form-item label="是否缓存路由:">
					<el-switch v-model="addChildForm.keepAlive" active-color="#67C23A" inactive-color="#909399"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="beforeAddClose" :disabled="childBtnLoading">取 消</el-button>
				<el-button type="primary" @click="addChildAjax" :loading="childBtnLoading">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/system/permission';
/* 组件 */
import baseTable from '@components/baseTable';
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';
/* vuex */
import { mapState } from 'vuex';
export default {
	name: 'system-permission',
	data() {
		return {
			childDialogVisible: false,
			childBtnLoading: false,
			parentTitle: '',
			addChildForm: {
				menuType: 1,
				keepAlive: true,
				sortNo: 999
			},
			addChildRules: {
				name: [
					{
						required: true,
						message: '请输入菜单名称',
						trigger: 'blur'
					}
				],
				sortNo: [
					{
						required: true,
						validator: checkPositiveInteger,
						trigger: 'blur'
					}
				]
			},
			/* 表格配置 */
			configData: {
				/* 其他配置 */
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'sortNo',
						order: 'desc'
					}), // 额外的请求参数
					dataFieldUrl: '', // 接口数据结构地址 (必填)
					rowKey: 'id', // 优化表格循环的key,值为空的时候无法启动树形表格
					needSelect: true, // 是否可以多选
					hiddenPages: true, // 不需要分页
					needRef: false, // 是否刷新表格数据
					hiddenFilter: true // 不需要筛选
				},
				/* 树形表格配置 */
				treeTable: {
					open: true, // 是否启动树形表格
					defaultExpandAll: true, // 是否默认全部展开
					treeProps: {
						children: 'children',
						hasChildren: 'hasChildren'
					} // 树形表格结构配置
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '菜单名称', prop: 'name', minWidth: 150 },
					{
						label: '菜单类型',
						render: (h, params) => {
							const { menuType } = params.row;
							let val = '';
							switch (menuType) {
								case 1:
									val = '菜单';
									break;
								case 2:
									val = '按钮级权限';
									break;
								case 3:
									val = '普通权限';
									break;
								default:
								//
							}
							return <span>{val}</span>;
						}
					},
					{ label: '图标', prop: 'icon', minWidth: 100 },
					{ label: '路由组件', prop: 'component', minWidth: 150 },
					{ label: '菜单路径', prop: 'url', minWidth: 200 },
					{ label: '菜单权限编码', prop: 'perms' },
					{
						label: '是否缓存',
						render: (h, params) => {
							const { keepAlive } = params.row;
							return <span>{keepAlive ? '是' : '否'}</span>;
						}
					},
					{
						label: '排序',
						prop: 'sortNo',
						sortable: true,
						width: 80
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 150, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						dataFromInterface: false // 编辑数据是否从接口获取
					},
					delete: true, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '添加子类', // 按钮title
							emitName: 'addChild' // 绑定事件的事件名
						}
					]
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '添加菜单',
						icon: 'el-icon-plus'
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true // 需要批量删除
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: [], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: []
				},
				/* table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置 */
				formConfig: [
					{
						span: 24,
						label: '类型',
						prop: 'menuType',
						type: 'radio',
						data: [
							{
								id: 1,
								name: '菜单'
							},
							{
								id: 2,
								name: '按钮级权限'
							},
							{
								id: 3,
								name: '普通权限'
							}
						],
						rules: {
							required: true,
							message: '请选择菜单类型',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '菜单名称',
						prop: 'name',
						type: 'text',
						maxlength: 20, // 输入字数限制
						rules: {
							required: true,
							message: '请输入菜单名称',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '菜单路径',
						prop: 'url',
						type: 'text',
						rules: {
							required: false,
							message: '请输入菜单路径',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '菜单图标',
						prop: 'icon',
						type: 'text'
					},
					{
						span: 24,
						label: '菜单权限编码',
						prop: 'perms',
						type: 'text'
					},
					{
						span: 24,
						label: '排序',
						prop: 'sortNo',
						type: 'text',
						rules: {
							required: true,
							validator: checkPositiveInteger,
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '是否缓存路由',
						prop: 'keepAlive',
						type: 'switch'
					}
				],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {
					menuType: 1,
					name: '',
					url: '',
					icon: '',
					perms: '',
					sortNo: 999
				}
			},
			theApi // 表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable },
	methods: {
		addChild: function(row = {}) {
			const { name, id } = row;
			this.parentTitle = name;
			this.addChildForm.parentId = id;
			this.childDialogVisible = true;
		},
		addChildAjax: async function() {
			this.childBtnLoading = true;
			try {
				const res = await theApi.addItem(this.addChildForm);
				if (res.code === 200) {
					this.childDialogVisible = false;
					this.configData.otherConfig.needRef = true;
					this.$refs.addChildForm.resetFields();
					this.$message.success('添加成功');
				}
				this.childBtnLoading = false;
			} catch (err) {
				this.childBtnLoading = false;
			}
		},
		beforeAddClose: function() {
			this.childDialogVisible = false;
			this.$refs.addChildForm.resetFields();
		},
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#system-permission {
	.piliang {
		position: relative;
		&::after {
			.clear;
		}
		.el-button {
			margin-left: 0;
			margin-bottom: 10px;
		}
	}
	.baseTable {
		width: 100%;
		margin-bottom: 0.55rem;
		/deep/ thead {
			th {
				background: lighten(#ebeef5, 3%);
				color: #333;
				font-size: 14px;
			}
		}
	}
	/deep/.btns {
		.cell {
			padding-right: 0;
			.el-button + .el-button {
				margin-left: 0;
			}
			.el-button {
				&::after {
					content: '|';
					margin: 0 3px;
					color: #c0c4cc;
				}
				&:last-child {
					&::after {
						display: none;
					}
				}
			}
		}
	}
}
</style>
