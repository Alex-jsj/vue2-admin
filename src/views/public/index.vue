<template>
	<div
		class="wrap"
		:class="{
			mobile: isMobile,
			pc: !isMobile,
			'collapse-wrap': vuex_siteSetting.menuCollapse,
			isFixed: vuex_siteSetting.menuFixed,
			'menuType-2': vuex_siteSetting.menuType === 2,
			'content-width-type-2': vuex_siteSetting.contentWidthType === 'Fixed'
		}"
	>
		<!-- 顶部信息条 -->
		<TopBar />
		<!-- 侧边菜单 -->
		<SideBar />
		<!-- 右-部分 -->
		<div class="right-wrap">
			<!-- 面包屑 -->
			<Crumb />
			<!-- 多标签 -->
			<TagsView />
			<!-- 页面容器 -->
			<transition name="fade-transform" mode="out-in">
				<keep-alive :max="10" :include="vuex_tagsView.cachedViews" v-if="!isDevelopment">
					<router-view class="views" :key="key" />
				</keep-alive>
				<router-view class="views" :key="key" v-else />
			</transition>
			<!-- 底部 -->
			<p class="footer">© CopyRight {{ year }}, 后台管理系统, Inc.All Rights Reserved.</p>
		</div>
		<!-- 固定右侧工具 -->
		<SiteSetting />
	</div>
</template>
<script>
import SideBar from '@components/sideBar'; //侧边导航
import TopBar from '@components/topbar'; //顶部信息
import Crumb from '@components/crumb'; //面包屑
import TagsView from '@components/tagsView'; //标签页
import SiteSetting from '@components/siteSetting'; //页面设置
import browserZoomPrompt from '@mixins/browserZoomPrompt'; // 浏览器缩放提示
import { mapState } from 'vuex';

export default {
	name: 'layout',
	data() {
		return {
			year: new Date().getFullYear(),
			isDevelopment: true
		};
	},
	created() {
		this.isDevelopment = process.env.NODE_ENV !== 'development' ? false : false;
	},
	mixins: [browserZoomPrompt],
	computed: {
		...mapState({
			vuex_siteSetting: 'siteSetting',
			vuex_tagsView: 'tagsView',
			isMobile: 'isMobile'
		}),
		key() {
			return this.$route.fullPath;
		}
	},
	components: {
		SideBar,
		TopBar,
		Crumb,
		TagsView,
		SiteSetting
	}
};
</script>

<style lang="less">
@import '~@assets/css/mixin.less';
// 组件页面切换效果
/*fade*/
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
	transition: all 0.3s;
}
.fade-transform-enter {
	opacity: 0;
	transform: translateX(-30px);
}
.fade-transform-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.wrap {
	width: 100%;
	min-height: 100vh;
	position: relative;
	overflow: hidden;
	padding-top: 60px;
	background: #fff;
	font-size: initial;
	&::after {
		.clear;
	}
	.right-wrap {
		width: 86%;
		float: right;
		padding: 0 0.55rem 0 0.55rem;
		position: relative;
		-webkit-transition: width 0.3s;
		transition: width 0.3s;
		.views {
			width: 100%;
			min-height: calc(~'100vh - 60px - 60px - 58px - 36px'); // less计算与calc编译有冲突，故写法修正为这样
			padding: 0.55rem 0 0 0;
			position: relative;
		}
		.footer {
			text-align: center;
			width: 100%;
			height: 60px;
			font-size: 12px;
			color: @grey;
		}
	}
	// 菜单收起
	&.collapse-wrap {
		.right-wrap {
			width: calc(~'100% - 56px');
		}
	}
	// 导航模式
	&.menuType-2 {
		.right-wrap {
			width: 100%;
			float: inherit;
			.views {
				min-height: calc(~'100vh - 60px - 60px - 58px - 36px - 61px');
			}
		}
	}
	// 菜单固定
	&.isFixed {
		.right-wrap {
			margin-top: 61px;
		}
	}
	// 内容布局
	&.content-width-type-2 {
		background: #f0f2f5;
		.right-wrap {
			width: 1230px;
			margin: 0.55rem auto;
			float: inherit;
			background: #fff;
			.views {
				min-height: calc(~'100vh - 60px - 60px - 58px - 36px - 61px - 0.55rem - 0.55rem');
			}
		}
		&.isFixed {
			.right-wrap {
				margin-top: calc(~'61px + 0.55rem');
			}
		}
	}
	&.pc {
		.right-wrap {
			.footer {
				line-height: 60px;
				white-space: nowrap;
			}
		}
	}
	// 移动端
	&.mobile {
		.right-wrap {
			width: 100%;
			float: inherit;
			.views {
				min-height: calc(~'100vh - 60px - 40px - 60px - 36px');
			}
			.footer {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
