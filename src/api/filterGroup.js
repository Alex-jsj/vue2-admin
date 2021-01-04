import axios from '@utils/http';

export function getCategories(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function getDynasty(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function getOverView(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
export function getPermission(data) {
	return axios.get('/mock/list.json', { params: data }).then(res => {
		return Promise.resolve(res);
	});
}
