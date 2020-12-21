import Vue from 'vue';

/**
 * 头像
 * @param {*} value
 */
Vue.filter('avatar', function(value) {
    if (value) {
        return value;
    }
    return require('../../public/img/avatar-1.png');
});

/**
 * 格式化身份证
 * @param {String || Number} value
 */
Vue.filter('formatIDcard', function(value = '') {
    if (value) {
        let card = JSON.parse(JSON.stringify(value));
        let newCard = card.replace(card.substring(4, 12), '********');
        return newCard;
    }
    return '暂无数据';
});

/**
 * 格式化性别
 * @param {String || Number} value
 */
Vue.filter('formatSex', function(value = '') {
    if (!value) {
        return '暂无数据';
    }
    let card = JSON.parse(JSON.stringify(Number(value)));
    return card === 1 ? '男' : '女';
});

/**
 * 格式化状态
 * @param {String || Number} value
 */
Vue.filter('formatType', function(value = '') {
    let type = Number(value);
    let the_value;
    switch (type) {
        case 1:
            the_value = '已通过';
            break;
        case 2:
            the_value = '已驳回';
            break;
        case 3:
            the_value = '已取消';
            break;
        case 0:
            the_value = '待审核';
            break;
        default:
            the_value = '';
    }
    return the_value;
});

/**
 * 格式化状态样式
 * @param {String || Number} value
 */
Vue.filter('formatTypeClass', function(value = '') {
    let type = Number(value);
    let the_value;
    switch (type) {
        case 1:
            the_value = 'success';
            break;
        case 2:
            the_value = 'danger';
            break;
        case 3:
            the_value = 'info';
            break;
        case 0:
            the_value = 'primary';
            break;
        default:
            the_value = '';
    }
    return the_value;
});
