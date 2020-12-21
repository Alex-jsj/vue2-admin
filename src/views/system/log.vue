<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="操作日志" name="first">
			<baseTable
				v-if="activeName === 'first'"
				:theApi="theApi"
				:table-config="configData.tableConfig"
				:top-btn-config="configData.topBtnConfig"
				:bottom-btn-config="configData.bottomBtnConfig"
				:table-btn-config="configData.tableBtnConfig"
				:other-config="configData.otherConfig"
				:filter-config="configData.filterConfig"
				:grid-edit-width="200"
				:form-label-width="isMobile ? '' : '80px'"
				:form-width="isMobile ? '95%' : '40%'"
				:form-config="configData.formConfig"
				:form-data-model="configData.formModel"
			></baseTable>
		</el-tab-pane>
		<el-tab-pane label="登录日志" name="second">
			<baseTable
				v-if="activeName === 'second'"
				:theApi="theApi"
				:table-config="configData2.tableConfig"
				:top-btn-config="configData2.topBtnConfig"
				:bottom-btn-config="configData2.bottomBtnConfig"
				:table-btn-config="configData2.tableBtnConfig"
				:other-config="configData2.otherConfig"
				:filter-config="configData2.filterConfig"
				:grid-edit-width="200"
				:form-label-width="isMobile ? '' : '80px'"
				:form-width="isMobile ? '95%' : '40%'"
				:form-config="configData2.formConfig"
				:form-data-model="configData2.formModel"
			></baseTable>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import * as theApi from '@api/system/log';
import baseTable from '@components/baseTable';
import { checkEvent, checkSuccess } from '@utils/checkTypes';
import { mapState } from 'vuex';
export default {
	name: 'system-log',
	data() {
		return {
			activeName: 'first',
			// 操作日志表格配置
			configData: {
				otherConfig: {
					additionalField: JSON.stringify({
						logType: 2
					}), // 额外的请求参数
					sortValue: 'modifyTime,desc', // 排序规则
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					needSelect: true, // 是否可以多选
					hiddenFilter: true // 不需要筛选
				},
				tableConfig: [
					{
						label: '操作人',
						width: 170,
						render: (h, params) => {
							if (params.row.username) {
								return <span>{`${params.row.username} (${params.row.userid})`}</span>;
							}
						}
					},
					{
						label: '操作时间',
						width: 170,
						render: (h, params) => {
							return <span>{this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss:ss')}</span>;
						}
					},
					{ label: '操作表', prop: 'sheet', width: 150 },
					{
						label: '操作IP及设备',
						minWidth: 170,
						render: (h, params) => {
							return (
								<div>
									<p>
										<el-tag>IP:</el-tag>
										{params.row.ip}
									</p>
									<p>
										<el-tag>设备:</el-tag>
										{params.row.user_agent}
									</p>
								</div>
							);
						}
					},
					{
						label: '事件',
						width: 70,
						render: (h, params) => {
							let { text, type } = checkEvent(params.row.description);
							return (
								<el-tag size="small" type={type}>
									{text}
								</el-tag>
							);
						}
					}
				],
				tableBtnConfig: {
					width: 50, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: false,
						isToEditPage: true,
						pageAddress: ''
					},
					delete: true, // 是否需要删除
					expands: [
						// {
						// 	name: '查看', // 按钮title
						// 	emitName: 'goToDetail', // 绑定事件的事件名
						// 	type: 'primary', // 按钮样式
						// 	icon: 'icon-look' // 按钮图标
						// }
					]
				},
				topBtnConfig: [], // 表格上方自定义按钮配置
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true // 需要批量删除
				},
				filterConfig: {
					// 筛选组件配置
					filter_list: ['search', 'operation', 'event'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'title',
							label: '操作表'
						}
					]
				},
				// table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
				formConfig: [],
				// 表单基础数据类型，需要预先赋值
				formModel: {}
			},
			// 登陆日志表格配置
			configData2: {
				otherConfig: {
					additionalField: JSON.stringify({
						logType: 1
					}), // 额外的请求参数
					sortValue: 'modifyTime,desc', // 排序规则
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					needSelect: true, // 是否可以多选
					hiddenFilter: true // 不需要筛选
				},
				tableConfig: [
					{
						label: '用户名',
						prop: 'username',
						width: 110
					},
					{
						label: '昵称',
						prop: 'nickname',
						width: 130
					},
					{
						label: '登录时间',
						width: 170,
						render: (h, params) => {
							return <span>{this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss:ss')}</span>;
						}
					},
					{
						label: '登录IP及设备',
						minWidth: 300,
						render: (h, params) => {
							return (
								<div>
									<p>
										<el-tag>IP:</el-tag>
										{params.row.ip}
									</p>
									<p>
										<el-tag>设备:</el-tag>
										{params.row.user_agent}
									</p>
								</div>
							);
						}
					},
					{
						label: '登录状态',
						width: 100,
						render: (h, params) => {
							let { text, type } = checkSuccess(params.row.state);
							return (
								<el-tag size="small" type={type}>
									{text}
								</el-tag>
							);
						}
					},
					{
						label: '备注',
						prop: 'comment',
						width: 180
					}
				],
				tableBtnConfig: {
					width: 50, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: false,
						isToEditPage: true,
						pageAddress: ''
					},
					delete: true // 是否需要删除
				},
				topBtnConfig: [], // 表格上方自定义按钮配置
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true // 需要批量删除
				},
				filterConfig: {
					// 筛选组件配置
					filter_list: ['search', 'user', 'date_scope'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'account',
							label: '用户名'
						},
						{
							field: 'nickname',
							label: '昵称'
						}
					]
				},
				// table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
				formConfig: [],
				// 表单基础数据类型，需要预先赋值
				formModel: {}
			},
			theApi // 操作日志表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable },
	methods: {
		// 跳转到详情页
		goToDetail: function() {}
	}
};
</script>
