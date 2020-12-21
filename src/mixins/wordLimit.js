// 字数限制
// 混入方法都使用 &_ 前缀用以区分
export default {
    data() {
        return {};
    },
    methods: {
        /**
         * 示例：form.title
         * @param {String} obj
         * @param {String} field
         * @param {Number} nums
         */
        $_setLimit: function(obj, field, nums) {
            let val = this.$_getValue(obj, field);
            if (val.length > nums) {
                this[obj][field] = val.substr(0, nums);
            }
        },
        /**
         * 递归获取属性值
         * @param {String} obj
         * @param {String} valuePath
         */
        $_getValue: function(obj, valuePath) {
            let temObj = obj;
            let keyArr = valuePath.split('.');
            return keyArr.reduce((cur, next) => {
                return cur[next];
            }, this[temObj]);
        }
    }
};
