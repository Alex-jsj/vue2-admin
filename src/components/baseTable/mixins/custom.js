// 自定义显示组件部分
import { deepClone } from '@utils/public';
import customDisplay from '../components/customDisplay'; // 自定义显示
export default {
    data() {
        return {
            customArr: [] // 自定义显示数据
        };
    },
    components: { customDisplay },
    created() {
        this.initCustom(this.tableConfig);
    },
    methods: {
        // 初始化表格列数据与自定义显示数组
        initCustom: function(arr = []) {
            let my_arr = deepClone(arr); // 先深拷贝一次
            my_arr.map(item => {
                if (!item.hasOwnProperty('customShow')) {
                    item.customShow = true;
                }
            });
            this.customArr = my_arr;
            this.tableColumnConfig = my_arr;
        },
        // 更新自定义显示组件数据
        updateCustomDisplay: function(arr = []) {
            let my_arr = deepClone(arr); // 先深拷贝一次
            this.tableColumnConfig = my_arr.filter(item => {
                return item.customShow;
            });
        }
    }
};
