<template>
	<div id="upload-container">
		<el-button icon="el-icon-upload" size="mini" @click="dialogVisible = true">插入图片</el-button>
		<el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" title="图片上传">
			<photoUpload :ajax_address="imageApi" v-on="{ upload_success: uploadSuccess }"></photoUpload>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import photoUpload from '@components/upload/photoUpload';
import { imageApi } from '@api/public';
export default {
	name: 'EditorSlideUpload',
	components: { photoUpload },
	data() {
		return {
			list: [],
			dialogVisible: false,
			imageApi
		};
	},
	methods: {
		handleSubmit() {
			if (this.list.length < 1) {
				this.$message.info('请等图片上传完成 或者 暂未上传图片');
				return;
			}
			this.$emit('successCBK', this.list);
			this.dialogVisible = false;
			this.list = [];
		},
		// 从子组件获取上传成功之后的图片信息
		uploadSuccess: function(imgPath = '') {
			this.list[0] = imgPath; // 暂时只能上传一张图片，有空再改成多图上传
		}
	}
};
</script>

<style lang="less" scoped>
#upload-container {
	/deep/.avatar-uploader {
		width: 100%;
	}
	/deep/.el-progress {
		width: 100%;
	}
	/deep/.el-dialog__headerbtn {
		top: 8px;
	}
}
</style>
