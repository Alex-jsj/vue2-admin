import axios from '@utils/http';

// 获取数据
export function getData(data) {
	return axios.get(`/mock/list.json`, { params: data }).then(res => {
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
