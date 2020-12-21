// 验证规则
export default {
	data() {
		return {
			rules: {
				name: [
					{
						required: true,
						message: '请输入专题名称',
						trigger: 'blur'
					}
				]
			},
			formError: {}
		};
	},
	mounted() {
		// hank方法，移除element form 初始化时的自动校验
		this.$nextTick(() => {
			this.$refs.form.clearValidate();
		});
	}
};
