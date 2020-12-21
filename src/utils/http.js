// 全局ajax统一处理

import axios from 'axios';
import store from '@store';

import { Message, MessageBox } from 'element-ui';

const token_field = store.state.token_field; // 全局token变量名

// 创建axios实例
const service = axios.create({
	withCredentials: true,
	baseURL: process.env.NODE_ENV === 'development' ? '/service' : '/api' // 前缀
	// timeout: 15000 // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
	config => {
		// 请求头部带上token
		const TOKEN = localStorage.getItem(token_field) || null;
		TOKEN && (config.headers['X-Access-Token'] = `${TOKEN}`);
		config.headers['Content-Type'] = 'application/json';
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);
// respone拦截器
service.interceptors.response.use(
	response => {
		const res = response.data || {};
		const status = res.code || 0;
		switch (status) {
			case 200:
				break;
			case 401:
				Message({
					message: '登录已失效，请重新登录!',
					duration: 2500,
					type: 'error'
				});
				sessionStorage.removeItem(token_field);
				break;
			default:
				if (res.hasOwnProperty('code')) {
					Message({
						message: res.message,
						duration: 2500,
						type: 'error'
					});
				}
		}
		return res;
	},
	error => {
		const err = error.response || null;
		const status = err.status || null;
		const errData = err.data || {};
		if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
			// 请求超时
			Message({
				message: '请求超时',
				duration: 2500,
				type: 'error'
			});
		}
		if (status === 403 || status === 400) {
			Message({
				message: `${err.data.message}`,
				duration: 2500,
				type: 'error'
			});
		} else if (status === 404) {
			Message({
				message: '接口配置错误',
				duration: 2500,
				type: 'error'
			});
		} else if (status === 402) {
			MessageBox.confirm(err.data.message, '提示', {
				confirmButtonText: '确定',
				showCancelButton: false,
				showClose: false,
				closeOnClickModal: false,
				closeOnPressEscape: false,
				type: 'warning'
			}).then(() => {});
		} else if (status === 500 && (errData.message === 'Token失效，请重新登录!' || errData.message === 'token非法无效!')) {
			// Message({
			// 	duration: 2500,
			// 	type: 'warning',
			// 	message: '登录已失效，即将回到登录页面!'
			// });
			localStorage.removeItem(token_field);
			// setTimeout(() => {
			// 	location.reload();
			// }, 2500);
		} else if (errData.message) {
			Message({
				duration: 2500,
				type: 'danger',
				message: `${errData.status} - ${errData.message}`
			});
		} else {
			Message({
				message: `服务器错误：${status} - ${err.statusText}!`,
				duration: 2500,
				type: 'error'
			});
		}
		return Promise.reject(err); // 返回接口返回的错误信息
	}
);

export default service;
