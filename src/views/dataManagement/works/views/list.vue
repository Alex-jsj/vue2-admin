<template>
	<div id="dataManagement-works-list">
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
			@uploadFile="uploadFile"
			@setExhibition="setExhibition"
			@setExhibitionBatch="setExhibitionBatch"
			@downloadBatch="downloadBatch"
			@handleIsShow="handleIsShow"
			@examineBatch="examineBatch"
			@handleClassify="handleClassify"
		></baseTable>
		<!-- 批量导入 -->
		<el-dialog title="文件上传" :visible.sync="uploadShow">
			<fileUpload :limit="1" :accept="'.xls,.xlsx'" :ajax_address="fileApi" v-on="{ file_upload_success: uploadSuccess }" />
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="uploadSubmit" :loading="uploadBtnLoading">提 交</el-button>
			</div>
		</el-dialog>
		<!-- 批量下载 -->
		<el-dialog title="批量下载" :visible.sync="batchDownloadDialogVisible">
			<p style="margin-bottom:10px;">
				已选择以下{{ batchDownloadList.length }}条，点击右下角
				<span style="color:teal;">下载</span>
				按钮，以压缩包的形式下载到本地。
			</p>
			<ul>
				<li v-for="(item, index) in batchDownloadList" :key="item.id" style="line-height:24px;">{{ index + 1 }}：{{ item.title }}</li>
			</ul>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeBatchDownloadDialog" :disabled="batchDownloadBtnLoading">取消</el-button>
				<el-button type="primary" @click="batchDownloadSubmit" :loading="batchDownloadBtnLoading">下载</el-button>
			</div>
		</el-dialog>
		<!-- 审核 -->
		<el-dialog title="作品审核" :visible.sync="examineDialogVisible" width="430px" top="43vh" @close="examineDialogClose">
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
		<!-- 设置展厅 -->
		<el-dialog title="设置展厅" :visible.sync="exhibitionDialogVisible" width="430px" top="43vh">
			<el-form :rules="exhibitionRules" :model="exhibitionForm" ref="exhibitionForm">
				<el-form-item prop="exhibitionID">
					<el-select v-model="exhibitionForm.exhibitionID" filterable multiple placeholder="请选择展厅" style="width:100%;">
						<el-option v-for="item in exhibitionList" :key="item.id" :label="item.exhiName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="exhibitionDialogVisible = false" :disabled="exhibitionPassBtnLoading">取 消</el-button>
				<el-button type="primary" @click="exhibitionAjax" :loading="exhibitionPassBtnLoading">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑分类 -->
		<el-dialog title="编辑分类" :visible.sync="categoriesDialogVisible" width="500px" top="43vh">
			<el-form :rules="categoriesRules" :model="categoriesForm" ref="categoriesForm">
				<el-form-item prop="categories" label="作品类别:">
					<addWorkCategorie v-model="categoriesForm.categories" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="categoriesDialogVisible = false" :disabled="categoriesPassBtnLoading">取 消</el-button>
				<el-button type="primary" @click="categoriesAjax" :loading="categoriesPassBtnLoading">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/works';
import { fileApi } from '@api/public';
/* 组件 */
import baseTable from '@components/baseTable';
import fileUpload from '@components/upload/fileUpload';
import addWorkCategorie from '@components/adds/addWorkCategorie'; // 添加作品类别
/* 状态检测 */
import { checkReviewStatus, checkDraftStatus } from '@utils/checkTypes';
/* 方法 */
import { downloadFile, checkboxAddID, IDToArray } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';
/* 混入 */
import examineMixins from '../mixins/examine'; // 审核部分混入
import exhibitionMixins from '../mixins/exhibition'; // 设置展厅部分混入
import batchDownload from '../mixins/batchDownload'; // 批量下载部分混入
import batchImport from '../mixins/batchImport'; // 批量导入部分混入

