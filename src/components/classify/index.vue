<template>
	<div id="data-classify-components">
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
			form-title="分类"
			:form-label-width="isMobile ? '' : '85px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			@addChild="addChild"
			@changeNeedRef="changeNeedRef"
		></baseTable>
		<!-- 添加子类 -->
		<el-dialog title="添加子类" :visible.sync="childDialogVisible" :width="isMobile ? '90%' : '500px'" :before-close="beforeAddClose">
			<el-form :rules="addChildRules" :model="addChildForm" ref="addChildForm" label-width="100px">
				<el-form-item label="当前层级:">
					<p>{{ parentTitle }}</p>
				</el-form-item>
				<el-form-item prop="name" label="分类名称:">
					<el-input v-model="addChildForm.name" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item prop="sort" label="排序:">
					<el-input v-model="addChildForm.sort" placeholder="请输入排序"></el-input>
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
import * as theApi from '@api/dataClassify/publicClassify';
/* 组件 */
import baseTable from '@components/baseTable';
/* 混入 */
import addChild from './mixins/addChild';
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';
/* vuex */
import { mapState } from 'vuex';
export default {
	name: 'data-classify-components',
	data() {
		return {
			/* 表格配置 */
			configData: {
				/* 其他配置 */
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'sort',
						order: 'desc',
						type: this.type
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
					open: true, // 是否启动属性表格
					defaultExpandAll: true, // 是否默认全部展开
					treeProps: {
						children: 'children',
						hasChildren: 'hasChildren'
					} // 树形表格结构配置
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '分类名称', prop: 'name' },
					// {
					// 	label: '状态',
					// 	render: (h, params) => {
					// 		const { enable } = params.row;
					// 		return (
					// 			// <div class="icon-text">
					// 			// 	<i style={`background-color:${enable ? '#67c23a' : '#d9d9d9'}`}></i>
					// 			// 	<span>{enable ? '启用' : '禁用'}</span>
					// 			// </div>
					// 			<div class="icon-text">
					// 				<i style={`background-color:${'#67c23a'}`}></i>
					// 				<span>启用</span>
					// 			</div>
					// 		);
					// 	}
					// },
					{
						label: '排序',
						prop: 'sort',
						sortable: true
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
						title: '添加顶级分类',
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
						label: '分类名称',
						prop: 'name',
						type: 'text',
						maxlength: 20, // 输入字数限制
						rules: {
							required: true,
							message: '请输入分类名称',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '排序',
						prop: 'sort',
						type: 'text',
						rules: {
							required: true,
							validator: checkPositiveInteger,
							trigger: 'blur'
						}
					}
					// {
					// 	span: 24,
					// 	label: '是否启用',
					// 	prop: 'enable',
					// 	type: 'radio',
					// 	data: [
					// 		{
					// 			id: true,
					// 			name: '启用'
					// 		},
					// 		{
					// 			id: false,
					// 			name: '禁用'
					// 		}
					// 	],
					// 	rules: {
					// 		required: true,
					// 		message: '请选择状态',
					// 		trigger: 'change'
					// 	}
					// }
				],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {
					type: this.type,
					pid: '',
					sort: 999
					// enable: true
				}
			},
			theApi // 表格用ajax
		};
	},
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapState(['isMobile'])
	},
	mixins: [addChild],
	components: { baseTable },
	methods: {
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
