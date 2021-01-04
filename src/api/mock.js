import axios from '@utils/http';

// 获取列表
export function getData(data) {
	return axios.get(`/mock/list.json`, { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 获取详情
export function getDetail(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 新增
export function addItem(data) {
	return axios.post('/mock/list.json', data).then(res => {
		return Promise.resolve(res);
	});
}
// 编辑
export function editItem(data) {
	return axios.put('/mock/list.json', data).then(res => {
		return Promise.resolve(res);
	});
}
// 删除
export function deleteItem(data) {
	return axios.delete('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 批量删除
export function batchDeleteItems(data) {
	return axios.delete(`/mock/list.json`, { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function getTrend(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function uploadFile(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function getOverView(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
