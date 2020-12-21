<template>
	<div id="single-image-upload" :class="isMobile ? 'mobile' : ''" :style="{ width: styleConfig.width, height: styleConfig.height }">
		<el-upload
			class="my-uploader"
			:style="{ width: styleConfig.width, height: styleConfig.height }"
			:http-request="handleUpload"
			:before-upload="beforeAvatarUpload"
			:action="ajax_address"
			:show-file-list="false"
			:disabled="Boolean(progress)"
		>
			<img v-if="imageUrl" :src="imageUrl" class="uploader-img" />
			<i
				v-else-if="progress === 0"
				class="el-icon-plus"
				:style="{ width: styleConfig.width, height: styleConfig.height, lineHeight: styleConfig.height }"
			></i>
		</el-upload>
		<el-progress :percentage="progress" v-if="progress" type="circle" :format="() => '上传中'"></el-progress>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	// 图片上传组件
	name: 'single-image-upload',
	data() {
		return {
			progress: 0,
			imageUrl: ''
		};
	},
	props: {
		ajax_address: {
			type: String,
			default: ''
		},
		photo: {
			type: String,
			default: ''
		},
		styleConfig: {
			type: Object,
			default: () => {
				return {
					width: '600px',
					height: '280px'
				};
			}
		}
	},
	computed: {
		...mapState(['isMobile', 'token_field'])
	},
	watch: {
		photo(newVal) {
			this.imageUrl = newVal;
		}
	},
	methods: {
		// 自定义上传
		handleUpload: function(param) {
			let fd = new FormData(); //通过form数据格式来传
			this.imageUrl = URL.createObjectURL(param.file); // 预览图
			fd.append('file', param.file); //传文件
			this.$http({
				method: 'post',
				url: this.ajax_address,
				data: fd,
				headers: {
					'X-Access-Token': `${localStorage.getItem(this.token_field)}`
				},
				onUploadProgress: progressEvent => {
					let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
					this.progress = percent;
				}
			})
				.then(res => {
					this.progress = 0;
					if (res.code === 200) {
						this.imageUrl = res.result.url;
						this.$emit('uploadSuccess', res.result);
					} else {
						this.$message.error('上传失败');
						this.imageUrl = '';
					}
				})
				.catch(err => {
					this.imageUrl = '';
					this.progress = 0;
				});
		},
		// 上传限制
		beforeAvatarUpload(file) {
			const reg = /\s/;
			const hasSpace = reg.test(file.name); // 是否有空格
			const isInSize = file.size / 1024 / 1024 < 15;
			const isAccept =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/jpg' || // doc
				file.type === 'image/bmp';
			if (hasSpace) {
				this.$message.error('文件名中不能含有空格!');
			}
			if (!isInSize) {
				this.$message.error('上传图片大小不能超过 15MB!');
			}
			if (!isAccept) {
				this.$message.error('只能上传 jpeg, jpg, png, bmp 文件!');
			}
			return isInSize && isAccept && !hasSpace;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#single-image-upload {
	position: relative;
	.my-uploader {
		display: block;
		border: 1px solid rgba(233, 233, 233, 1);
		position: relative;
		overflow: hidden;
		border-radius: 4px;
		.transi;
		&:hover {
			border-color: lighten(#4771ff, 15%);
		}
		/deep/.el-upload {
			width: 100%;
			height: 100%;
			text-align: center;
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 0;
			border: none;
			background: rgba(233, 233, 233, 0.3);
		}
		.uploader-img {
			max-width: 100%;
			max-height: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: inline-block;
		}
		.el-icon-plus {
			font-size: 36px;
			color: #8c939d;
			text-align: center;
		}
	}
	/deep/.el-progress {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(255, 255, 255, 0.8);
		width: 100%;
		height: 100%;
		.el-progress-circle {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	&.mobile {
		.my-uploader {
			width: 100%;
			height: 200px;
			.el-icon-plus {
				width: 100%;
				height: 200px;
				line-height: 200px;
			}
		}
	}
}
</style>
