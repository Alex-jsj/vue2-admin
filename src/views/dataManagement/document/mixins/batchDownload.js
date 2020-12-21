/* 批量下载 */
import { batch_download } from '@api/dataManagement/document';
import { downloadFile } from '@utils/public';
export default {
	data() {
		return {
			batchDownloadDialogVisible: false,
			batchDownloadBtnLoading: false,
			batchDownloadList: []
		};
	},
	methods: {
		downloadBatch: function(arr = []) {
			this.batchDownloadList = [];
			this.batchDownloadDialogVisible = true;
			let my_arr = JSON.parse(JSON.stringify(arr));
			my_arr.map(item => {
				this.batchDownloadList.push({
					title: item.title,
					id: item.id
				});
			});
		},
		closeBatchDownloadDialog: function() {
			this.batchDownloadDialogVisible = false;
			this.batchDownloadList = [];
		},
		batchDownloadSubmit: async function() {
			this.batchDownloadBtnLoading = true;
			try {
				const res = await batch_download();
				this.batchDownloadBtnLoading = false;
			} catch (err) {
				this.batchDownloadBtnLoading = false;
			}
		}
	}
};
