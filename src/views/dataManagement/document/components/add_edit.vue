<template>
	<div id="add-edit">
		<el-form
			v-loading="infoLoading"
			:model="form"
			label-width="100px"
			:label-position="isMobile ? 'top' : ''"
			:rules="rules"
			ref="form"
			:style="isMobile ? '' : 'width:1100px;margin:0 auto;'"
		>
			<el-row>
				<el-col :span="24">
					<el-form-item label="文档名称:" prop="title">
						<el-input :disabled="pageType === 'examine'" v-model="form.title" placeholder="请输入标题" maxlength="50" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="所属专题:" prop="topics">
						<addTopic v-model="form.topics" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="文档类别:" prop="categories">
						<addCategorie v-model="form.categories" :needDisabled="pageType === 'examine'" type="document" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="标签:" prop="tags" class="form-item-with-add">
						<addTag v-model="form.tags" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="所属展厅:" prop="exhibitions" class="form-item-with-add">
						<addExhibition v-model="form.exhibitions" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item :label="pageType !== 'examine' ? '上传文档:' : '点击预览:'" prop="url" :error="formError.url">
						<fileUpload
							v-if="pageType !== 'examine'"
							:files="files"
							:ajax_address="documentApi"
							accept=".xls,.xlsx,.doc,.docx,.pdf"
							@file_upload_success="file_upload_success"
						/>
						<p class="online-preview" v-else @click="onlinePreview(form.url)">{{ form.url }}</p>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="描述:" prop="docDescribe">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入文档描述"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.docDescribe"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="文档大小:">
						<el-input :disabled="true" v-model="form._size">
							<template slot="append">
								{{ form._unit }}
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="文档格式:">
						<el-input :disabled="true" v-model="form.type"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="文档页数:" prop="page">
						<el-input :disabled="pageType === 'examine'" v-model="form.page" placeholder="请输入文档页数">
							<template slot="append">
								页
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="文档封面图:">
						<singleImageUpload
							:ajax_address="imageApi"
							:photo="form.cover"
							:styleConfig="{ width: '200px', height: '300px' }"
							v-if="pageType !== 'examine'"
							@uploadSuccess="uploadSuccess"
						/>
						<a :href="form.cover" target="_blank" v-else style="max-width:100%;">
							<img :src="form.cover" alt="文档封面图" style="max-width:100%;" />
						</a>
					</el-form-item>
				</el-col>
				<!-- 操作按钮 -->
				<el-col :span="24" v-if="pageType !== 'examine'">
					<el-form-item>
						<el-button type="primary" :loading="loading" size="medium" @click="submitForm">提 交</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-else>
					<el-form-item label="状态:">
						<el-tag size="small" type="success" v-if="form.status === 1">已通过</el-tag>
						<el-tag size="small" type="danger" v-else-if="form.status === -1">已驳回</el-tag>
						<el-tag size="small" type="primary" v-else>待审核</el-tag>
						<el-tag size="small" type="success" style="margin-left:5px;" v-if="form.proofread">已定稿</el-tag>
						<el-tag size="small" style="margin-left:5px;" v-else>未定稿</el-tag>
					</el-form-item>
					<el-form-item label="驳回理由:" v-if="form.status === -1">{{ form.refusedReason }}</el-form-item>
					<el-form-item label="审核:" v-if="form.status === 0 || form.status === null">
						<el-button type="warning" :loading="failBtnLoading" :disabled="passBtnLoading" @click="examineFail($route.query.editId, true)">
							驳回
						</el-button>
						<el-button type="success" :loading="passBtnLoading" :disabled="failBtnLoading" @click="examinePass($route.query.editId, true)">
							通过
						</el-button>
					</el-form-item>
					<el-form-item label="定稿:" v-if="form.status === 1 && !form.proofread">
						<el-button type="primary" :loading="finalizeBtnLoading" @click="finalize($route.query.editId)">定 稿</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/document';
import { imageApi, documentApi } from '@api/public'; // 图片上传接口
/* 组件 */
import fileUpload from '@components/upload/fileUpload'; // 文件上传
import singleImageUpload from '@components/upload/singleImageUpload'; // 单图上传
import addTag from '@components/adds/addTag'; // 添加标签
import addExhibition from '@components/adds/addExhibition'; // 添加展厅
import addCategorie from '@components/adds/addCategorie'; // 添加类别
import addTopic from '@components/adds/addTopic'; // 添加专题
/* mixins */
import rules from './mixins/rules'; // 验证规则
import examineMixins from '../mixins/examine'; // 审核
/* 方法 */
import { checkboxAddID, IDToArray, formatSize } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';

