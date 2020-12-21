<template>
	<div
		id="topBar"
		:class="{'content-width-type-1':vuex_siteSetting.contentWidthType === 'Flow' , 'content-width-type-2':vuex_siteSetting.contentWidthType === 'Fixed' , 'menuType-2':vuex_siteSetting.menuType === 2 }"
	>
		<div class="content-width-box" :class="isMobile?'mobile':'pc'">
			<!-- 左侧文字信息 -->
			<logo class="float-left" />
			<!-- 移动端用菜单 -->
			<i class="iconfont" :class="mobileMenuSwitch?'icon-menuon':'icon-menuoff'" @click="menuSwitch"></i>
			<!-- 右侧用户信息 -->
			<userBoard class="float-right" />
		</div>
	</div>
</template>
<script>
import userBoard from "./userBoard";
import logo from "./logo";
import { mapState, mapMutations } from "vuex";

export default {
	name: "topBar",
	components: {
		userBoard,
		logo
	},
	computed: {
		...mapState({
			vuex_siteSetting: "siteSetting",
			isMobile: "isMobile",
			mobileMenuSwitch: "mobileMenuSwitch"
		})
	},
	methods: {
		...mapMutations(["SET_MENU_SWITCH"]),
		// 菜单开关
		menuSwitch: function() {
			this.SET_MENU_SWITCH(this.mobileMenuSwitch ? false : true);
			this.vuex_siteSetting.menuCollapse = false;
		}
	}
};
</script>

<style lang="less">
@import "~@assets/css/mixin.less";
#topBar {
	width: 100%;
	height: 60px;
	background: #292c31;
	z-index: 100;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1500;
	.content-width-box {
		width: 100%;
		height: 100%;
		padding: 0 20px;
		.icon-menuoff {
			display: none;
		}
		&.mobile {
			padding: 0 0.55rem;
			#logo {
				.logo-text {
					display: none;
				}
			}
			.icon-menuoff,
			.icon-menuon {
				color: #fff;
				display: block;
				float: left;
				line-height: 60px;
				font-size: 1.5rem;
				margin-left: 10px;
			}
			#userBoard {
				.roles {
					display: none;
				}
			}
		}
	}
	&.content-width-type-1.menuType-2 {
		.content-width-box {
			position: relative;
		}
	}
	&.content-width-type-2.menuType-2 {
		.content-width-box {
			width: 1230px;
			height: 100%;
			margin: 0 auto;
			position: relative;
			padding: 0;
		}
	}
}
</style>
