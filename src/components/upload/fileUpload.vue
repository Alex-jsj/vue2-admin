<template>
	<el-upload
		class="file-upload"
		ref="file-upload"
		drag
		multiple
		:action="ajax_address"
		:http-request="handleUpload"
		:on-preview="handlePreview"
		:on-remove="handleRemove"
		:before-upload="beforeAvatarUpload"
		:on-exceed="handleExceed"
		:file-list="filelist"
		:accept="accept"
		:limit="limit"
	>
		<i class="el-icon-upload"></i>
		<div class="el-upload__text">
			将文件拖到此处，或
			<em>点击上传</em>
		</div>
		<div class="el-upload__tip" slot="tip">只能上传 {{ accept }} 文件，且不超过2G</div>
	</el-upload>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'file-upload',
	data() {
		return {
			filelist: []
		};
	},
	props: {
		files: {
			type: Array,
			default: () => []
		},
		ajax_address: {
			type: String,
			default: ''
		},
		limit: {
			type: Number,
			default: 1
		},
		accept: {
			type: String,
			default: '.xls,.xlsx,.doc,.docx,.zip,.7z'
		}
	},
	watch: {
		files: function(newVal) {
			this.filelist = newVal;
		}
	},
	computed: {
		...mapState(['token_field', 'isMobile'])
	},
	methods: {
		// 移除上传文件
		handleRemove(file, fileList) {
			let list = [];
			fileList.map(item => {
				if (item.status === 'success') {
					list.push(item);
				}
			});
			this.filelist = list;
			this.$emit('file_upload_success', this.filelist);
		},
		// 点击文件列表中已上传的文件时的钩子
		handlePreview(file) {
			console.log(file);
		},
		// 上传文件数量限制
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`);
		},
		// 自定义上传
		handleUpload: function(param) {
			let fd = new FormData(); //通过form数据格式来传
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
					//调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
					param.onProgress({ percent: percent });
				}
			})
				.then(res => {
					if (res.code === 200) {
						const { name, size, type } = param.file;
						this.filelist.push({
							name,
							size,
							type,
							result: res.result || ''
						});
						this.$notify({
							title: '提示',
							message: res.message
						});
						this.$emit('file_upload_success', this.filelist);
						param.onSuccess();
					} else {
						param.onError();
					}
				})
				.catch(err => {
					this.$refs['file-upload'].uploadFiles = [];
				});
		},
		// 上传限制
		beforeAvatarUpload(file) {
			if (file.size === 0) {
				this.$message.error('不能上传大小为0的空文件!');
				return false;
			}
			const isInSize = file.size / 1024 / 1024 < 2048;
			if (!isInSize) {
				this.$message.error('上传文件大小不能超过 2G!');
			}
			return isInSize;
		}
	}
};
</script>

<style lang="less" scoped>
.file-upload {
	width: 100%;
	/deep/.el-upload {
		width: 100%;
		.el-upload-dragger {
			width: 100%;
		}
	}
	/deep/.el-upload-list__item {
		transition: none;
	}
}
</style>
