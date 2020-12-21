<template>
	<div id="system-watermark">
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
		></baseTable>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/works';
/* 组件 */
import baseTable from '@components/baseTable';
/* 状态检测 */
import { checkReviewStatus } from '@utils/checkTypes';
/* vuex */
import { mapState } from 'vuex';

/* 话题管理列表 */
export default {
	name: 'system-watermark',
	data() {
		return {
			/* 表格配置 */
			configData: {
				/* 其他配置 */
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'createTime',
						order: 'desc',
						status: this.$route.query.status
					}), // 额外的请求参数
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					rowKey: '', // 优化表格循环的key,值为空的时候无法启动树形表格
					needSelect: true, // 是否可以多选
					needRef: false, // 是否需要刷新表格
					formatData: list => {
						let mock = [
							{
								id: 1,
								title: '学校教师参加《习近平总书记教育重要论述讲义》使用培训会',
								categories: [{ name: '会议' }],
								man: '马克思主义学院',
								status: 1,
								lll: 310,
								gzl: 152,
								nrs: 3
							}
						];
						return mock;
					} // 数据处理
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{
						label: '水印名称',
						render: (h, params) => {
							return <span>中国美术学院</span>;
						}
					},
					{
						label: '水印图',
						render: (h, params) => {
							return <img src="./img/signature-bg.jpg" style="width:300px;" />;
						}
					},
					{
						label: '创建时间',
						render: (h, params) => {
							return <span>2020-11-21</span>;
						}
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 130, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true
					},
					delete: true, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '查看', // 按钮title
							emitName: '' // 绑定事件的事件名
						}
					],
					// 放置于’更多操作‘内的扩展按钮
					moreOperate: [
						// {
						// 	name: '审核', // 按钮title
						// 	emitName: 'examine', // 绑定事件的事件名
						// 	disabledField: 'status', // 是否根据某个属性禁用按钮
						// 	disabledValue: 0 // 等于这个值则不禁用
						// }
					]
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: []
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: []
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
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
