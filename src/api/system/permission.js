import axios from '@utils/http';

// 获取权限树
export function getData(data) {
	return axios.get(`/mock/list.json`, { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 新增
export function addItem(data) {
	return axios.post(`/mock/list.json`, data).then(res => {
		return Promise.resolve(res);
	});
}
// 编辑
export function editItem(data) {
	return axios.post(`/mock/list.json`, data).then(res => {
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
// 获取权限树
export function getAllData(data) {
	return axios.get(`/mock/list.json`, { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 查询角色授权
export function getRolePermission(data) {
	return axios.get(`/mock/list.json`, { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
// 保存角色授权
export function saveRolePermission(data) {
	return axios.post(`/mock/list.json`, data).then(res => {
		return Promise.resolve(res);
	});
}
