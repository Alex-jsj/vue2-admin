import Vue from 'vue';
import App from './App';
import router from './route';

// vue-router ≥3.0版本回调形式以及改成promise api的形式了，返回的是一个promise，如果没有捕获到错误，控制台始终会出现如图的警告，针对于路由跳转相同的地址，目前的解决方案: this.$router.push('/location').catch(err => { console.log(err) })
// 暂时加入如下代码解决
import Router from 'vue-router';
const originalPush = Router.prototype.push;

Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
};

// 封装之后的Axios
import axios from './utils/http';
Vue.prototype.$http = axios;

// store的导入 必须要写在 axios导入后面，不然axios拦截器中无法获取store实例
import store from './store';

// 国际化
import i18n from './i18n';

// 日期格式化工具
import moment from 'moment';
Vue.prototype.$moment = moment;

// Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@assets/css/element-variables.scss';
Vue.use(ElementUI, {
	size: 'mini', // 全局size
	i18n: (key, value) => i18n.t(key, value) // 国际化支持
});

// 引导组件
import introJS from 'intro.js';
import 'intro.js/introjs.css';
Vue.prototype.$intro = introJS;

// 自定义滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);

// 引入外部资源
import './assets/css/reset.css'; // css reset
import './assets/css/element-ui.css'; // elementUI 组件样式覆盖
import './assets/css/public.css'; // 公用样式
import './assets/iconfont/iconfont.css'; // 阿里巴巴图标库

import './utils/permission'; // 全局权限管理

Vue.config.productionTip = false; // 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.silent = process.env.NODE_ENV !== 'development'; // 取消 Vue 所有的日志与警告
// Vue.config.performance = process.env.NODE_ENV !== "production"; // vue性能测试监控

new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app');