/* 作品管理列表 */
export default {
	name: 'data-management-works-list',
	data() {
		return {
			/* 编辑分类 */
			categoriesDialogVisible: false,
			categoriesPassBtnLoading: false,
			categoriesForm: {
				categories: []
			},
			categoriesRules: {
				categories: [
					{
						required: true,
						message: '请选择分类',
						trigger: 'change'
					}
				]
			},
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
					needRef: false // 是否需要刷新表格
				},
				/* 表格展示数据配置 */
				tableConfig: [
					{ label: '作品名称', prop: 'title', minWidth: 150 },
					{
						label: '作品类别',
						render: (h, params) => {
							const { categories } = params.row;
							return categories.map(item => {
								return (
									<el-tag type="parmary" style="margin-right:5px;">
										{item.name}
									</el-tag>
								);
							});
						},
						minWidth: 250
					},
					{
						label: '作品标签',
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
					{ label: '朝代', prop: 'forming', sortable: true },
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
						label: '上传时间',
						width: 150,
						render: (h, params) => {
							return <span>{this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
						}
					}
				],
				/* 表格内部按钮配置 */
				tableBtnConfig: {
					width: 200, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						isToEditPage: true,
						pageAddress: '/views/index/works-edit'
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
							name: '设置展厅', // 按钮title
							emitName: 'setExhibition' // 绑定事件的事件名
						},
						{
							name: '是否显示', // 按钮title
							emitName: 'handleIsShow' // 绑定事件的事件名
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
						title: '上传作品',
						icon: 'el-icon-plus',
						jumpPage: true,
						jumpAddress: '/views/index/works-add'
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
							title: '批量设置展厅',
							emitName: 'setExhibitionBatch' // 自定义事件的函数名
						},
						{
							title: '批量下载',
							emitName: 'downloadBatch' // 自定义事件的函数名
						},
						{
							title: '批量审核',
							emitName: 'examineBatch' // 自定义事件的函数名
						}
					]
				},
				/* 表格上方筛选组件配置 */
				filterConfig: {
					filter_list: ['search', 'examineType', 'workType', 'dynasty', 'pictureType'], // 需要筛选的字段
					search_field: [
						['dynasty', 'dynastyId'],
						['examineType', 'status'],
						['workType', 'paramIds'],
						['draftType', 'proofread'],
						['pictureType', 'images']
					], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'title',
							label: '作品名称'
						}
					]
				}
			},
			theApi, // 表格用ajax
			fileApi,
			fileUploadVisible: false // 批量导入
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	mixins: [examineMixins, batchDownload, exhibitionMixins, batchImport],
	components: { baseTable, fileUpload, addWorkCategorie },
	methods: {
		// 查看详情
		goToDetail: function(row = {}) {
			this.$router.push({
				path: '/views/index/works-examine',
				query: {
					editId: row.id // 与编辑共用id
				}
			});
		},
		// 表格内下载
		download: function(row = {}) {
			const { title } = row;
			theApi.download(title).then(res => {
				console.log(res);
			});
		},
		// 设置是否显示在前台
		handleIsShow: function(row = {}) {
			const { id } = row;
			this.$confirm(`选择此作品是否要显示在网站前台`, '显示/隐藏', {
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
		},
		handleClassify: async function(obj) {
			const { id } = obj;
			try {
				const res = await theApi.getDetail({ id });
				if (res.code === 200) {
					let respon = res.result || {};
					/* 针对一些必须的字段做处理 */
					if (!respon.hasOwnProperty('size')) {
						respon.size = {};
					}
					respon = IDToArray(respon, ['categories', 'exhibitions', 'topics', 'tags', 'textures'], 'id'); // 对象数组转换成string数组
					this.categoriesForm = respon;
					this.categoriesDialogVisible = true;
				}
			} catch (err) {
				console.log(err);
			}
		},
		/* 编辑分类ajax */
		categoriesAjax: function() {
			this.$refs['categoriesForm'].validate(valid => {
				if (valid) {
					this.categoriesPassBtnLoading = true;
					let data = this.categoriesForm;
					data = checkboxAddID(data, ['categories', 'exhibitions', 'topics', 'tags', 'textures'], 'id'); // 字符串数组转由id构成的数组
					theApi
						.editItem(data)
						.then(res => {
							if (res.code !== 200) return;
							this.categoriesDialogVisible = false;
							this.categoriesPassBtnLoading = false;
							this.changeNeedRef(true); // 刷新表格
							this.$message({
								message: '分类编辑成果!',
								type: 'success'
							});
						})
						.catch(err => {
							this.categoriesPassBtnLoading = false;
						});
				}
			});
		}
	}
};
</script>
