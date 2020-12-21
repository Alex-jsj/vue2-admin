// 表格下方功能区域
import pagination from '@components/pagination'; // 分页
export default {
    data() {
        return {
            currentPaging: { currentPage: 1, pageSize: 10, totals: 0 } // 分页
        };
    },
    components: { pagination },
    methods: {
        // 分页sizeChange
        handleSizeChange: function(val) {
            this.currentPaging.pageSize = val;
            this.currentPaging.currentPage = 1;
            // 更新数据
            this.getData();
        },
        // 分页currentChange
        handleCurrentChange: function(val) {
            this.currentPaging.currentPage = val;
            // 更新数据
            this.getData();
        },
        // 分页数据兜底
        dataFix: function(data = []) {
            let { currentPage } = this.currentPaging;
            if (currentPage > 1 && data.length === 0) {
                this.currentPaging.currentPage = currentPage - 1;
                this.getData();
            }
        }
    }
};
