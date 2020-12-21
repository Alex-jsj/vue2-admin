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
					<el-form-item label="专题名称:" prop="name">
						<el-input :disabled="pageType === 'examine'" v-model="form.name" placeholder="请输入标题" maxlength="100" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="专题类别:" prop="categories">
						<addCategorie v-model="form.categories" :needDisabled="pageType === 'examine'" type="topic" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="标签:" prop="tags" class="form-item-with-add">
						<addTag v-model="form.tags" :needDisabled="pageType === 'examine'" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="专题缩略图:">
						<singleImageUpload
							:ajax_address="imageApi"
							:photo="form.cover"
							:styleConfig="{ width: '200px', height: '300px' }"
							v-if="pageType !== 'examine'"
							@uploadSuccess="uploadSuccess"
						/>
						<a :href="form.cover" target="_blank" v-else style="max-width:100%;">
							<img :src="form.cover" alt="专题缩略图" style="max-width:100%;" />
						</a>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="专题介绍:" prop="introduce">
						<el-input
							type="textarea"
							:rows="5"
							:disabled="pageType === 'examine'"
							v-model="form.introduce"
							placeholder="请输入专题介绍"
							maxlength="10000"
							show-word-limit
						></el-input>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="24">
					<el-form-item label="时间:">
						<el-date-picker
							v-model="form.date"
							:disabled="pageType === 'examine'"
							type="datetime"
							align="right"
							format="yyyy-MM-dd HH:mm:ss"
							default-time="18:00:00"
							value-format="yyyy-MM-dd HH:mm:ss"
							style="width:100%"
						></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="地址:">
						<el-input :disabled="pageType === 'examine'" v-model="form.address" placeholder="请输入地址" maxlength="100" show-word-limit></el-input>
					</el-form-item>
				</el-col> -->
				<!-- 操作按钮 -->
				<el-col :span="24" v-if="pageType !== 'examine'">
					<el-form-item>
						<el-button type="primary" :loading="loading" size="medium" @click="submitForm">提 交</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/topic';
import { imageApi } from '@api/public'; // 图片上传接口
/* 组件 */
import singleImageUpload from '@components/upload/singleImageUpload'; // 单图上传
import addTag from '@components/adds/addTag'; // 添加标签
import addCategorie from '@components/adds/addCategorie'; // 添加类别
/* mixins */
import rules from './mixins/rules'; // 验证规则
/* 方法 */
import { checkboxAddID, IDToArray } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';

export default {
	name: 'add_edit',
	mixins: [rules],
	data() {
		return {
			loading: false, // 提交loading
			infoLoading: false, // 编辑/查看加载数据loading
			form: {},
			imageApi
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
		addTag,
		addCategorie
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
					data = checkboxAddID(data, ['categories', 'tags'], 'id'); // 字符串数组转由id构成的数组
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
											path: '/views/index/topic-list'
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
					respon = IDToArray(respon, ['categories', 'tags'], 'id'); // 对象数组转换成string数组
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
