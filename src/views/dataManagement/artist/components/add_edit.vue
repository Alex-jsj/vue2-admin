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
					<el-form-item label="姓名:" prop="name">
						<el-input :disabled="pageType === 'examine'" v-model="form.name" placeholder="请输入姓名" maxlength="50" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="生年:" prop="birthday" class="form-item-with-add">
						<el-input :disabled="pageType === 'examine'" v-model="form.birthday" placeholder="请输入生年"></el-input>
						<el-button :disabled="pageType === 'examine'" type="text" class="add-more-btn" @click="notQuiteClear('birthday')">不详</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="卒年:" prop="deathday" class="form-item-with-add">
						<el-input :disabled="pageType === 'examine'" v-model="form.deathday" placeholder="请输入卒年"></el-input>
						<el-button :disabled="pageType === 'examine'" type="text" class="add-more-btn" @click="notQuiteClear('deathday')">不详</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="排序:" prop="sort">
						<el-input :disabled="pageType === 'examine'" v-model="form.sort" placeholder="请输入排序"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 12">
					<el-form-item label="朝代:" prop="dynastyId" class="form-item-with-add">
						<addDynasty :needDisabled="pageType === 'examine'" v-model="form.dynastyId" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="画像:" prop="images" :error="formError.images">
						<singleImageUpload
							:ajax_address="imageApi"
							:photo="form.imageUrl"
							v-if="pageType !== 'examine'"
							v-on="{ uploadSuccess: uploadSuccess }"
						/>
						<span v-if="pageType !== 'examine'" style="font-size: 12px;color: #606266;margin-left:12px;">
							若无作者画像，可使用其他图片
						</span>
						<a :href="form.imageUrl" target="_blank" v-if="pageType === 'examine' && form.imageUrl" style="max-width:100%;">
							<img :src="form.imageUrl" alt="画像" style="max-width:100%;" />
						</a>
						<span style="font-size:12px" v-if="pageType === 'examine' && !form.imageUrl">未上传</span>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="字号:">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入字号" v-model="form.styled"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="别名:">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入别名" v-model="form.alias"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="斋馆:">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入斋馆" v-model="form.house"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="isMobile ? 24 : 6">
					<el-form-item label="籍里:">
						<el-input :disabled="pageType === 'examine'" placeholder="请输入籍里" v-model="form.nativePlace"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="人物介绍:" prop="introduce">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入人物介绍"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.introduce"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="主要著述:">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入主要著述"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.writing"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="集评:">
						<el-input
							:disabled="pageType === 'examine'"
							placeholder="请输入集评"
							type="textarea"
							:rows="5"
							maxlength="10000"
							show-word-limit
							v-model="form.comments"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-if="pageType !== 'examine'">
					<el-form-item>
						<el-button type="primary" :loading="loading" size="medium" @click="submitForm">提 交</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="24" v-else>
					<el-form-item label="状态:">
						<el-tag size="small" type="warning" v-if="form.status === -1">已驳回</el-tag>
						<p v-if="form.status === -1">驳回理由：{{ form.refusedReason }}</p>
						<el-tag size="small" type="success" v-else-if="form.status === 1">已通过</el-tag>
						<el-tag size="small" v-else>待审核</el-tag>
					</el-form-item>
					<el-form-item label="审核:" v-if="form.status === 0">
						<el-button type="warning" :loading="failBtnLoading" :disabled="passBtnLoading" @click="examineFail($route.query.editId, true)">
							驳回
						</el-button>
						<el-button type="success" :loading="passBtnLoading" :disabled="failBtnLoading" @click="examinePass($route.query.editId, true)">
							通过
						</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/dataManagement/artist';
import { imageApi } from '@api/public'; // 文件上传接口
/* 组件 */
import singleImageUpload from '@components/upload/singleImageUpload'; // 多图上传
import addDynasty from '@components/adds/addDynasty'; // 添加朝代
/* mixins */
import rules from './mixins/rules'; // 验证规则
import initMixins from './mixins/init'; // 初始化
import examineMixins from '../mixins/examine'; // 审核
/* other */
import { mapState } from 'vuex';
export default {
	name: 'add_edit',
	mixins: [initMixins, rules, examineMixins],
	data() {
		return {
			loading: false, // 提交loading
			infoLoading: false, // 编辑/查看加载数据loading
			finalizeBtnLoading: false, // 定稿loading
			form: {
				birthday: '',
				deathday: '',
				dynastyId: '',
				sort: 999
			},
			imageApi
		};
	},
	props: {
		pageType: {
			type: String,
			default: 'add'
		}
	},
	components: { singleImageUpload, addDynasty },
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
									if (res.code !== 200) {
										return;
									}
									// 关闭弹框
									if (this.pageType === 'add') {
										// 新增
										this.$message.success('新增成功');
									} else if (this.pageType === 'edit') {
										// 编辑
										this.$message.success('数据更新成功');
									} else {
										// 审核
									}
									this.$router.push({
										path: '/views/index/artist-list'
									});
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
				if (res.code !== 200) {
					return;
				}
				const respon = res.result || {};
				this.form = respon;
				this.$nextTick(() => {
					this.$refs['form'].clearValidate();
				});
				this.infoLoading = false;
			} catch (err) {
				this.infoLoading = false;
			}
		},
		// 从子组件获取上传成功之后的图片信息
		uploadSuccess: function(val) {
			this.form.imageUrl = val.url;
		},
		// 设置不详
		notQuiteClear: function(field) {
			this.form[field] = '不详';
			this.$refs.form.validateField(field);
		}
	}
};
</script>
<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#add-edit {
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
}
</style>
