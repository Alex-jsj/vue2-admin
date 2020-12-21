<template>
	<div id="dataManagement-topic-list">
		<!-- 表格 -->
		<baseTable
			ref="table"
			:theApi="theApi"
			:table-config="configData.tableConfig"
			:bottom-btn-config="configData.bottomBtnConfig"
			:table-btn-config="configData.tableBtnConfig"
			:other-config="configData.otherConfig"
			@changeNeedRef="changeNeedRef"
			@restores="restores"
			@completelyDelete="completelyDelete"
			@deleteBatch="deleteBatch"
			@restoresBatch="restoresBatch"
		></baseTable>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/topicRecycleBin';
/* 组件 */
import baseTable from '@components/baseTable';
/* vuex */
import { mapState } from 'vuex';

export default {
	name: 'data-management-topic-recycle-bin',
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
					hiddenFilter: true,
					needSelect: true, // 是否可以多选
					needRef: false // 是否需要刷新表格
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '专题名称', prop: 'name', minWidth: 150 },
					{
						label: '专题类别',
						render: (h, params) => {
							const { categories = [] } = params.row;
							return categories.map(item => {
								return (
									<el-tag type="info" style="margin-right:5px;">
										{item.name}
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
					{ label: '点击量', prop: '' },
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
					width: 110, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: false
					},
					delete: false, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '还原', // 按钮title
							color: '#67C23A',
							emitName: 'restores' // 绑定事件的事件名
						},
						{
							name: '彻底删除', // 按钮title
							color: '#F56C6C',
							emitName: 'completelyDelete' // 绑定事件的事件名
						}
					]
				},
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: false, // 需要批量删除
					extends: [
						{
							title: '批量删除',
							emitName: 'deleteBatch' // 自定义事件的函数名
						},
						{
							title: '批量还原',
							emitName: 'restoresBatch' // 自定义事件的函数名
						}
					]
				}
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
		/* 还原 */
		restores: function(row = {}) {
			const { id, title } = row;
			this.$confirm('是否要还原此专题?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//ajax
					theApi.recovery({ id }).then(res => {
						if (res.code === 200) {
							this.$message.success(`已还原${title}!`);
							// 刷新数据
							this.configData.otherConfig.needRef = true;
						}
					});
				})
				.catch(action => {
					this.$message.info('取消');
				});
		},
		/* 批量还原 */
		restoresBatch: function(list = []) {
			let ids = []; // 需要转换成用逗号分隔的字符串
			list.map(item => {
				ids.push(item.id);
			});
			this.$confirm('是否要还原此专题?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//ajax
					theApi.recoveryBatch({ ids: ids.join(',') }).then(res => {
						if (res.code === 200) {
							this.$message.success(`还原成功!`);
							// 刷新数据
							this.configData.otherConfig.needRef = true;
						}
					});
				})
				.catch(action => {
					this.$message.info('取消');
				});
		},
		/* 彻底删除 */
		completelyDelete: function(row = {}) {
			const { id } = row;
			this.$confirm('是否要彻底删除此专题（无法恢复）?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//ajax
					theApi.deleteItem({ id }).then(res => {
						if (res.code === 200) {
							this.$message.success('删除成功！');
							// 刷新数据
							this.configData.otherConfig.needRef = true;
						}
					});
				})
				.catch(action => {
					this.$message.info('取消删除');
				});
		},
		/* 批量彻底删除 */
		deleteBatch: function(list = []) {
			let ids = []; // 需要转换成用逗号分隔的字符串
			list.map(item => {
				ids.push(item.id);
			});
			this.$confirm('是否要彻底删除此专题（无法恢复）?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//ajax
					theApi.batchDeleteItems({ ids: ids.join(',') }).then(res => {
						if (res.code === 200) {
							this.$message.success('删除成功！');
							// 刷新数据
							this.configData.otherConfig.needRef = true;
						}
					});
				})
				.catch(action => {
					this.$message.info('取消删除');
				});
		},
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
