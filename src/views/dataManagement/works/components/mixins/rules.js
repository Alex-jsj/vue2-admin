// 验证规则
export default {
	data() {
		return {
			rules: {
				title: [
					{
						required: true,
						message: '请输入作品名称',
						trigger: 'blur'
					}
				],
				images: [
					{
						required: true,
						message: '请上传作品图片',
						trigger: ['blur', 'change']
					}
				],
				categories: [
					{
						required: true,
						message: '请选择作品类别',
						trigger: 'change'
					}
				],
				artistId: [
					{
						required: true,
						message: '请选择艺术家',
						trigger: 'change'
					}
				],
				dynastyId: [
					{
						required: true,
						message: '请选择朝代',
						trigger: 'change'
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
