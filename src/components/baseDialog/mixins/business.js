/* 部门 */
import { getDepartment, getRoles } from '@api/filterGroup'; // api
export default {
	data() {
		return {
			departmentOptions: [],
			departmentProps: {
				multiple: false, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'id',
				label: 'departName'
			},
			roleList: [] // 角色组列表
		};
	},
	watch: {
		dialogFormVisible: function(newVal) {
			if (!newVal) return;
			this.config.map(item => {
				if (item.type === 'department') this.get_dapertment();
				if (item.type === 'role') this.get_roles();
			});
		}
	},
	methods: {
		/* 获取部门 */
		get_dapertment: async function() {
			try {
				const res = await getDepartment();
				if (res.code === 200) {
					const respon = res.result || [];
					this.departmentOptions = respon;
				}
			} catch (err) {
				console.log(err);
			}
		},
		/* 获取角色组 */
		get_roles: async function() {
			try {
				const res = await getRoles();
				if (res.code === 200) {
					const respon = res.result || [];
					this.roleList = respon;
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
};
