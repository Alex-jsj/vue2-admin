// 题跋操作
export default {
    methods: {
        addPostscriptItem: function(idx) {
            this.form.inscription.splice(idx + 1, 0, {
                postscript: ''
            });
        },
        removePostscriptItem: function(idx) {
            let length = this.form.inscription.length;
            if (length < 2) {
                return;
            }
            this.form.inscription.splice(idx, 1);
        }
    }
};
