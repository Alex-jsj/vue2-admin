/* api */
import { addItem } from '@api/mock';
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';
export default {
	data() {
		return {
			childDialogVisible: false,
			childBtnLoading: false,
			parentTitle: '',
			addChildForm: {
				type: this.type,
				sort: 999
			},
			addChildRules: {
				name: [
					{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}
				],
				sort: [
					{
						required: true,
						validator: checkPositiveInteger,
						trigger: 'blur'
					}
				]
			}
		};
	},
	methods: {
		addChild: function(row = {}) {
			const { name, id } = row;
			this.parentTitle = name;
			this.addChildForm.pid = id;
			this.childDialogVisible = true;
		},
		addChildAjax: async function() {
			this.childBtnLoading = true;
			try {
				const res = await addItem(this.addChildForm);
				if (res.code === 200) {
					this.childDialogVisible = false;
					this.configData.otherConfig.needRef = true;
					this.$refs.addChildForm.resetFields();
					this.$message.success('添加子类成功');
				}
				this.childBtnLoading = false;
			} catch (err) {
				this.childBtnLoading = false;
			}
		},
		beforeAddClose: function() {
			this.childDialogVisible = false;
			this.$refs.addChildForm.resetFields();
		}
	}
};
