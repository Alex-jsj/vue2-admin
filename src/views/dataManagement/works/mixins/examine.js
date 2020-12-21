/* 审核 */
import { examine, batchExamine } from '@api/dataManagement/works';
export default {
	data() {
		return {
			examineDialogVisible: false,
			examineInfo: '',
			examineID: '',
			examineIDS: [], // 批量审核用
			passBtnLoading: false,
			failBtnLoading: false
		};
	},
	methods: {
		// 审核
		examine: function(row = {}) {
			const { id, title } = row;
			this.examineDialogVisible = true;
			this.examineInfo = `已选择作品：${title}`;
			this.examineID = id;
		},
		// 批量审核
		examineBatch: function(list = []) {
			let titles = [];
			list.map(item => {
				this.examineIDS.push(item.id);
				titles.push(item.title);
			});
			this.examineDialogVisible = true;
			this.examineInfo = `已选择作品：${titles.join('、')}`;
			this.examineID = '';
		},
		// 确认通过
		examinePass: function(id, isDetail = false, isBatch = false) {
			this.$confirm(`确定要通过审核吗？`, '通过审核', {
				distinguishCancelAndClose: true,
				confirmButtonText: '通过',
				cancelButtonText: '我再想想',
				confirmButtonClass: 'el-button--success',
				type: 'success'
			})
				.then(() => {
					this.passBtnLoading = true;
					isBatch ? this.examineAjax(this.examineIDS, 1, '', false, true) : this.examineAjax(this.examineID || id, 1, '', isDetail);
				})
				.catch(action => {});
		},
		// 不通过
		examineFail: function(id, isDetail = false, isBatch = false) {
			this.$prompt(`请输入驳回理由`, '驳回审核', {
				distinguishCancelAndClose: true,
				confirmButtonText: '驳回',
				cancelButtonText: '我再想想',
				confirmButtonClass: 'el-button--warning',
				type: 'warning'
			})
				.then(({ value }) => {
					this.failBtnLoading = true;
					isBatch ? this.examineAjax(this.examineIDS, -1, value, false, true) : this.examineAjax(this.examineID || id, -1, value, isDetail);
				})
				.catch(action => {});
		},
		// ajax
		examineAjax: async function(id, status = 1, refusedReason = '', isDetail = false, isBatch = false) {
			const data = {
				status,
				refusedReason
			};
			Object.assign(data, isBatch ? { ids: id.join(',') } : { id });
			try {
				const res = isBatch ? await batchExamine(data) : await examine(data);
				this.passBtnLoading = false;
				this.failBtnLoading = false;
				if (res.code === 200) {
					this.examineDialogVisible = false;
					if (isDetail) {
						this.getInfo(id); // 刷新详情页
					} else {
						this.configData.otherConfig.needRef = true; // 刷新表格
					}
					this.$message({
						message: status === 1 ? '审核已通过!' : '审核已驳回!',
						type: 'success'
					});
				}
			} catch (err) {
				this.passBtnLoading = false;
				this.failBtnLoading = false;
			}
		},
		// 关闭弹框
		examineDialogClose: function() {
			this.passBtnLoading = false;
			this.failBtnLoading = false;
			this.examineID = '';
			this.examineIDS = [];
		}
	}
};
