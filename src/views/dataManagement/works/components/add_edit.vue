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
					<el-form-item label="作品名称:" prop="title">
						<el-input :disabled="pageType === 'examine'" v-model="form.title" placeholder="请输入标题" maxlength="50" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="作品图片:" prop="images" :error="formError.images">
						<multiplePhotoUpload :ajax_address="imageApi" v-if="pageType !== 'examine'" v-model="form.images" />
						<div v-else>
							<a :href="item.url" :key="item.thumbnailUrl" target="_blank" v-for="item in form.images" class="examine-img">
								<img :src="item.thumbnailUrl" alt="作品图片" />
							</a>
						</div>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="24" v-if="pageType !== 'examine'">
					<el-form-item label="作品压缩包:">
						<fileUpload :files="files" :ajax_address="zipApi" accept=".zip" @file_upload_success="file_upload_success" />
					</el-form-item>
				</el-col> -->
				<el-col :span="24">
					<el-form-item label="题跋:" class="form-item-1">
						<div v-for="(item, index) in form.inscription" :key="index">
							<el-input :disabled="pageType === 'examine'" v-model="form.inscription[index].postscript" placeholder="请输入题跋"></el-input>
							<div class="icon-container" v-if="pageType !== 'examine'">
								<i class="iconfont icon-add" @click="addPostscriptItem(index)"></i>
								<i class="iconfont icon-remove" @click="removePostscriptItem(index)"></i>
							</div>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="作品类别:" prop="categories" class="form-item-with-add">
						<!-- <addCategorie v-model="form.categories" :needDisabled="pageType === 'examine'" type="work" /> -->
						<addWorkCategorie v-model="form.categories" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="艺术家:" prop="artistId" class="form-item-with-add">
						<addArtist v-model="form.artistId" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="朝代:" prop="dynastyId" class="form-item-with-add">
						<addDynasty v-model="form.dynastyId" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="质地:" prop="textures" class="form-item-with-add">
						<addTexture v-model="form.textures" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="作品年份:" prop="forming">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入作品年份" v-model="form.forming"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="收藏地:" prop="collections">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入收藏地" v-model="form.collections"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="标签:" prop="tags" class="form-item-with-add">
						<addTag v-model="form.tags" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="所属展厅:" prop="exhibitions" class="form-item-with-add">
						<addExhibition v-model="form.exhibitions" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="所属专题:" prop="topics">
						<addTopic v-model="form.topics" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 16">
					<el-form-item label="尺寸:" prop="size">
						<el-input :disabled="pageType === 'examine'" placeholder="长度" v-model="form.size.length" style="width:30%;">
							<template slot="append">
								cm
							</template>
						</el-input>
						<el-input :disabled="pageType === 'examine'" placeholder="宽度" v-model="form.size.width" style="width:30%;margin-left:5%;">
							<template slot="append">
								cm
							</template>
						</el-input>
						<el-input :disabled="pageType === 'examine'" placeholder="高度" v-model="form.size.height" style="width:30%;margin-left:5%;">
							<template slot="append">
								cm
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 8">
					<el-form-item label="出处:" prop="source">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入出处" v-model="form.source"></el-input>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="isMobile ? 24 : 6">
					<el-form-item label="书籍名称:" prop="bookName">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入书籍名称" v-model="form.bookName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="图书馆:" prop="library">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入图书馆" v-model="form.library"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="出版社:" prop="press">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入出版社" v-model="form.press"></el-input>
					</el-form-item>
				</el-col> -->
				<!-- <el-col :span="24">
					<el-form-item label="排序:" prop="sort">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入整数" type="number" v-model="form.sort"></el-input>
					</el-form-item>
				</el-col> -->
				<el-col :span="24">
					<el-form-item label="自定义字段:" class="form-item-2">
						<div v-for="(item, index) in form.customField" :key="index">
							<el-input
								:disabled="pageType === 'examine'"
								v-model="form.customField[index].key"
								placeholder="请输入字段名,如：作品所属"
							></el-input>
							<span class="custom-text">:</span>
							<el-input
								class="custom-input"
								:disabled="pageType === 'examine'"
								v-model="form.customField[index].value"
								placeholder="请输入字段值,如：中国美术学院"
							></el-input>
							<div class="icon-container" v-if="pageType !== 'examine'">
								<i class="iconfont icon-add" @click="addCustomFieldItem(index)"></i>
								<i class="iconfont icon-remove" @click="removeCustomFieldItem(index)"></i>
							</div>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="文献集评:" prop="literature">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入文献集评"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.literature"
						></el-input>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="24">
					<el-form-item label="编者评述:" prop="comment">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入编者评述"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.comment"
						></el-input>
					</el-form-item>
				</el-col> -->
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
import * as theApi from '@api/dataManagement/works';
import { imageApi, zipApi } from '@api/public'; // 图片上传接口
/* 组件 */
import multiplePhotoUpload from '@components/upload/multiplePhotoUpload'; // 多图上传
import fileUpload from '@components/upload/fileUpload'; // 文件上传
import addDynasty from '@components/adds/addDynasty'; // 添加朝代
import addArtist from '@components/adds/addArtist'; // 添加艺术家
import addTag from '@components/adds/addTag'; // 添加标签
import addTexture from '@components/adds/addTexture'; // 添加质地
import addExhibition from '@components/adds/addExhibition'; // 添加展厅
// import addCategorie from '@components/adds/addCategorie'; // 添加类别
import addWorkCategorie from '@components/adds/addWorkCategorie'; // 添加作品类别
import addTopic from '@components/adds/addTopic'; // 添加专题

