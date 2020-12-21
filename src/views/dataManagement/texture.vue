<template>
	<div id="dataManagement-textures">
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
			form-title="标签"
			:form-label-width="isMobile ? '' : '55px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
		></baseTable>
	</div>
</template>

<script>
import * as theApi from '@api/dataManagement/texture';
import { fileApi } from '@api/public';
/* 组件 */
import baseTable from '@components/baseTable';
import fileUpload from '@components/upload/fileUpload';
import { mapState } from 'vuex';
/* 质地列表 */
export default {
	name: 'data-management-textures',
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
					{ label: '标题', prop: 'name' },
					{
						label: '添加时间',
						width: 150,
						render: (h, params) => {
							return <span>{this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
						}
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 85, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						dataFromInterface: true // 编辑数据是否从接口获取
					},
					delete: true, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [],
					// 放置于’更多操作‘内的扩展按钮
					moreOperate: []
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '添加质地',
						icon: 'el-icon-plus'
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: []
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'name',
							label: '标题'
						}
					]
				},
				/* table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置 */
				formConfig: [
					{
						span: 24,
						label: '标题',
						prop: 'name',
						type: 'text',
						rules: {
							required: true,
							message: '请输入标题',
							trigger: 'blur'
						}
					}
				],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {
					name: '',
					sort: 999
				}
			},
			theApi // 表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable },
	methods: {}
};
</script>
