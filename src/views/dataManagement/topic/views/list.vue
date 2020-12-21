<template>
	<div id="dataManagement-topic-list">
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
			@changeNeedRef="changeNeedRef"
			@goToDetail="goToDetail"
			@handleIsShow="handleIsShow"
		></baseTable>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/mock';
/* 组件 */
import baseTable from '@components/baseTable';
/* 状态检测 */
import { checkReviewStatus, checkDraftStatus } from '@utils/checkTypes';
/* vuex */
import { mapState } from 'vuex';

/* 作品管理列表 */
export default {
	name: 'data-management-topic-list',
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
					rowKey: '', // 优化表格循环的key,值为空的时候无法启动树形表格
					needSelect: true, // 是否可以多选
					needRef: false // 是否需要刷新表格
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '专题名称', prop: 'name', minWidth: 150 },
					{
						label: '专题类别',
						render: (h, params) => {
							const { categories } = params.row;
							return categories.map(item => {
								const _item = item || {};
								return (
									<el-tag type="info" style="margin-right:5px;">
										{_item.name}
									</el-tag>
								);
							});
						},
						minWidth: 150
					},
					{
						label: '文档标签',
						render: (h, params) => {
							const { tags = [] } = params.row;
							return tags.map(item => {
								return (
									<el-tag type="warning" style="margin-right:5px;">
										{item.name}
									</el-tag>
								);
							});
						},
						minWidth: 150
					},
					// { label: '点击量', prop: '' },
					{
						label: '显示状态',
						render: (h, params) => {
							const { showFront } = params.row;
							return (
								<div class="icon-text">
									<i style={`background-color:${showFront ? '#67c23a' : '#d9d9d9'}`}></i>
									<span>{showFront ? '显示' : '不显示'}</span>
								</div>
							);
						},
						width: 85
					},
					{ label: '创建人', prop: 'createBy' },
					{
						label: '创建时间',
						prop: 'createTime',
						width: 150
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 165, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						isToEditPage: true,
						pageAddress: '/views/index/topic-edit'
					},
					delete: true, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '查看', // 按钮title
							emitName: 'goToDetail' // 绑定事件的事件名
						},
						{
							name: '显示', // 按钮title
							emitName: 'handleIsShow' // 绑定事件的事件名
						}
					],
					// 放置于’更多操作‘内的扩展按钮
					moreOperate: []
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '添加专题',
						icon: 'el-icon-plus',
						jumpPage: true,
						jumpAddress: '/views/index/topic-add'
					},
					{
						title: '回收站',
						icon: 'el-icon-delete',
						type: 'info',
						plain: true,
						jumpPage: true,
						jumpAddress: '/views/index/topicRecycleBin'
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
							label: '专题名称'
						}
					]
				},
				/* table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置 */
				formConfig: [],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {}
			},
			theApi, // 表格用ajax
			fileUploadVisible: false // 批量导入
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable },
	methods: {
		// 查看详情
		goToDetail: function(row = {}) {
			this.$router.push({
				path: '/views/index/topic-edit',
				query: {
					editId: row.id // 与编辑共用id
				}
			});
		},
		// 设置是否显示在前台
		handleIsShow: function(row = {}) {
			const { id } = row;
			this.$confirm(`选择此专题是否要显示在网站前台`, '显示/隐藏', {
				distinguishCancelAndClose: true,
				confirmButtonText: '显示',
				cancelButtonText: '不显示',
				type: 'warning'
			})
				.then(() => {
					theApi.canShow({ id, isTrue: true }).then(res => {
						if (res.code === 200) {
							this.$message.info(res.message);
							this.configData.otherConfig.needRef = true;
						}
					});
				})
				.catch(action => {
					if (action === 'cancel') {
						theApi.canShow({ id, isTrue: false }).then(res => {
							if (res.code === 200) {
								this.$message.info(res.message);
								this.configData.otherConfig.needRef = true;
							}
						});
					}
				});
		},
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
