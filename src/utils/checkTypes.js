const red = '#f56c6c';
const blue = 'teal';
const green = '#67c23a';
const grey = '#d9d9d9';
const yellow = '#e6a23c';

// 男 女
export function checkSex(val = '') {
	let text = '';
	switch (val) {
		case 1:
			text = '男';
			break;
		case 2:
			text = '女';
			break;
		default:
			text = '其他';
	}
	return { text };
}
// 事件
export function checkEvent(val = '') {
	let text = '';
	let type = '';
	switch (val) {
		case 'create':
			text = '新建';
			type = 'success';
			break;
		case 'update':
			text = '更新';
			type = 'primary';
			break;
		case 'delete':
			text = '删除';
			type = 'danger';
			break;
		case 'query':
			text = '查询';
			type = 'query';
			break;
		default:
			text = '其他';
			type = 'info';
	}
	return { text, type };
}
/**
 * 审核状态
 * @param {Number,String} val
 */
export function checkReviewStatus(val = '') {
	let type = '';
	let text = '';
	let color = '';
	switch (val) {
		case 1:
			text = '已通过';
			color = green;
			type = 'success';
			break;
		case -1:
			text = '已驳回';
			color = red;
			type = 'danger';
			break;
		case 0:
			text = '待审核';
			color = blue;
			type = 'primary';
			break;
		default:
			text = '待审核';
			color = blue;
			type = 'primary';
	}
	return { type, text, color };
}
/**
 * 话题状态
 * @param {Number,String} val
 */
export function checkTopicStatus(val = '') {
	let type = '';
	let text = '';
	let color = '';
	switch (val) {
		case 1:
			text = '推荐';
			color = green;
			type = 'success';
			break;
		case -1:
			text = '已屏蔽';
			color = red;
			type = 'danger';
			break;
		case 0:
			text = '正常';
			color = blue;
			type = 'primary';
			break;
		default:
			text = '正常';
			color = blue;
			type = 'primary';
	}
	return { type, text, color };
}
/**
 * 定稿状态
 * @param {Number,String} val
 */
export function checkDraftStatus(val = '') {
	let type = '';
	let text = '';
	let color = '';
	switch (val) {
		case true:
			text = '已定稿';
			color = green;
			type = 'success';
			break;
		case false:
			text = '未定稿';
			color = blue;
			type = 'warning';
			break;
		default:
			text = '未定稿';
			color = blue;
			type = 'warning';
	}
	return { type, text, color };
}
/**
 * 账号状态
 * @param {Number,String} val
 */
export function checkState(val = '') {
	let text = '';
	let color = '';
	switch (val) {
		case 1:
			text = '正常';
			color = green;
			break;
		case 2:
			text = '冻结';
			color = yellow;
			break;
		default:
			text = '未知状态';
			color = grey;
	}
	return { text, color };
}

/**
 * 登录状态
 * @param {Number,String} val
 */
export function checkSuccess(val = '') {
	let type = '';
	let text = '';
	switch (val) {
		case 1:
			text = '正常登录';
			type = 'success';
			break;
		case -1:
			text = '登录失败';
			type = 'warning';
			break;
		default:
			text = '未知状态';
			type = 'info';
	}
	return { text, type };
}
