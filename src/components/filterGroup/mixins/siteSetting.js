// 站点设置
// 混入方法都使用 &_ 前缀用以区分
import { mapState } from 'vuex';
export default {
    data() {
        return {
            menuType: 1, // 布局状态
            contentWidthType: '流式',
            isCollapse: false // 导航是否折叠
        };
    },
    watch: {
        listenContentWidthType(newVal) {
            this.contentWidthType = newVal;
            this.showBtn();
        },
        listenMenuType(newVal) {
            this.menuType = newVal;
            this.showBtn();
        },
        listenMenuCollapse(newVal) {
            this.isCollapse = newVal;
            this.showBtn();
        }
    },
    computed: {
        ...mapState({
            vuex_siteSetting: 'siteSetting'
        }),
        listenContentWidthType() {
            return this.vuex_siteSetting.contentWidthType;
        },
        listenMenuType() {
            return this.vuex_siteSetting.menuType;
        },
        listenMenuCollapse() {
            return this.vuex_siteSetting.menuCollapse;
        }
    }
};
