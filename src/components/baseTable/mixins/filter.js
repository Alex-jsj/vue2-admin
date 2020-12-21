// 表格上方筛选部分
import filterGroup from '@components/filterGroup'; // 筛选组件
export default {
	data() {
		return {
			filter_data: {} // 筛选项
		};
	},
	props: {
		filterConfig: {
			type: Object,
			default: () => {}
		} // 筛选项配置
	},
	components: { filterGroup },
	methods: {
		// 筛选
		filterData: function(obj = {}) {
			let my_field = [];
			if (this.filterConfig.search_field) {
				my_field = JSON.parse(JSON.stringify(this.filterConfig.search_field));
			}
			this.tableData = []; // 清空表格数据
			this.filter_data = JSON.parse(JSON.stringify(obj)); // 筛选组件过来的数据
			this.currentPaging.currentPage = 1;
			// 替换字段
			my_field.forEach(item => {
				if (this.filter_data.hasOwnProperty(item[0])) {
					this.filter_data[item[1]] = this.filter_data[item[0]];
					delete this.filter_data[item[0]];
				}
			});
			// 刷新数据
			this.getData();
		}
	}
};
