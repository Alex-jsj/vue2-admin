/* eslint-disable no-undefined */
/* eslint-disable no-implicit-coercion */
// 浏览器缩放提示
// 混入方法都使用 &_ 前缀用以区分
export default {
    data() {
        return {
            instance: null,
            isZoomOpen: false
        };
    },
    mounted() {
        process.env.NODE_ENV !== 'development' && this.$_isZoom(); // 开发时不启用
        let timer = null;
        window.addEventListener('resize', () => {
            // 防抖处理
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                process.env.NODE_ENV !== 'development' && this.$_isZoom();
            }, 200);
        });
    },
    methods: {
        $_detectZoom: function() {
            let ratio = 0,
                screen = window.screen,
                ua = navigator.userAgent.toLowerCase();
            //
            if (~ua.indexOf('firefox')) {
                if (window.devicePixelRatio !== undefined) {
                    ratio = window.devicePixelRatio;
                }
            } else if (~ua.indexOf('msie')) {
                if (screen.deviceXDPI && screen.logicalXDPI) {
                    ratio = screen.deviceXDPI / screen.logicalXDPI;
                }
            } else if (
                window.outerWidth !== undefined &&
                window.innerWidth !== undefined
            ) {
                ratio = window.outerWidth / window.innerWidth;
            }
            //
            if (ratio) {
                ratio = Math.round(ratio * 100);
            }
            // 360安全浏览器下的innerWidth包含了侧边栏的宽度
            if (ratio !== 100) {
                if (ratio >= 95 && ratio <= 105) {
                    ratio = 100;
                }
            }
            return ratio;
        },
        $_isZoom: function() {
            if (this.$_detectZoom() < 100 || this.$_detectZoom() > 100) {
                this.$_zoomNotifyOpen();
            } else {
                this.$_zoomNotifyClose();
            }
        },
        $_zoomNotifyOpen: function() {
            if (!this.isZoomOpen) {
                this.isZoomOpen = true; // 加上标记防止多次提示
                this.instance = this.$notify({
                    title: this.$t('base.tips'),
                    message: this.$t('base.zoom'),
                    type: 'info',
                    duration: 0
                });
            }
        },
        $_zoomNotifyClose: function() {
            if (this.instance !== null) {
                // 判断是否为null 防止bug
                this.instance.close();
                this.isZoomOpen = false;
            }
        }
    }
};
