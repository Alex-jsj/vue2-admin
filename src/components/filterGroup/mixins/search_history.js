export default {
    data() {
        return {
            searchHistoryList: []
        };
    },
    methods: {
        /**
         * 本地存储搜索历史
         * @param {*} value
         */
        $_saveHistory: function(value = '') {
            let list =
                JSON.parse(localStorage.getItem('vue_admin_search_history')) ||
                [];
            let arr = [];
            list.unshift(value);
            if (list.length > 10) {
                // 最多只保存10个历史记录
                list = list.slice(0, 10);
            }
            arr.push(...new Set(list)); // 去重
            localStorage.setItem(
                'vue_admin_search_history',
                JSON.stringify(arr)
            );
            this.$_getSearchHistory(); // 更新历史记录
        },
        // 获取历史记录
        $_getSearchHistory: function() {
            this.searchHistoryList =
                JSON.parse(localStorage.getItem('vue_admin_search_history')) ||
                [];
        },
        /**
         * 删除某个历史
         * @param {Number} idx
         */
        $_remoteHistoryItem: function(idx) {
            this.searchHistoryList.splice(idx, 1);
            localStorage.setItem(
                'vue_admin_search_history',
                JSON.stringify(this.searchHistoryList)
            );
        },
        // 清空历史
        $_clearHistory: function() {
            this.searchHistoryList = [];
            localStorage.setItem(
                'vue_admin_search_history',
                JSON.stringify([])
            );
        },
        /**
         * 点击某个历史选项
         * @param {Number} idx
         */
        $_handleClickHistory: function(idx) {
            this.filterData.keyword = this.searchHistoryList[idx]; // 给定搜索值
            this.getFilterData(); // 触发筛选
        }
    }
};
