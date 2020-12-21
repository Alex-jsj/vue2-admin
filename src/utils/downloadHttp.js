// 全局ajax统一处理

import axios from 'axios';
import store from '@store';

import { Message, MessageBox } from 'element-ui';

const token_field = store.state.token_field; // 全局token变量名

// 创建axios实例
const service = axios.create({
    withCredentials: true,
    baseURL: process.env.NODE_ENV === 'development' ? '/service' : '/api', // 前缀
    timeout: 15000, // 请求超时时间
    responseType: 'blob'
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
        return res;
    },
    error => {
        if (
            error.code === 'ECONNABORTED' &&
            error.message.indexOf('timeout') !== -1
        ) {
            // 请求超时
            Message({
                message: '请求超时',
                duration: 2500,
                type: 'error'
            });
        }
        const err = error.response || null;
        const status = err.status || null;
        if (status === 401) {
            Message({
                message: '登录已失效，请重新登录!',
                duration: 2500,
                type: 'error'
            });
            sessionStorage.removeItem(token_field);
        } else if (status === 403 || status === 400) {
            Message({
                message: `${err.data.message}`,
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
        } else {
            Message({
                message: `服务器错误：${status} - ${err.statusText}`,
                duration: 2500,
                type: 'error'
            });
        }
        return Promise.reject(err); // 返回接口返回的错误信息
    }
);

export default service;
