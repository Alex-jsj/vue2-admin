// 自定义字段操作
export default {
    methods: {
        addCustomFieldItem: function(idx) {
            this.form.customField.splice(idx + 1, 0, {
                key: '',
                value: ''
            });
        },
        removeCustomFieldItem: function(idx) {
            let length = this.form.customField.length;
            if (length < 2) {
                return;
            }
            this.form.customField.splice(idx, 1);
        }
    }
};
