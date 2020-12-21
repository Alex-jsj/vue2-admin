// 权限控制

import router from '../route';
import store from '../store';
import { getUrlQuery } from './public'; // 获取url中的参数

// 网页加载进度条插件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // progress bar style
NProgress.configure({
    showSpinner: false
}); // NProgress Configuration

const whiteList = ['/login', '/404']; // 免登录白名单

// 配置
const location_url = window.location.href;
const token_field = store.state.token_field;

// 前台跳转过来带token则自动登录
const token = getUrlQuery(location_url, token_field);
if (token) {
    localStorage.setItem(token_field, token);
}

// 监控路由变化
router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    const the_token = localStorage.getItem(token_field);

    if (the_token) {
        // 有登录标记
        if (to.path === '/login') {
            // 如果准备跳转到登录页
            if (store.state.login.role) {
                // 当前用户已经拉取完用户信息
                next('/views/index');
                return;
            }
            store
                .dispatch('vuex_getUserInfo')
                .then(() => {
                    router.addRoutes(store.getters.GenerateRoutes); // 动态添加可访问路由表
                    next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                    location_url.indexOf('?') > -1 &&
                        window.location.replace(location_url.split('?')[0]); // 想不起来这句代码存在的意义了，暂时先做保留
                })
                .catch((err) => {
                    console.log(err);

                    localStorage.removeItem(token_field);
                    next('/login');
                });
        } else {
            // 如果准备跳转到其他页面
            if (store.state.login.role) {
                // 当前用户已经拉取完用户信息
                next();
                return;
            }
            store
                .dispatch('vuex_getUserInfo')
                .then(() => {
                    router.addRoutes(store.getters.GenerateRoutes); // 动态添加可访问路由表
                    next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                })
                .catch((err) => {

                    localStorage.removeItem(token_field);
                    next('/login');
                });
        }
    } else {
        whiteList.indexOf(to.path) !== -1 ? next() : next('/login'); // 在免登录白名单，直接进入  否则全部重定向到登录页
        NProgress.done();
    }
});

router.afterEach(() => {
    NProgress.done(); // finish progress bar
});
