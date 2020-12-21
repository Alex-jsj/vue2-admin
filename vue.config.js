const path = require('path');

module.exports = {
	// 基本路径
	publicPath: './',
	assetsDir: 'static', // 静态资源生成目录
	// webpack配置
	chainWebpack: config => {
		// 移除 prefetch 插件
		config.plugins.delete('prefetch');
	},

	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			// 为生产环境修改配置...
			config.mode = 'production';
		} else {
			// 为开发环境修改配置...
			config.mode = 'development';
		}
		Object.assign(config, {
			// 开发生产共同配置
			resolve: {
				extensions: ['.js', '.vue', '.json'],
				alias: {
					'@': path.resolve(__dirname, './src'),
					'@components': path.resolve(__dirname, './src/components'),
					'@api': path.resolve(__dirname, './src/api'),
					'@utils': path.resolve(__dirname, './src/utils'),
					'@assets': path.resolve(__dirname, './src/assets'),
					'@route': path.resolve(__dirname, './src/route'),
					'@store': path.resolve(__dirname, './src/store'),
					'@mixins': path.resolve(__dirname, './src/mixins')
				} // 别名配置
			}
		});
	},

	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,

	// webpack-dev-server 相关配置
	devServer: {
		open: process.platform === 'darwin',
		host: '0.0.0.0', // 允许外部ip访问
		port: 8080, // 端口
		https: false, // 启用https
		overlay: {
			warnings: true,
			errors: true
		},
		// 错误、警告在页面弹出
		// proxy: {
			// // 本地
			// '/local': {
			// 	target: '',
			// 	changeOrigin: true, // 允许websockets跨域
			// 	// ws: true,
			// 	pathRewrite: {
			// 		'^/local': ''
			// 	}
			// },
			// // 线上
			// '/service': {
			// 	target: '',
			// 	changeOrigin: true, // 允许websockets跨域
			// 	// ws: true,
			// 	pathRewrite: {
			// 		'^/service': '/api'
			// 	}
			// },
			// // 本地开发时访问线上资源
			// '/upload': {
			// 	target: '',
			// 	changeOrigin: true, // 允许websockets跨域
			// 	// ws: true,
			// 	pathRewrite: {
			// 		'^/upload': '/upload'
			// 	}
			// }
		// } // 代理转发配置，用于调试环境
	},

	// 第三方插件配置
	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [path.resolve(__dirname, './src/assets/css/mixin.less')] // less全局变量配置
		}
	}
};
