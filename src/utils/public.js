import md5 from 'js-md5';
/**
 * 获取url中的某个参数
 * @param {String} url
 * @param {String} field
 */
export const getUrlQuery = (url = '', field = '') => {
	let query, the_field;

	if (url.indexOf('?') === -1) {
		return;
	}
	query = url.split('?')[1];
	if (query.indexOf('=') === -1) {
		return;
	}
	if (query.indexOf('#/') !== -1) {
		query = query.replace('#/', '');
	} // 移除hash模式下vue地址中的 #/
	// 如果不止一个参数
	if (query.indexOf('&') > -1) {
		query.split('&').map(item => {
			if (item.indexOf('=') === -1) {
				return;
			}
			if (item.split('=')[0] !== field) {
				return;
			}
		});
	} else {
		// 只有一个参数
		if (query.split('=')[0] !== field) {
			return;
		}
		the_field = query.split('=')[1];
	}
	return the_field;
};

/**
 * 生成uuid
 *
 */
export function uuid() {
	let s = [],
		hexDigits = '0123456789abcdef';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = '-';
	let my_uuid = s.join('');
	return my_uuid;
}

/**
 * 圆环canvas
 * @param {*} drawing_elem
 * @param {*} percent
 * @param {*} forecolor
 * @param {*} bgcolor
 */
export function circle_canvas(drawing_elem, percent, forecolor, bgcolor) {
	// @drawing_elem: 绘制对象
	// @percent：绘制圆环百分比, 范围[0, 100]
	// @forecolor: 绘制圆环的前景色，颜色代码
	// @bgcolor: 绘制圆环的背景色，颜色代码
	let context = drawing_elem.getContext('2d'),
		center_x = drawing_elem.width / 2,
		center_y = drawing_elem.height / 2,
		rad = (Math.PI * 2) / 100,
		speed = 0;
	// drawing_elem.style.width = drawing_elem.parentNode.clientHeight + 'px';
	// drawing_elem.style.height = drawing_elem.parentNode.clientHeight + 'px';
	// drawing_elem.setAttribute('width', drawing_elem.parentNode.clientHeight * 2);
	// drawing_elem.setAttribute('height', drawing_elem.parentNode.clientHeight * 2);
	// 绘制背景圆圈

	function backgroundCircle() {
		context.save();
		context.beginPath();
		context.lineWidth = 8; //设置线宽
		let radius = center_x - context.lineWidth;

		context.lineCap = 'round';
		context.strokeStyle = bgcolor;
		context.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
		context.stroke();
		context.closePath();
		context.restore();
	}

	//绘制运动圆环
	function foregroundCircle(n) {
		context.save();
		context.strokeStyle = forecolor;
		context.lineWidth = 8;
		context.lineCap = 'round';
		let radius = center_x - context.lineWidth;

		context.beginPath();
		context.arc(center_x, center_y, radius, -Math.PI / 2, -Math.PI / 2 + n * rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
		context.stroke();
		context.closePath();
		context.restore();
	}

	//执行动画
	(function drawFrame() {
		window.requestAnimationFrame(drawFrame);
		context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
		backgroundCircle();
		foregroundCircle(speed);
		if (speed >= percent) {
			return;
		}
		speed += 2;
	})();
}

/**
 * 计算百分比
 * @param {*} data
 * @param {*} total
 */
export function component_percent(data, total) {
	// data 当前数值
	// total 总数值
	let percent = null;

	if (data > 0 && total > 0) {
		percent = ((data / total) * 100).toFixed(0);
	} else {
		percent = 0;
	}
	return percent;
}

//使用递归的方式实现对象的深拷贝
export function deepClone(obj) {
	//判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
	let objClone = Array.isArray(obj) ? [] : {};
	//进行深拷贝的不能为空，并且是对象或者是
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] && typeof obj[key] === 'object') {
					objClone[key] = deepClone(obj[key]);
				} else {
					objClone[key] = obj[key];
				}
			}
		}
	}
	return objClone;
}

/**
 * 判断是否有值，(undefined null '') 判断为true，其他为false
 * @param {*} value
 */
