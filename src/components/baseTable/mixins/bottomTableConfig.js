// 表格下方功能区域
import { verifyPsd } from '@api/login';
import { md5Psd } from '@utils/public';
export default {
	props: {
		bottomBtnConfig: {
			type: Object,
			default: () => {
				return {
					batchDelete: false,
					extends: []
				};
			}
		}
	},
	methods: {
		// 表格选择
		handleSelectionChange: function(val) {
			this.multipleSelection = val;
			this.allSelect = val.length === this.tableData.length;
		},
		// 表格单选
		_handleCurrentChange(val) {
			this.otherConfig.needSingelClick ? this.$emit(this.otherConfig.singelClickName, val) : '';
		},
		// 全选按钮
		toggleSelection: function(rows) {
			if (rows && !this.allSelect) {
				rows.forEach(row => {
					this.$refs.table.toggleRowSelection(row, true);
				});
			} else {
				this.$refs.table.clearSelection();
			}
		},
		// 批量删除前处理
		batchDeleteConfirm: function() {
			const con = this.tableBtnConfig.deleteConfirm; // 是否需要密码确认
			let ids = []; // 需要转换成用逗号分隔的字符串
			this.multipleSelection.map(item => {
				ids.push(item.id);
			});
			if (con) {
				this.$prompt('为确保数据安全,请输入您的登录密码以确认删除操作', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[0-9a-zA-Z_@.]{5,20}$/,
					inputErrorMessage: '密码格式不正确',
					type: 'warning'
				})
					.then(({ value }) => {
						verifyPsd({ password: md5Psd(this.login.account, value) }).then(res => {
							if (res.code === 200) this.batchDelete(ids.join(','));
						});
					})
					.catch(() => {});
			} else {
				this.$confirm('是否删除选择的条目?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						//ajax
						this.batchDelete(ids.join(','));
					})
					.catch(err => {
						this.$message.info('取消删除');
					});
			}
		},
		// 批量删除
		batchDelete: function(ids = '') {
			this.theApi.batchDeleteItems({ ids }).then(res => {
				if (res.code === 200) {
					this.$message.success('删除成功');
					// 刷新数据
					this.getData();
				}
			});
		}
	}
};
