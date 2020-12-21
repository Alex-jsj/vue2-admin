<template>
	<div id="crumb" :class="{ mobile: isMobile }" data-step="3" :data-intro="$t('introductorPage.step3')">
		<el-breadcrumb class="app-breadcrumb float-left" separator="/">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="item in crumbList" :key="item.title">
					<router-link :to="item.path">{{ $t('route.' + item.title) }}</router-link>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'crumb',
	data() {
		return {
			crumbList: []
		};
	},
	watch: {
		$route() {
			this.getBreadcrumb();
		}
	},
	created() {
		this.getBreadcrumb();
	},
	computed: {
		...mapState(['isMobile', 'login'])
	},
	methods: {
		// 获取路由
		getBreadcrumb() {
			let currentTitle = this.$route.meta.title;
			this.crumbList = this.recursionMenu(currentTitle, this.login.menu);
		},
		/* 递归匹配菜单路径 */
		recursionMenu: function(recursionField = '', menu = []) {
			let menuTree = {
				title: 'home',
				icon: 'gongzuotai',
				url: '/views/index',
				children: menu
			};
			let _menu = []; // 路径数组
			let findIt = false; // 是否匹配到
			let getPath = function(tree) {
				_menu.push({
					title: tree.title,
					path: tree.url
				});
				if (tree.title === recursionField) {
					findIt = true;
					return;
				}
				if (tree.children && tree.children.length > 0) {
					for (let i = 0; i < tree.children.length; i++) {
						getPath(tree.children[i]);
						if (findIt) return;
					}
					_menu.pop();
				} else if (!tree.children || tree.children.length === 0) {
					_menu.pop();
				}
			};
			getPath(menuTree);
			return _menu;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#crumb {
	width: 100%;
	height: 58px;
	background: #fff;
	overflow: hidden;
	&::before {
		content: '';
		display: block;
		width: 2px;
		height: 18px;
		background: @base;
		float: left;
		margin-top: 20px;
	}
	.app-breadcrumb {
		line-height: 58px;
		margin-left: 8px;
	}
	/*breadcrumb transition*/
	.breadcrumb-enter-active,
	.breadcrumb-leave-active {
		transition: all 0.5s;
	}

	.breadcrumb-enter,
	.breadcrumb-leave-active {
		opacity: 0;
		transform: translateX(20px);
	}

	.breadcrumb-move {
		transition: all 0.5s;
	}

	.breadcrumb-leave-active {
		position: absolute;
	}
	&.mobile {
		padding: 10px 0;
		height: auto;
		&::before {
			display: none;
		}
		.app-breadcrumb {
			line-height: 20px;
			margin-left: 0;
		}
	}
}
</style>
