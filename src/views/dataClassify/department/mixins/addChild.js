import { addItem } from '@api/dataClassify/department';
export default {
	data() {
		return {
			childDialogVisible: false,
			childBtnLoading: false,
			parentTitle: '',
			addChildForm: {
				departOrder: 999,
				departName: ''
			},
			addChildRules: {
				departName: [
					{
						required: true,
						message: '请输入部门名称',
						trigger: 'blur'
					}
				],
				departOrder: [
					{
						required: false,
						message: '排序只能为正整数',
						trigger: 'blur'
					}
				]
			}
		};
	},
	methods: {
		addChild: function(row = {}) {
			const { departName, id } = row;
			this.parentTitle = departName;
			this.addChildForm.parentId = id;
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