export default {
	name: 'add_edit',
	mixins: [rules, examineMixins],
	data() {
		return {
			loading: false, // 提交loading
			infoLoading: false, // 编辑/查看加载数据loading
			finalizeBtnLoading: false, // 定稿loading
			form: {},
			files: [], // 上传的文档列表
			imageApi,
			documentApi
		};
	},
	props: {
		pageType: {
			type: String,
			default: 'add'
		}
	},
	components: {
		singleImageUpload,
		fileUpload,
		addTag,
		addExhibition,
		addCategorie,
		addTopic
	},
	computed: {
		...mapState(['isMobile'])
	},
	created() {
		if (this.pageType === 'edit' || this.pageType === 'examine') {
			this.getInfo(this.$route.query.editId);
		}
	},
	methods: {
		// 弹框内容提交
		submitForm() {
			this.formError = {};
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true;
					// data
					let data = JSON.parse(JSON.stringify(this.form));
					data = checkboxAddID(data, ['categories', 'exhibitions', 'topics', 'tags'], 'id'); // 字符串数组转由id构成的数组
					/* 移除不必要的字段 */
					delete data.updateBy;
					delete data.updateTime;
					// ajax
					let match_name = `${this.pageType}Item`;
					for (let key in theApi) {
						if (match_name === key) {
							theApi[key](data)
								.then(res => {
									this.loading = false;
									if (res.code === 200) {
										// 关闭弹框
										if (this.pageType === 'add') {
											// 新增
											this.$message.success('新增成功');
										} else if (this.pageType === 'edit') {
											// 编辑
											this.$message.success('数据更新成功');
										}
										this.$router.push({
											path: '/views/index/document-list'
										});
									}
								})
								.catch(() => {
									this.loading = false;
								});
						}
					}
				} else {
					this.$message.error('请完善信息');
					this.loading = false;
				}
			});
		},
		// 编辑获取数据
		getInfo: async function(id) {
			this.infoLoading = true;
			try {
				const res = await theApi.getDetail({ id });
				this.infoLoading = false;
				if (res.code === 200) {
					let respon = res.result || {};
					respon = IDToArray(respon, ['categories', 'exhibitions', 'topics', 'tags'], 'id'); // 对象数组转换成string数组
					let { _size, _unit } = formatSize(respon.size); // 格式化文件大小
					Object.assign(respon, { _size, _unit });
					this.files = [
						{
							name: respon.url.split('/')[respon.url.split('/').length - 1],
							status: 'success',
							result: {
								url: respon.url
							}
						}
					];
					this.form = respon;
					this.$nextTick(() => {
						this.$refs['form'].clearValidate();
					});
				}
			} catch (err) {
				this.infoLoading = false;
			}
		},
		// 从子组件获取上传成功之后的图片信息
		uploadSuccess: function(img = {}) {
			this.form.cover = img.url;
		},
		/* 文件上传成功 此页面只支持上传一个文件，但是组件返回的是数组 */
		file_upload_success: function(list = []) {
			if (list.length > 0) {
				let file = list[0];
				if (file.result) {
					let { _size, _unit } = formatSize(file.result.attr.size); // 格式化文件大小
					Object.assign(this.form, { _size, _unit });
					this.$set(this.form, 'size', file.result.attr.size); // 文档大小
					this.$set(this.form, 'type', file.result.prefix); // 文档格式
					this.$set(this.form, 'page', file.result.attr.pageCount); // 页码
					this.$set(this.form, 'cover', file.result.attr.cover); // 封面图
					this.$set(this.form, 'url', file.result.url); // 文件路径
				}
			} else {
				this.files = [];
				let { _size, _unit } = {}; // 格式化文件大小
				Object.assign(this.form, { _size, _unit });
				this.$set(this.form, 'size', ''); // 文档大小
				this.$set(this.form, 'type', ''); // 文档格式
				this.$set(this.form, 'page', ''); // 页码
				this.$set(this.form, 'cover', ''); // 封面图
				this.$set(this.form, 'url', ''); // 文件路径
			}
		},
		// 定稿
		finalize: function(id) {
			this.$confirm(`确定要定稿吗？`, '定稿', {
				distinguishCancelAndClose: true,
				confirmButtonText: '确定',
				cancelButtonText: '我再想想',
				confirmButtonClass: 'el-button--success',
				type: 'warning'
			})
				.then(() => {
					this.finalizeBtnLoading = true;
					this.finalizeAjax(id);
				})
				.catch(action => {});
		},
		// 定稿ajax
		finalizeAjax: async function(id) {
			try {
				const res = await theApi.finalize({ id, isTrue: true });
				if (res.code === 200) {
					this.getInfo(id);
				}
				this.finalizeBtnLoading = false;
			} catch (err) {
				this.finalizeBtnLoading = false;
			}
		},
		/* 在线预览 */
		onlinePreview: function(url) {
			window.open('http://q-huan.mynetgear.com:20182/onlinePreview?url=' + window.location.origin + encodeURIComponent(url));
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#add-edit {
	.online-preview {
		cursor: pointer;
		color: @blue;
	}
}
</style>
