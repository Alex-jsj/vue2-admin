/* 设置展厅 */
import { setExhibition } from '@api/exhibitionManagement/list';
import { getExhibition } from '@api/filterGroup';
import { reject } from 'any-promise';
export default {
	data() {
		return {
			exhibitionDialogVisible: false, // 弹框控制
			exhibitionRowID: '', // 当前表格行的id
			exhibitionPassBtnLoading: false, // 按钮loading
			exhibitionList: [], // 展厅列表
			exhibitionForm: {
				exhibitionID: []
			},
			exhibitionRules: {
				exhibitionID: [
					{
						required: true,
						message: '请选择展厅',
						trigger: 'change'
					}
				]
			}
		};
	},
	watch: {
		exhibitionDialogVisible: function(newVal) {
			if (!newVal) {
				this.exhibitionForm.exhibitionID = [];
			} else {
				this.$nextTick(() => {
					this.$refs['exhibitionForm'].clearValidate();
				});
			}
		}
	},
	methods: {
		/* 设置展厅(单个) */
		setExhibition: function(row = {}) {
			const { id, exhibitions } = row;
			this.get_exhibition().then(() => {
				// 从表格获取当前展厅
				let _list = [];
				exhibitions.map(item => {
					if (item.hasOwnProperty('id')) _list.push(item.id);
				});
				this.exhibitionForm.exhibitionID = _list;
			});
			this.exhibitionDialogVisible = true;
			this.exhibitionRowID = id;
		},
		/* 获取展厅 */
		get_exhibition: async function() {
			try {
				const res = await getExhibition();
				if (res.code === 200) {
					const respon = res.result || [];
					this.exhibitionList = respon;
				}
			} catch (err) {
				// console.log(err);
			}
		},
		/* 批量设置展厅 */
		setExhibitionBatch: function(arr = []) {
			this.exhibitionDialogVisible = true;
			this.exhibitionRowID = arr.map(item => item.id).join(',');
			this.get_exhibition();
		},
		/* ajax */
		exhibitionAjax: async function() {
			let ids = this.exhibitionRowID;
			this.$refs['exhibitionForm'].validate(valid => {
				if (valid) {
					this.exhibitionPassBtnLoading = true;
					setExhibition({
						ids,
						exhiIds: this.exhibitionForm.exhibitionID.join(','),
						type: 'work'
					})
						.then(res => {
							if (res.code !== 200) reject(res);
							this.exhibitionDialogVisible = false;
							this.exhibitionPassBtnLoading = false;
							this.configData.otherConfig.needRef = true; // 刷新表格
							this.$message({
								message: '展厅设置完成!',
								type: 'success'
							});
						})
						.catch(err => {
							this.exhibitionPassBtnLoading = false;
						});
				}
			});
		}
	}
};
