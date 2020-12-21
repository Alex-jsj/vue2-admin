// 匹配已筛选项
// 混入方法都使用 &_ 前缀用以区分
import { isEmpty } from '@utils/public'; // 公用函数
export default {
	data() {
		return {
			// 展示在搜索之后的筛选项数组
			filter_arr: []
		};
	},
	methods: {
		// 生成筛选项列表数据
		$_initFilter: function(filterList = {}) {
			const filter_list = JSON.parse(JSON.stringify(filterList));
			let arr = [];
			for (let key in filter_list) {
				const { title } = this.$_filterMap(key, filter_list[key]); // 如果筛选的字段不在字典里则不显示

				if (!isEmpty(filter_list[key]) && !isEmpty(title)) {
					arr.push({
						key: key,
						title: this.$_filterMap(key, filter_list[key]).title,
						value: this.$_filterMap(key, filter_list[key]).value
					});
				}
			}
			this.filter_arr = arr;
		},
		// 筛选项列表字典
		$_filterMap: function(theKey = '', theValue) {
			const key = theKey;
			const val = theValue;
			let item = {};
			switch (key) {
				case 'keyword':
					item.title = '关键字';
					item.value = val;
					break;
				case 'date_scope':
					item.title = '时间段';
					item.value = `${this.$moment(val[0]).format('YYYY-MM-DD HH:mm:ss')} - ${this.$moment(val[1]).format('YYYY-MM-DD HH:mm:ss')}`;
					break;
				case 'classify':
					item.title = '分类';
					item.value = this.$_arrayMapFilter(this.classifyList, val).label;
					break;
				case 'operation':
					item.title = '操作人';
					item.value = this.$_arrayMapFilter(this.operationList, val).label;
					break;
				case 'user':
					item.title = '用户';
					item.value = this.$_arrayMapFilter(this.userList, val).label;
					break;
				case 'event':
					item.title = '事件';
					item.value = this.$_arrayMapFilter(this.eventList, val).label;
					break;
				case 'examineType':
					item.title = '审核状态';
					item.value = this.$_arrayMapFilter(this.examineTypeList, val).label;
					break;
				case 'draftType':
					item.title = '定稿状态';
					item.value = this.$_arrayMapFilter(this.draftTypeList, val).label;
					break;
				case 'dynasty':
					item.title = '朝代';
					item.value = this.$_arrayMapFilter(this.dynastyList, val).label;
					break;
				case 'pictureType':
					item.title = '图片格式';
					item.value = this.$_arrayMapFilter(this.pictureTypeList, val).label;
					break;
				case 'workType':
					item.title = '作品类别';
					item.value = this.$_treeMapFilter(this.workTypeList, val);
					break;
				case 'permissionGroup':
					item.title = '权限组';
					item.value = this.$_arrayMapFilter(this.permissionList, val).label;
					break;
				case 'userState':
					item.title = '状态';
					item.value = this.$_arrayMapFilter(this.userStateList, val).label;
					break;
				default:
					item = {};
			}
			return item;
		},
		// 筛选项字典内filter
		$_arrayMapFilter: function(list = [], value = '') {
			const arr = JSON.parse(JSON.stringify(list));
			let val = value;
			arr.filter(el => {
				if (el.value === val) {
					val = el;
				}
			});
			return val;
		},
		/* 树形列表的筛选 */
		$_treeMapFilter: function(list = [], value = '') {
			const arr = JSON.parse(JSON.stringify(list));
			let val = value;
			let menuTree = {
				id: 'all',
				name: '所有分类',
				children: arr
			};
			let _menu = []; // 路径数组
			let findIt = false; // 是否匹配到
			let getPath = function(tree) {
				_menu.push(tree.name);
				if (tree.id === val) {
					findIt = true;
					return;
				}
				if (tree.children && tree.children.length > 0) {
					for (let i = 0; i < tree.children.length; i++) {
						getPath(tree.children[i]);
						if (findIt) return;
					}
					_menu.pop();
				} else if (!tree.children || tree.children.length === 0) {
					_menu.pop();
				}
			};
			getPath(menuTree);
			_menu.shift();
			return _menu.join('/');
		},
		// 关闭筛选
		$_closeTag: function(item) {
			let key = item.key;
			// 关联字段清除
			if (item.key === 'keyword') {
				delete this.filterData.keyword;
				delete this.filterData[this.search_radio];
			} else {
				delete this.filterData[key];
			}
			this.getFilterData();
		},
		// 清空筛选
		$_closeAllTag: function() {
			this.filterData = {};
			this.getFilterData();
		}
	}
};
