import Vue from 'vue';
import Vuex from 'vuex';

import login from './modules/login'; // 登录组件
import tagsView from './modules/tagsView'; // 标签页组件
import siteSetting from './modules/siteSetting'; // 网站设置

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token_field: 'vue2_admin_token',
        isMobile: false, // 是否移动端
        mobileMenuSwitch: false // 移动端菜单开关
    },
    modules: {
        login, // 登录、用户信息
        tagsView, // 多标签
        siteSetting // 页面设置
    },
    mutations: {
        // 设置移动端标记
        SET_MOBILE: function(state, newVal) {
            state.isMobile = newVal;
        },
        // 移动端菜单开关
        SET_MENU_SWITCH: function(state, newVal) {
            state.mobileMenuSwitch = newVal;
        }
    }
});
