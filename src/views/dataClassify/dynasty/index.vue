<template>
	<div id="data-classify-dynasty">
		<!-- 表格 -->
		<baseTable
			ref="table"
			:theApi="theApi"
			:table-config="configData.tableConfig"
			:top-btn-config="configData.topBtnConfig"
			:bottom-btn-config="configData.bottomBtnConfig"
			:table-btn-config="configData.tableBtnConfig"
			:other-config="configData.otherConfig"
			:filter-config="configData.filterConfig"
			form-title="朝代"
			:form-label-width="isMobile ? '' : '85px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			@goToDetail="goToDetail"
		></baseTable>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataClassify/dynasty';
/* 组件 */
import baseTable from '@components/baseTable';
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';
/* vuex */
import { mapState } from 'vuex';
export default {
	name: 'data-classify-dynasty',
	data() {
		return {
			/* 表格配置 */
			configData: {
				/* 其他配置 */
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'createTime',
						order: 'desc'
					}), // 额外的请求参数
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					needSelect: true // 是否可以多选
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '朝代名称', prop: 'name' },
					{
						label: '状态',
						render: (h, params) => {
							const { enable } = params.row;
							return (
								<div class="icon-text">
									<i style={`background-color:${enable ? '#67c23a' : '#d9d9d9'}`}></i>
									<span>{enable ? '启用' : '禁用'}</span>
								</div>
							);
						}
					},
					{
						label: '排序',
						prop: 'sort',
						sortable: true
					},
					{
						label: '备注',
						prop: 'instructions',
						minWidth: 300
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 85, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true
					},
					delete: true // 是否需要删除
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '添加朝代',
						icon: 'el-icon-plus'
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true // 需要批量删除
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'name',
							label: '朝代名称'
						}
					]
				},
				/* table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置 */
				formConfig: [
					{
						span: 24,
						label: '朝代名称',
						prop: 'name',
						type: 'text',
						maxlength: 20, // 输入字数限制
						rules: {
							required: true,
							message: '请输入朝代名称',
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
					},
					{
						span: 24,
						label: '是否启用',
						prop: 'enable',
						type: 'radio',
						data: [
							{
								id: true,
								name: '启用'
							},
							{
								id: false,
								name: '禁用'
							}
						],
						rules: {
							required: true,
							message: '请选择状态',
							trigger: 'change'
						}
					},
					{
						span: 24,
						label: '备注',
						prop: 'instructions',
						type: 'textarea',
						maxlength: 200, // 输入字数限制
						rules: {}
					}
				],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {
					name: '',
					sort: 999,
					enable: true,
					instructions: ''
				}
			},
			theApi // 表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	mixins: [],
	components: { baseTable },
	methods: {
		// 查看详情
		goToDetail: function(row = {}) {
			this.$router.push({
				path: '/views/index/exhibition/examine',
				query: {
					editId: row.id // 与编辑共用id
				}
			});
		}
	}
};
</script>