/* mixins */
import postscriptMixins from './mixins/postscript'; // 题跋
import custom_fieldMixins from './mixins/custom_field'; // 自定义字段
import rules from './mixins/rules'; // 验证规则
import examineMixins from '../mixins/examine'; // 审核
/* 方法 */
import { parseField, stringifyField, checkboxAddID, IDToArray } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';
export default {
	name: 'add_edit',
	mixins: [postscriptMixins, custom_fieldMixins, rules, examineMixins],
	data() {
		return {
			files: [],
			loading: false, // 提交loading
			infoLoading: false, // 编辑/查看加载数据loading
			finalizeBtnLoading: false, // 定稿loading
			form: {
				title: '',
				forming: '',
				collections: '',
				categories: [],
				customField: [
					{
						key: '',
						value: ''
					}
				],
				inscription: [
					{
						postscript: ''
					}
				],
				size: {
					length: '',
					width: '',
					height: ''
				},
				images: [],
				topics: [],
				dynastyId: 'e534e9e42faccc59104445f6764ef6bb',
				artistId: 'e5d2203af2f2a7f375f96768fab7a448'
			},
			imageApi,
			zipApi
		};
	},
	watch: {
		'form.images': function(newVal) {
			if (!this.form.title && newVal.length > 0) {
				this.form.title = newVal.slice(-1)[0].name.split('.')[0];
			}
		}
	},
	props: {
		pageType: {
			type: String,
			default: 'add'
		}
	},
	components: {
		multiplePhotoUpload,
		// fileUpload,
		addDynasty,
		addTag,
		addTexture,
		addArtist,
		addExhibition,
		// addCategorie,
		addWorkCategorie,
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
					data = stringifyField(data, ['customField', 'inscription', 'size', 'images']); // 部分数据转string
					data = checkboxAddID(data, ['categories', 'exhibitions', 'topics', 'tags', 'textures'], 'id'); // 字符串数组转由id构成的数组
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
											this.$refs['form'].resetFields();
										} else if (this.pageType === 'edit') {
											// 编辑
											this.$message.success('数据更新成功');
											this.$router.push({
												path: '/views/index/works-list'
											});
										} else {
											// 审核
										}
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
					/* 针对一些必须的字段做处理 */
					if (!respon.hasOwnProperty('size')) {
						respon.size = {};
					}
					respon = parseField(respon, ['customField', 'inscription', 'size', 'images']); // 解析string
					respon = IDToArray(respon, ['categories', 'exhibitions', 'topics', 'tags', 'textures'], 'id'); // 对象数组转换成string数组
					this.form = respon;
					this.$nextTick(() => {
						this.$refs['form'].clearValidate();
					});
				}
			} catch (err) {
				this.infoLoading = false;
			}
		},
		/* 文件上传成功 此页面只支持上传一个文件，但是组件返回的是数组 */
		file_upload_success: function(list = []) {
			if (list.length > 0) {
				let file = list[0];
				this.form.images = file.result || [];
			} else {
				this.files = [];
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
		}
	}
};
</script>
<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#add-edit {
	.form-item-1,
	.form-item-2 {
		.el-input {
			width: calc(~'100% - 65px');
			position: relative;
			top: -2px;
		}
		.icon-container {
			width: 65px;
			height: 28px;
			display: inline-block;
			.iconfont {
				font-size: 20px;
				color: #909399;
				line-height: 28px;
				cursor: pointer;
				margin-left: 10px;
				.transi;
				&:hover {
					color: @blue;
				}
			}
		}
		&.form-item-2 {
			.el-input {
				width: calc(~'49% - 35px');
			}
			.custom-text {
				color: #909399;
				line-height: 28px;
				margin: 0 1%;
			}
		}
	}
	.examine-img {
		width: 146px;
		height: 146px;
		margin-right: 10px;
		border-radius: 5px;
		display: inline-block;
		overflow: hidden;
		border: 1px solid #ddd;
		position: relative;
		img {
			position: absolute;
			width: 100%;
			height: auto;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
