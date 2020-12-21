<template>
	<div id="dataManagement-artist-list">
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
			form-title="艺术家"
			:form-label-width="isMobile ? '' : '80px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			@changeNeedRef="changeNeedRef"
			@goToDetail="goToDetail"
			@examine="examine"
			@uploadFile="uploadFile"
			@downloadFile="downloadFile"
			@examineBatch="examineBatch"
		></baseTable>
		<!-- 批量导入 -->
		<el-dialog title="文件上传" :visible.sync="uploadShow">
			<fileUpload :limit="1" :accept="'.xls,.xlsx'" :ajax_address="fileApi" v-on="{ file_upload_success: uploadSuccess }" />
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="uploadSubmit" :loading="uploadBtnLoading">提 交</el-button>
			</div>
		</el-dialog>
		<!-- 审核 -->
		<el-dialog title="艺术家审核" :visible.sync="examineDialogVisible" width="430px" top="43vh" @close="examineDialogClose">
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
import * as theApi from '@api/dataManagement/artist';
import { fileApi } from '@api/public';
/* 组件 */
import baseTable from '@components/baseTable';
import fileUpload from '@components/upload/fileUpload';
/* 方法 */
import { checkReviewStatus, checkDraftStatus } from '@utils/checkTypes';
import { downloadBinaryFile } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';
/* 混入 */
import examineMixins from '../mixins/examine'; // 审核部分混入
/* 艺术家管理 */
export default {
	name: 'data-management-artist-list',
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
					{ label: '艺术家', prop: 'name' },
					{ label: '朝代', prop: 'dynastyName' },
					{
						label: '生卒年',
						render: (h, params) => {
							let { birthday, deathday } = params.row;
							// 生年
							if (birthday === '不详') {
								birthday = '不详';
							} else if (birthday > 0 || birthday === 0) {
								birthday = `公元 ${birthday} 年`;
							} else if (birthday < 0) {
								birthday = `公元前 ${-birthday} 年`;
							}
							// 卒年
							if (deathday === '不详') {
								deathday = '不详';
							} else if (deathday > 0 || deathday === 0) {
								deathday = `公元 ${deathday} 年`;
							} else if (deathday < 0) {
								deathday = `公元前 ${-deathday} 年`;
							}
							return deathday ? (
								<div>
									<p>生年：{birthday}</p>
									<p>卒年：{deathday}</p>
								</div>
							) : (
								<div>
									<p>生年：{birthday}</p>
								</div>
							);
						}
					},
					{ label: '排序', prop: 'sort', sortable: true },
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
					{
						label: '创建时间',
						width: 150,
						sortable: true,
						prop: 'createTime'
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 165, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						isToEditPage: true,
						pageAddress: '/views/index/artist-edit',
						disabledField: 'name',
						disabledValue: '佚名'
					},
					delete: true, // 是否需要删除
					deleteDisabledField: 'name',
					deleteDisabledValue: '佚名',
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '查看', // 按钮title
							emitName: 'goToDetail' // 绑定事件的事件名
						},
						{
							name: '审核', // 按钮title
							emitName: 'examine', // 绑定事件的事件名
							disabledField: 'status', // 是否根据某个属性禁用按钮
							disabledValue: 0 // 等于这个值则不禁用
						}
					],
					// 放置于’更多操作‘内的扩展按钮
					moreOperate: []
				},
				/* 表格上方自定义按钮配置 */
				topBtnConfig: [
					{
						title: '新增艺术家',
						icon: 'el-icon-plus',
						jumpPage: true,
						jumpAddress: '/views/index/artist-add'
					},
					{
						title: '导出艺术家',
						icon: 'el-icon-download',
						custom: true, // 是否启用自定义事件
						emitName: 'downloadFile' // 自定义事件的函数名
					},
					{
						title: '批量导入',
						icon: 'el-icon-upload',
						custom: true, // 是否启用自定义事件
						emitName: 'uploadFile' // 自定义事件的函数名
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: [
						{
							title: '批量审核',
							emitName: 'examineBatch' // 自定义事件的函数名
						}
					]
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search', 'examineType', 'dynasty'], // 需要筛选的字段
					search_field: [
						['examineType', 'status'],
						['title', 'name']
					], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'title',
							label: '艺术家'
						}
					]
				},
				/* table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置 */
				formConfig: [],
				/* 表单基础数据类型，需要预先赋值 */
				formModel: {}
			},
			theApi, // 表格用ajax
			fileApi, // 上传文件api
			uploadShow: false, // 批量导入
			uploadBtnLoading: false,
			uploadFileList: []
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	mixins: [examineMixins],
	components: { baseTable, fileUpload },
	methods: {
		// 查看详情
		goToDetail: function(row = {}) {
			this.$router.push({
				path: '/views/index/artist-examine',
				query: {
					editId: row.id // 与编辑共用id
				}
			});
		},
		// 批量导入
		uploadFile: function(row = {}) {
			this.uploadShow = true;
		},
		uploadSubmit: async function() {
			this.uploadBtnLoading = true;
			if (this.uploadFileList.length < 1) {
				this.$message.warning('请先选择要上传的文件');
				this.uploadBtnLoading = false;
				return;
			}
			let data = this.uploadFileList;
			try {
				const res = theApi.uploadFile(data);
				console.log(res);

				this.uploadBtnLoading = false;
			} catch (err) {
				this.uploadBtnLoading = false;
				console.log(err);
			}
		},
		uploadSuccess: function(fileList = []) {
			console.log(fileList);
			this.uploadFileList = fileList;
		},
		// 导出
		downloadFile: async function() {
			let fileName = '艺术家列表';
			try {
				const res = await theApi.exportExcel();
				downloadBinaryFile(res, fileName);
			} catch (err) {
				//
			}
		},
		// 修改needref
		changeNeedRef: function(bol = false) {
			this.configData.otherConfig.needRef = bol;
		}
	}
};
</script>
