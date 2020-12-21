// 滚动条插件
// 混入方法都使用 &_ 前缀用以区分
export default {
    data() {
        return {
            ops: {
                vuescroll: {},
                scrollPanel: {
                    scrollingX: false
                },
                rail: {},
                bar: {
                    /** 当不做任何操作时滚动条自动消失的时间 */
                    showDelay: 1500,
                    /** 是否只在滚动的时候现实滚动条 */
                    onlyShowBarOnScroll: true,
                    /** 背景色*/
                    background: "#c1c1c1",
                    /**  透明度  */
                    opacity: 0.5,
                    /** 当你鼠标移动到滚动条的时候滚动条的样式， 返回一个style对象， 和现在的对象融合*/
                    hoverStyle: false,
                    /** 是否保持rail显示即使内容高度不足的情况下。 */
                    keepShow: false
                }
            }
        };
    }
};
