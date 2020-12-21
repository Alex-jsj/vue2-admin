<template>
	<div id="dataManagement-document-list">
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
			@examine="examine"
			@download="download"
			@setTypeBatch="setTypeBatch"
			@handleIsShow="handleIsShow"
			@onlinePreview="onlinePreview"
			@examineBatch="examineBatch"
		></baseTable>
		<!-- 审核 -->
		<el-dialog title="文档审核" :visible.sync="examineDialogVisible" width="430px" top="43vh" @close="examineDialogClose">
			<span>{{ examineInfo }}</span>
			<div slot="footer" class="dialog-footer">
				<el-button
					type="warning"
					plain
					@click="examineIDS.length > 0 ? examineFail('', false, true) : examineFail()"
					:loading="failBtnLoading"
					:disabled="passBtnLoading"
				>
					驳 回
				</el-button>
				<el-button
					type="primary"
					@click="examineIDS.length > 0 ? examinePass('', false, true) : examinePass()"
					:loading="passBtnLoading"
					:disabled="failBtnLoading"
				>
					通 过
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/document';
/* 组件 */
import baseTable from '@components/baseTable';
/* 状态检测 */
import { checkReviewStatus, checkDraftStatus } from '@utils/checkTypes';
/* 方法 */
import { downloadFile } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';
/* 混入 */
import examineMixins from '../mixins/examine'; // 审核部分混入

/* 作品管理列表 */
export default {
	name: 'data-management-document-list',
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
					{ label: '文档名称', prop: 'title', minWidth: 150 },
					// {
					// 	label: '文档类别',
					// 	render: (h, params) => {
					// 		const { categories = [] } = params.row;
					// 		return categories.map(item => {
					// 			return (
					// 				<el-tag type="primary" style="margin-right:5px;">
					// 					{item.name}
					// 				</el-tag>
					// 			);
					// 		});
					// 	},
					// 	minWidth: 150
					// },
					// {
					// 	label: '文档标签',
					// 	render: (h, params) => {
					// 		const { tags = [] } = params.row;
					// 		return tags.map(item => {
					// 			return (
					// 				<el-tag type="warning" style="margin-right:5px;">
					// 					{item.name}
					// 				</el-tag>
					// 			);
					// 		});
					// 	},
					// 	minWidth: 150
					// },
					{ label: '文档格式', prop: 'type' },
					{
						label: '所属专题',
						render: (h, params) => {
							const { topics = [] } = params.row;
							return topics.map(item => {
								return (
									<el-tag type="info" style="margin-right:5px;">
										{item.name}
									</el-tag>
								);
							});
						},
						minWidth: 260
					},
					{
						label: '审核状态',
						width: 85,
						render: (h, params) => {
							const { type, text, color } = checkReviewStatus(params.row.status);
							return (
								<div class="icon-text">
									<i style={`background-color:${color}`}></i>
									<span>{text}</span>
								</div>
							);
						}
					},
					// {
					// 	label: '定稿状态',
					// 	width: 85,
					// 	render: (h, params) => {
					// 		const { type, text, color } = checkDraftStatus(params.row.proofread);
					// 		return (
					// 			<div class="icon-text">
					// 				<i style={`background-color:${color}`}></i>
					// 				<span>{text}</span>
					// 			</div>
					// 		);
					// 	}
					// },
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
					{ label: '上传人', prop: 'createBy' },
					{
						label: '上传时间',
						prop: 'createTime',
						width: 150
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 205, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						isToEditPage: true,
						pageAddress: '/views/index/document-edit',
						disabledField: 'proofread', // 是否根据某个属性禁用按钮
						disabledValue: true // 等于这个值则禁用
					},
					delete: true, // 是否需要删除
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '查看', // 按钮title
							emitName: 'goToDetail' // 绑定事件的事件名
						}
					],
					// 放置于’更多操作‘内的扩展按钮
					moreOperate: [
						{
							name: '审核', // 按钮title
							emitName: 'examine', // 绑定事件的事件名
							disabledField: 'status', // 是否根据某个属性禁用按钮
							disabledValue: 0 // 等于这个值则不禁用
						},
						{
							name: '是否显示', // 按钮title
							emitName: 'handleIsShow' // 绑定事件的事件名
						},
						{
							name: '在线预览', // 按钮title
							emitName: 'onlinePreview' // 绑定事件的事件名
						},
						{
							name: '下载', // 按钮title
							emitName: 'download' // 绑定事件的事件名
						}
					]
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '上传文档',
						icon: 'el-icon-plus',
						jumpPage: true,
						jumpAddress: '/views/index/document-add'
					},
					{
						title: '回收站',
						icon: 'el-icon-delete',
						type: 'info',
						plain: true,
						jumpPage: true,
						jumpAddress: '/views/index/documentRecycleBin'
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: [
						// {
						// 	title: '批量更改',
						// 	emitName: 'setTypeBatch' // 自定义事件的函数名
						// },
						// {
						// 	title: '批量下载',
						// 	emitName: 'downloadBatch' // 自定义事件的函数名
						// },
						{
							title: '批量审核',
							emitName: 'examineBatch' // 自定义事件的函数名
						}
					]
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search', 'examineType', 'draftType'], // 需要筛选的字段
					search_field: [
						['dynasty', 'dynasty_id'],
						['examineType', 'status'],
						['workType', 'categoryId'],
						['draftType', 'proofread']
					], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'title',
							label: '文档名称'
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
	mixins: [examineMixins],
	components: { baseTable },
	methods: {
		/* 在线预览 */
		onlinePreview: function(row = {}) {
			const { url } = row;
			window.open('http://q-huan.mynetgear.com:20182/onlinePreview?url=' + encodeURIComponent(window.location.origin + url));
		},
		// 查看详情
		goToDetail: function(row = {}) {
			this.$router.push({
				path: '/views/index/document-examine',
				query: {
					editId: row.id // 与编辑共用id
				}
			});
		},
		// 设置是否显示在前台
		handleIsShow: function(row = {}) {
			const { id } = row;
			this.$confirm(`选择此文档是否要显示在网站前台`, '显示/隐藏', {
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
		// 表格内下载
		download: function(row = {}) {
			let url = `https://sfdx.q-huan.cn/api/sys/common/download${row.url}`;
			window.open(url);
		},
		/* 批量设置分类 */
		setTypeBatch: function(arr = []) {},
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