export function isEmpty(value) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'object':
			if (value === null) {
				return true;
			}
			return false;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0) {
				return true;
			}
			return false;
		case 'number':
			return false;
		default:
			return false;
	}
}

/**
 * 下载文件
 * @param {String} fileUrl
 * @param {String} target
 */
export function downloadFile(fileUrl = '', target = '_blank') {
	// 创建隐藏的可下载链接
	let eleLink = document.createElement('a');
	eleLink.download = '';
	eleLink.target = target;
	eleLink.style.display = 'none';
	eleLink.href = fileUrl;
	// 触发点击
	document.body.appendChild(eleLink);
	eleLink.click();
	// 然后移除
	document.body.removeChild(eleLink);
}

/**
 * 下载文件
 * @param {String} fileUrl
 * @param {String} target
 */
export function downloadBinaryFile(data, fileName = '') {
	if (typeof window.navigator.msSaveBlob !== 'undefined') {
		window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls');
	} else {
		let url = window.URL.createObjectURL(new Blob([data]));
		let link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.setAttribute('download', fileName + '.xls');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link); //下载完成移除元素
		window.URL.revokeObjectURL(url); //释放掉blob对象
	}
}

/**
 * 密码加密
 * @param {*} username
 * @param {*} password
 */
export function md5Psd(username, password) {
	let my_md5 = '';
	let user = JSON.parse(JSON.stringify(username)).substr(1); // 用户名去掉第一位
	my_md5 = md5(user + password);
	return my_md5;
}

/**
 * 转string
 * @param {Object} fieldList
 * @param {Array} fieldList
 */
export function stringifyField(obj = {}, fieldList = []) {
	let _obj = JSON.parse(JSON.stringify(obj));
	fieldList.map(item => {
		if (_obj.hasOwnProperty(item)) {
			_obj[item] = JSON.stringify(_obj[item]);
		}
	});
	return _obj;
}

/**
 * 解析string
 * @param {Object} fieldList
 * @param {Array} fieldList
 */
export function parseField(obj = {}, fieldList = []) {
	let _obj = JSON.parse(JSON.stringify(obj));
	fieldList.map(item => {
		if (_obj.hasOwnProperty(item)) {
			_obj[item] = JSON.parse(_obj[item]);
		}
	});
	return _obj;
}

/**
 * 将对象中的某些字符串数组转为对象数组
 * @param {Array} list
 * @param {Array} fieldList
 * @param {String} field
 */
export function checkboxAddID(obj = {}, fieldList = [], field = 'id') {
	let _obj = JSON.parse(JSON.stringify(obj));
	fieldList.map(item => {
		if (_obj.hasOwnProperty(item) && Array.isArray(_obj[item])) {
			let arr = [];
			_obj[item].map(_item => {
				arr.push({
					[field]: _item
				});
			});
			_obj[item] = arr;
		}
	});
	return _obj;
}

/**
 * 将包含对象的数组转换成包含string的数组
 * @param {Array} list
 * @param {Array} fieldList
 * @param {String} field
 */
export function IDToArray(obj = {}, fieldList = [], field = 'id') {
	let _obj = JSON.parse(JSON.stringify(obj));
	fieldList.map(item => {
		if (_obj.hasOwnProperty(item) && Array.isArray(_obj[item])) {
			let arr = [];
			_obj[item].map(_item => {
				if (_item) arr.push(_item[field]);
			});
			_obj[item] = arr;
		}
	});
	return _obj;
}

/**
 * 格式化size大小
 * @param {Number} val
 */
export function formatSize(val = 0) {
	let _val = JSON.parse(JSON.stringify(val));
	if (_val === 0 || _val === '') {
		return '0 Bytes';
	}
	let unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
	let index = 0,
		srcsize = parseFloat(_val);
	index = Math.floor(Math.log(srcsize) / Math.log(1024));
	let size = srcsize / Math.pow(1024, index);
	//  保留的小数位数
	size = size.toFixed(2);
	return {
		_size: size,
		_unit: unitArr[index]
	};
}
