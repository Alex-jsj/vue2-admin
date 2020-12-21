/* 我的账户 */
import axios from '@utils/http';

// 修改密码
export function change(data) {
	return axios.put('/mock/list.json', data).then(res => {
		return Promise.resolve(res);
	});
}
