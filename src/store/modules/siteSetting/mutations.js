export default {
    // 菜单展开收起
    SET_MENU_COLLAPSE: function(state, new_menuCollapse) {
        state.menuCollapse = new_menuCollapse;
    },
    // 菜单展开收起
    SET_MENU_FIXED: function(state, new_menuFixed) {
        state.menuFixed = new_menuFixed;
    },
    // 菜单主题色
    SET_THEME: function(state, new_isMenuDark) {
        state.isMenuDark = new_isMenuDark;
    },
    // 导航模式
    SET_MENUTYPE: function(state, new_menuType) {
        state.menuType = new_menuType;
    },
    // 内容宽度
    SET_CONTENTWIDTH: function(state, new_contentWidthType) {
        state.contentWidthType = new_contentWidthType;
    },
    // 语言
    SET_LANGUAGE: function(state, new_language) {
        state.language = new_language;
    }
};
