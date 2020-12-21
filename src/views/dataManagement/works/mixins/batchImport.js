/* 批量导入 */
import { batch_import } from '@api/dataManagement/works';
export default {
	data() {
		return {
			uploadShow: false, // 批量导入
			uploadBtnLoading: false,
			uploadFileList: []
		};
	},
	methods: {
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
				const res = batch_import(data);
				this.uploadBtnLoading = false;
			} catch (err) {
				this.uploadBtnLoading = false;
				console.log(err);
			}
		},
		uploadSuccess: function(fileList = []) {
			this.uploadFileList = fileList;
		}
	}
};
