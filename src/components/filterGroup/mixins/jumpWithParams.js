// 带参数跳转，主动筛选
// 混入方法都使用 &_ 前缀用以区分
export default {
    methods: {
        $_activeScreening: function() {
            let temporaryObj = {};
            // 带参数的跳转
            if (this.$route.query.show_filter === '1') {
                if (this.open_btn_show) {
                    // 如果当前筛选项比较多，超过一行显示了，则主动展开筛选项
                    this.open = true;
                    this.btn_text = '收起';
                }
                // example
                // if (this.$route.query.d20 === "true") {
                // 	Object.assign(temporaryObj, { signType: 0 });
                // }
                this.filterData = temporaryObj;
                this.$emit('getFilterData', this.filterData);
                this.initFilter(this.filterData);
            }
        }
    }
};
