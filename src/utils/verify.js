// 用户名验证
export function checkUserName(rule, value, callback) {
	const reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.

	if (!value) {
		return callback(new Error('用户名不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('用户名必须为5~20位，英文/数字/下划线/@/.'));
	} else {
		callback();
	}
}
// 密码验证
export function checkPsd(rule, value, callback) {
	let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位英文数字/字母/下划线/@/.
	if (!value) {
		callback(new Error('密码不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('密码必须为5-20位英文/数字/下划线/@/.'));
	} else {
		callback();
	}
}
// 数字验证
export function checkNum(rule, value, callback) {
	let reg = /^[0-9]*$/;
	if (!value) {
		return callback(new Error('不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('格式必须为数字'));
	} else {
		callback();
	}
}
// 正整数
export function checkPositiveInteger(rule, value, callback) {
	let reg = /^[+]{0,1}(\d+)$/;
	if (!value) {
		return callback(new Error('不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('格式必须为正整数，可为0'));
	} else {
		callback();
	}
}
// 英文数字验证
export function checkEnNum(rule, value, callback) {
	let reg = /^[0-9a-zA-Z]*$/;
	if (!value) {
		return callback(new Error('不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('格式必须为英文或数字组合'));
	} else {
		callback();
	}
}
// 邮箱验证（非必填）
export function checkEmail(rule, value, callback) {
	let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

	if (!value) {
		callback();
	} else if (reg.test(value) === false) {
		callback(new Error('邮箱格式错误'));
	} else {
		callback();
	}
}
// 金钱验证
export function checkPrice(rule, value, callback) {
	// let reg = /^[0-9]*$/;
	let reg = /^\d*\.{0,1}\d{0,2}$/; //数字 小数点不出现或只能出现一次

	if (!value) {
		return callback(new Error('不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('格式必须为数字，只能有一个小数点，小数点后面不能超过2位'));
	} else {
		callback();
	}
}
// 英文验证
export function checkEnglish(rule, value, callback) {
	let reg = /^[A-Za-z ]+$/;

	if (!value) {
		return callback(new Error('不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('格式不正确'));
	} else {
		callback();
	}
}
// 身份证验证
export function checkIDCard(rule, value, callback) {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

	if (!value) {
		return callback(new Error('身份证号码不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('身份证格式错误'));
	} else {
		callback();
	}
}
// 手机号验证
export function checkPhone(rule, value, callback) {
	const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

	if (!value) {
		return callback(new Error('手机号不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('手机号格式错误'));
	} else {
		callback();
	}
}
/**
	    1.可以是中文
	    2.可以是英文，允许输入点（英文名字中的那种点）， 允许输入空格
        3.中文和英文不能同时出现
        4.长度在20个字符以内
	*/
// 姓名验证
export function checkName(rule, value, callback) {
	const reg = /(^(?:[\u4e00-\u9fa5·]{2,20})$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/;
	if (!value) {
		return callback(new Error('姓名不能为空'));
	} else if (reg.test(value) === false) {
		callback(new Error('姓名格式错误'));
	} else {
		callback();
	}
}
