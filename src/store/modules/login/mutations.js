export default {
    // 角色
    SET_ROLE: function(state, new_role) {
        state.role = new_role;
    },
    // 菜单
    SET_MENU: function(state, new_menu) {
        state.menu = new_menu;
    },
    // 昵称
    SET_NICK_NAME: function(state, new_nickName) {
        state.nickName = new_nickName;
    },
    // 账号
    SET_ACCOUNT: function(state, new_account) {
        state.account = new_account;
    },
    // 头像
    SET_AVATAR: function(state, new_avatar) {
        state.avatar = new_avatar;
    },
    // 未读信息
    SET_UNREAD: function(state, new_unread) {
        state.unread = new_unread;
    },
    // 自动登录
    SET_AUTOLOGIN: function(state, newVal) {
        state.autoLogin = newVal;
    }
};
