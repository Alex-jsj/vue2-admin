import { getUserInfo } from '@api/login'; // 获取用户信息
import superMenu from '@/route/menu/super'; // 超级管理员菜单
import normalMenu from '@/route/menu/normal'; // 普通用户菜单

export default {
	// 获取用户信息
	vuex_getUserInfo({ commit }) {
		return new Promise((resolve, reject) => {
			// getUserInfo()
			// 	.then(res => {
			// 		if (res.code !== 200) {
			// 			reject(res);
			// 			return;
			// 		}
			// 		const respon = res.result || {};
			// 		const { birthday, email, phone, sex, avatar, realname: nickName, username: account, unread } = respon.userInfo;
			commit('SET_ROLE', '超级管理员'); // 存储用户角色
			// 根绝用户角色组分配不同的菜单
			commit('SET_ROLE', '超级管理员'); // 存储用户角色
			commit('SET_MENU', superMenu); // 存储用户菜单
			commit('SET_AVATAR', ''); // nickName
			commit('SET_NICK_NAME', '测试昵称'); // nickName
			commit('SET_ACCOUNT', '测试账号'); // account
			commit('SET_UNREAD', 3); // 未读消息
			resolve({});
			// })
			// .catch(error => {
			// 	reject(error);
			// });
		});
	}
};
