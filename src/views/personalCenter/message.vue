<template>
    <!-- 表格 -->
    <baseTable
        :theApi="theApi"
        :table-config="configData.tableConfig"
        :top-btn-config="configData.topBtnConfig"
        :table-btn-config="configData.tableBtnConfig"
        :other-config="configData.otherConfig"
        :filter-config="configData.filterConfig"
        @handleAllRead="handleAllRead"
        @handleThisPageRead="handleThisPageRead"
    ></baseTable>
</template>

<script>
import * as theApi from '@api/personalCenter/message';
import baseTable from '@components/baseTable';
import { checkState } from '@utils/checkTypes';
import { checkUserName, checkPsd } from '@utils/verify';
import { mapState } from 'vuex';
export default {
	name: 'personalCenter-message',
	data() {
		return {
			//表格配置
			configData: {
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'createTime',
						order: 'desc'
					}), // 额外的请求参数
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					needSelect: false // 是否可以多选
				},
				tableConfig: [
					{ label: '标题', prop: 'title', width: 250 },
					{
						label: '内容',
						prop: 'nickname',
						minWidth: 400,
						render: (h, params) => {
							return (
								<div>
									<el-tag
										type={
											params.row.hasRead === 1
												? 'info'
												: 'primary'
										}
									>
										{params.row.hasRead === 1
											? '已读'
											: '未读'}
									</el-tag>
									<span style="margin:0 8px;">
										{params.row.message}
									</span>
									<a
										class="accessory-download-link"
										href={params.row.file}
										download
									>
										<i class="iconfont icon-download"></i>
										附件下载
									</a>
								</div>
							);
						}
					},
					{
						label: '时间',
						prop: 'permission',
						width: 170,
						render: (h, params) => {
							return (
								<span>
									{this.$moment(params.row.startTime).format(
										'YYYY-MM-DD HH:mm:ss'
									)}
								</span>
							);
						}
					}
				],
				tableBtnConfig: {
					width: 50, //宽度
					expands: [
						{
							name: '查看', // 按钮title
							emitName: 'goToDetail' // 绑定事件的事件名
						}
					]
				},
				topBtnConfig: [
					{
						title: '标记所有为已读',
						icon: 'el-icon-message-solid',
						custom: true, // 是否启用自定义事件
						emitName: 'handleAllRead' // 自定义事件的函数名
					},
					{
						title: '标记本页为已读',
						icon: 'el-icon-bell',
						custom: true, // 是否启用自定义事件
						emitName: 'handleThisPageRead' // 自定义事件的函数名
					}
				],
				filterConfig: {
					// 筛选组件配置
					filter_list: ['search'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'title',
							label: '标题'
						}
					]
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
		// 跳转到详情页
		goToDetail: function(row = {}) {},
		// 标记所有为已读
		handleAllRead: function() {},
		// 标记当前页为已读
		handleThisPageRead: function(tableData = [], multipleSelection = []) {}
	}
};
</script>
