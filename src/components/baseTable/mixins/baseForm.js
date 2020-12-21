// 表单组件部分
import BaseDialogForm from '@components/baseDialog'; // 基础表单
/* 方法 */
import { md5Psd } from '@utils/public';
export default {
	data() {
		return {
			dialogFormLoading: false, // 表单弹框loading
			dialogFormVisible: false, // 表单弹框开关
			isEdit: false, // 是否是编辑
			initFormModel: {}, // 表单数据模型
			formError: {}, // 后台输出错误信息
			dialogTitle: '' // 新增修改模态框title
		};
	},
	props: {
		formTitle: {
			type: String,
			default: ''
		}, // 表单标题，例如用户、角色
		formWidth: {
			type: [String, Number],
			default: ''
		},
		formLabelWidth: {
			type: [String, Number],
			default: ''
		},
		formConfig: {
			type: Array,
			default: () => []
		}, // 表单配置
		formDataModel: {
			type: Object,
			default: () => {}
		} // 表单的model数据
	},
	components: { BaseDialogForm },
	computed: {
		// 表单数据模型
		formModel: {
			get: function() {
				return this.initFormModel;
			},
			set: function(newValue) {
				this.initFormModel = newValue;
			}
		}
	},
	created() {
		this.my_initFormModel(); // 初始化表单数据模型
	},
	methods: {
		// 初始化表单模型
		my_initFormModel: function() {
			if (this.formDataModel) {
				const data = JSON.parse(JSON.stringify(this.formDataModel));
				this.formModel = data;
			}
		},
		// 模态框数据提交
		dialogSubmit: async function(data) {
			this.dialogFormLoading = true; // 打开弹框提交按钮loading
			let my_data = JSON.parse(JSON.stringify(data));
			/* 为所有的password字段做md5处理 */
			for (let key in my_data) {
				if (key === 'password' && my_data.hasOwnProperty('username')) {
					my_data.password = md5Psd(my_data.username, my_data.password);
				}
			}
			// 根据是否有id判断是新增还是编辑
			try {
				if (data.id) {
					Object.assign(my_data, { force: 1 });
				}
				const res = await this.theApi[data.id ? 'editItem' : 'addItem'](my_data);
				if (res.code === 200) {
					this.dialogFormVisible = false; // 弹框关闭
					this.getData();
					this.$message.success(this.dialogTitle + '成功！');
				}
				this.dialogFormLoading = false; // 弹框loading取消
			} catch (err) {
				this.dialogFormLoading = false;
			}
		}
	}
};
