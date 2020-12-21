// 验证规则
export default {
	data() {
		return {
			rules: {
				name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}
				],
				birthday: [
					{
						required: true,
						validator: (rule, value, callback) => {
							const deathday = this.form.deathday;
							let reg = /(^-?\d+$)|(^不详$)|(^\d{4}-\d{2}-\d{2}$)|(^\d{4}-\d{2}$)/;
							if (!value) {
								callback(new Error('请输入生年'));
							} else if (reg.test(value) === false) {
								callback(new Error("支持的格式：整数 / '不详' / yyyy-mm-dd / yyyy-mm"));
							} else if (deathday > 0 && deathday !== '不详' && Number(deathday) < Number(value)) {
								callback(new Error('生年不能晚于卒年'));
							} else if (deathday < 0 && deathday !== '不详' && Number(deathday) > Number(value)) {
								callback(new Error('生年不能晚于卒年'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				deathday: [
					{
						required: false,
						validator: (rule, value, callback) => {
							const birthday = this.form.birthday;
							let reg = /(^-?\d+$)|(^不详$)|(^\d{4}-\d{2}-\d{2}$)|(^\d{4}-\d{2}$)/;
							if (!value) {
								callback();
							} else if (reg.test(value) === false) {
								callback(new Error("支持的格式：整数 / '不详' / yyyy-mm-dd / yyyy-mm"));
							} else if (birthday > 0 && birthday !== '不详' && Number(birthday) > Number(value)) {
								callback(new Error('卒年不能早于生年'));
							} else if (birthday < 0 && birthday !== '不详' && Number(birthday) < Number(value)) {
								callback(new Error('卒年不能早于生年'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				dynasty: [
					{
						required: true,
						message: '请选择朝代',
						trigger: 'change'
					}
				],
				sort: [
					{
						required: false,
						validator: (rule, value, callback) => {
							let reg = /^[+]{0,1}(\d+)$/;
							if (!value) {
								callback();
							} else if (reg.test(value) === false) {
								callback(new Error('格式必须为正整数，可为0'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				introduce: [
					{
						required: false,
						message: '请输入人物介绍',
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
