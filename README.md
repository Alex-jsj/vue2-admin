![](未命名/Image.png)

# 后台管理系统 1.0.0

基于**_vue 2.6.12_**和**_elementUI 2.14.1_**开发的中后台系统模板

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 主要技术

-   vue
-   vuex
-   vue\-router
-   axios
-   elementUI
-   less

## 一些小插件

-   日期格式 \-\- Moment.js
-   用户引导 \-\- intro.js
-   加密 \-\- js\-md5
-   页面加载进度条 \-\- nprogress
-   二维码解析 \-\- qrcodejs2
-   富文本 \-\- tinymce
-   滚动条 \-\- vuescroll
-   国际化 \-\- vue\-i18n

## 文件结构

-   ├── dist // 上线项目文件，放在服务器即可正常访问
-   ├── public // 不参与打包的文件
-   │ ├── data // 资源文件
-   │ ├── img // 图片资源
-   │ ├── mock // 本地开发模拟数据
-   │ ├── favicon.ico // 图标
-   │ ├── index.html // 入口 html 文件
-   ├── src // 源码目录
-   │ ├── api // api
-   │ ├── assets // 静态资源
-   │ ├── components // 组件
-   │ │ ├── baseDialog // 表单组件
-   │ │ ├── baseTable // 表格组件
-   │ │ ├── filterGroup // 筛选组件
-   │ │ ├── sideBar // 侧边栏组件
-   │ │ ├── siteSetting // 页面设置组件
-   │ │ ├── tagsView // 多标签组件
-   │ │ ├── topBar // 网站顶部栏
-   │ │ ├── upload // 上传组件
-   │ │ ├── crumb.vue // 面包屑组件
-   │ │ ├── fullScreen.vue // 全屏组件
-   │ │ ├── pagination.vue // 分页组件
-   │ │ ├── switchLang.vue // 语言切换组件
-   │ ├── i18n // 国际化
-   │ │ ├── lang // 语言字典
-   │ │ ├── index.js // 入口文件
-   │ ├── mixins // 混入
-   │ ├── route // 路由
-   │ │ ├── menu // 菜单文件
-   │ │ ├── routeModules // 路由配置
-   │ │ ├── index.js // 入口文件
-   │ ├── store // vuex
-   │ │ ├── modules // 数据模块
-   │ │ │ ├── login // 登录
-   │ │ │ │ ├── actions.js
-   │ │ │ │ ├── getters.js
-   │ │ │ │ ├── index.js
-   │ │ │ │ ├── mutations.js
-   │ │ │ │ ├── states.js
-   │ │ │ ├── siteSetting // 页面设置
-   │ │ │ ├── tagsView // 多标签
-   │ │ ├── index.js // 入口文件
-   │ ├── utils // 公用方法
-   │ │ ├── checkTypes.js // 格式化数据状态
-   │ │ ├── filter.js // 全局 filter
-   │ │ ├── http.js // axios 全局拦截
-   │ │ ├── permission.js // 权限管理
-   │ │ ├── public.js // 公用方法
-   │ │ ├── verify.js // 表单验证
-   │ ├── views // 页面
-   │ │ ├── accessory // 附件管理
-   │ │ ├── components // 组件
-   │ │ ├── home // 工作台
-   │ │ ├── personalCenter // 个人中心
-   │ │ ├── public // 公共页面
-   │ │ ├── redirect // 刷新组件用文件
-   │ │ ├── system // 系统管理
-   │ │ ├── user // 用户管理
-   │ ├── App.vue // 页面入口文件
-   │ ├── main.js // 程序入口文件，加载各种公共组件

