// 验证规则
export default {
	data() {
		return {
			rules: {
				title: [
					{
						required: true,
						message: '请输入文档名称',
						trigger: 'blur'
					}
				],
				url: [
					{
						required: true,
						message: '请上传文档',
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
