import axios from '@utils/http';

// 账号密码登录
export function login(data) {
	return axios.post('/mock/list.json', data).then(res => {
		return Promise.resolve(res);
	});
}
// 获取验证码
export function captcha(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 验证密码
export function verifyPsd(data) {
	return axios.post('/mock/list.json', data).then(res => {
		return Promise.resolve(res);
	});
}
// 获取用户信息
export function getUserInfo() {
	return axios({
		url: `/mock/list.json`,
		method: 'get'
	});
}
