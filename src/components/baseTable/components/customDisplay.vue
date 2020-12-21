<template>
    <div id="customDisplay">
        <el-button type size="mini" icon="el-icon-setting" @click="customDisplayShow = !customDisplayShow">{{$t('table.custom')}}</el-button>
        <div class="custom-display-dialog" v-if="customDisplayShow">
            <ul class="custom-display-dialog-list">
                <li class="item title">当前展示的信息</li>
                <li class="item">
                    <el-checkbox v-model="checkedAll" @change="selectAll">全选</el-checkbox>
                </li>
                <li class="item" v-for="(item,index) in list" :key="index">
                    <el-checkbox v-model="item.customShow" @change="select">{{item.label}}</el-checkbox>
                </li>
            </ul>
            <!-- model -->
            <div class="model" @click="customDisplayShow = false"></div>
        </div>
    </div>
</template>

<script>
export default {
	// 自定义选择组件
	name: 'customDisplay',
	data() {
		return {
			customDisplayShow: false,
			checkedAll: true,
			list: []
		};
	},
	props: ['customDisplayList'],
	created: function() {
		this.customDisplayList && (this.list = this.customDisplayList);
	},
	methods: {
		// 全选
		selectAll: function() {
			this.list.map(item => {
				item.customShow = this.checkedAll;
			});
			this.$emit('update_custom_display', this.list);
		},
		// 单选
		select: function() {
			let my_list = this.list;
			for (let i = 0; i < my_list.length; i++) {
				if (!my_list[i].customShow) {
					this.checkedAll = false;
					break;
				} else {
					this.checkedAll = true;
				}
			}
			this.$emit('update_custom_display', this.list);
		}
	}
};
</script>
<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#customDisplay {
	margin-right: 10px;
	.custom-display-dialog {
		position: relative;
		top: 10px;
		z-index: 2200;
		.custom-display-dialog-list {
			position: absolute;
			z-index: 998;
			padding: 10px 20px;
			background: #fff;
			border: 1px solid #ccc;
			border-radius: 4px;
			box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
			.item {
				margin: 2px 0;
				.el-checkbox {
					display: block;
				}
			}
			.title {
				font-size: 16px;
				white-space: nowrap;
				margin-bottom: 10px;
				color: #888;
				padding-right: 5px;
			}
		}
		.model {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 997;
		}
	}
}
</style>
