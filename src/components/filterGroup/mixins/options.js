// 选项列表
// 混入方法都使用 &_ 前缀用以区分
import * as filterApi from '@api/filterGroup'; //api
export default {
	data() {
		return {
			// 审核状态
			examineTypeList: [
				{
					value: 0,
					label: '待审核'
				},
				{
					value: 1,
					label: '已通过'
				},
				{
					value: -1,
					label: '已驳回'
				}
			],
			// 定稿状态
			draftTypeList: [
				{
					value: 0,
					label: '未定稿'
				},
				{
					value: 1,
					label: '已定稿'
				}
			],
			// 朝代
			dynastyList: [],
			// 图片格式
			pictureTypeList: [
				{
					value: '*"type": "jpg"*',
					label: 'jpg'
				},
				{
					value: '*"type": "jpeg"*',
					label: 'jpeg'
				},
				{
					value: '*"type": "png"*',
					label: 'png'
				},
				{
					value: '*"type": "tif"*',
					label: 'tif'
				}
			],
			// 作品类别
			workTypeList: [],
			workTypeProps: {
				multiple: false, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'id',
				label: 'name'
			},
			// 展厅类别
			exhibitionTypeList: [],
			exhibitionTypeProps: {
				multiple: false, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'id',
				label: 'name'
			},
			// 用户冻结状态
			userStateList: [
				{
					value: 1,
					label: '正常'
				},
				{
					value: 2,
					label: '冻结'
				}
			],
			// 权限组
			permissionList: [],
			permissionProps: {
				multiple: false, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'value',
				label: 'title'
			},
			// 事件
			eventList: [
				{
					value: 'create',
					label: '新增'
				},
				{
					value: 'update',
					label: '更新'
				},
				{
					value: 'delete',
					label: '删除'
				},
				{
					value: 'query',
					label: '查询'
				}
			],
			// 操作人
			operationList: [],
			// 用户
			userList: []
		};
	},
	mounted() {
		if (this.filterOptions.dynasty) this.get_dynasty(); // 朝代
		if (this.filterOptions.workType) this.get_worksType(); // 作品类别
		if (this.filterOptions.exhibitionType) this.get_exhibitionType(); // 展厅
		if (this.filterOptions.permissionGroup) this.get_permissionGroup(); // 权限
	},
	methods: {
		/* 替换字段值 */
		formatField: function(list = []) {
			let arr = [];
			list.map(item => {
				item.value = item.id;
				item.label = item.name;
			});
			arr = list;
			return arr;
		},
		/* 获取朝代 */
		get_dynasty: async function() {
			try {
				const res = await filterApi.getDynasty();
				if (res.code === 200) {
					let respon = res.result || [];
					this.dynastyList = this.formatField(respon);
				}
			} catch (err) {
				// console.log(err);
			}
		},
		/* 获取展厅类别 */
		get_exhibitionType: async function() {
			try {
				const res = await filterApi.getCategories({ type: 'exhibition' });
				if (res.code === 200) {
					let respon = res.result || [];
					this.exhibitionTypeList = respon;
				}
			} catch (err) {
				console.log(err);
			}
		},
		/* 获取作品类别 */
		get_worksType: async function() {
			try {
				const res = await filterApi.getCategories({ type: 'work' });
				if (res.code === 200) {
					let respon = res.result || [];
					this.workTypeList = respon;
				}
			} catch (err) {
				console.log(err);
			}
		},
		/* 获取权限组 */
		get_permissionGroup: async function() {
			try {
				const res = await filterApi.getPermission();
				if (res.code === 200) {
					let respon = res.result.treeList || [];
					this.permissionList = respon;
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
};
