<template>
	<div id="siteSetting" :class="{ 'open-tools': isOpen, mobile: isMobile }">
		<!-- 遮罩层 -->
		<div class="shadow-box" @click="isOpen = false"></div>
		<div class="tools-container">
			<div class="btn-container" data-step="5" :data-intro="$t('introductorPage.step5')">
				<div class="switch-btn the-btn" @click="isOpen = !isOpen">
					<i class="iconfont" :class="isOpen ? 'icon-close-bg' : 'icon-setting'"></i>
					<span>{{ isOpen ? $t('fixedTool.btns.close') : $t('fixedTool.btns.open') }}</span>
				</div>
				<div class="feedback-btn the-btn">
					<i class="el-icon-edit"></i>
					<span>{{ $t('fixedTool.btns.feedback') }}</span>
				</div>
				<div class="backTop-btn the-btn" @click="backToTop">
					<i class="iconfont icon-top"></i>
					<span>{{ $t('fixedTool.btns.top') }}</span>
				</div>
				<div class="goBottom-btn the-btn" @click="goToBottom">
					<i class="iconfont icon-bottom"></i>
					<span>{{ $t('fixedTool.btns.bottom') }}</span>
				</div>
			</div>
			<vue-scroll :ops="ops">
				<ul class="tools-list">
					<!-- 整体风格设置 -->
					<li class="item">
						<p class="title">{{ $t('fixedTool.theme') }}</p>
						<el-tooltip effect="dark" :content="$t('fixedTool.themeConfig.content1')" placement="top">
							<div class="theme-img" @click="themeChange('light')">
								<img src="../../../public/img/light.jpg" />
								<i class="iconfont icon-yep" v-if="theme === 'light'"></i>
							</div>
						</el-tooltip>
						<el-tooltip effect="dark" :content="$t('fixedTool.themeConfig.content2')" placement="top">
							<div class="theme-img" @click="themeChange('dark')">
								<img src="../../../public/img/dark.jpg" />
								<i class="iconfont icon-yep" v-if="theme === 'dark'"></i>
							</div>
						</el-tooltip>
						<br />
						<br />
						<div class="inline-item item-collapse">
							<span class="title-2 float-left" :class="{ 'title-grey': menuType == 2 }">主题色</span>
							<themePicker class="float-right" />
						</div>
					</li>
					<!-- 导航模式 -->
					<li class="item" v-if="!isMobile">
						<p class="title">{{ $t('fixedTool.navigation') }}</p>
						<el-tooltip effect="dark" :content="$t('fixedTool.navigationConfig.content1')" placement="top">
							<div class="theme-img" @click="menuChange(1)">
								<img src="../../../public/img/menu1.jpg" />
								<i class="iconfont icon-yep" v-if="menuType === 1"></i>
							</div>
						</el-tooltip>
						<el-tooltip effect="dark" :content="$t('fixedTool.navigationConfig.content2')" placement="top">
							<div class="theme-img" @click="menuChange(2)">
								<img src="../../../public/img/menu2.jpg" />
								<i class="iconfont icon-yep" v-if="menuType === 2"></i>
							</div>
						</el-tooltip>
						<br />
						<br />
						<el-tooltip effect="dark" :disabled="menuType == 1" :content="$t('fixedTool.navigationConfig.config1')" placement="left">
							<div class="inline-item item-collapse">
								<span class="title-2 float-left" :class="{ 'title-grey': menuType == 2 }">{{ $t('fixedTool.navigationConfig.retract') }}</span>
								<el-switch
									v-model="isCollapse"
									:disabled="menuType == 2"
									class="float-right"
									:width="30"
									@change="setMenuCollapse()"
								></el-switch>
							</div>
						</el-tooltip>
						<el-tooltip effect="dark" :disabled="menuType == 2" :content="$t('fixedTool.navigationConfig.config2')" placement="left">
							<div class="inline-item">
								<span class="title-2 float-left" :class="{ 'title-grey': menuType == 1 }">{{ $t('fixedTool.navigationConfig.fixed') }}</span>
								<el-switch v-model="menuFixed" :disabled="menuType == 1" class="float-right" :width="30" @change="setMenuFixed()"></el-switch>
							</div>
						</el-tooltip>
						<div class="inline-item inline-item-select">
							<span class="title-2 float-left">{{ $t('fixedTool.contentWidth.text') }}</span>
							<el-select v-model="contentWidthType" class="select float-right" @change="contentWidthChange">
								<el-option v-for="item in contentWidthTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
							</el-select>
						</div>
					</li>
					<!-- 页面设置 -->
					<li class="item">
						<p class="title">{{ $t('fixedTool.pageSetup.text') }}</p>
						<!-- 网页全屏 -->
						<div class="inline-item" v-if="!isMobile">
							<span class="title-2 float-left">{{ $t('fixedTool.pageSetup.fullScreen') }}</span>
							<el-switch v-model="isFullScreen" class="float-right" :width="30" @change="setFullScreen()"></el-switch>
						</div>
						<!-- 语言切换 -->
						<div class="inline-item inline-item-select">
							<span class="title-2 float-left">{{ $t('fixedTool.pageSetup.switchLang') }}</span>
							<el-select v-model="language" class="select float-right" @change="checkLang">
								<el-option v-for="item in langList" :key="item.key" :label="item.value" :value="item.key"></el-option>
							</el-select>
						</div>
					</li>
					<!-- 其他设置 -->
					<li class="item">
						<p class="title">{{ $t('fixedTool.otherSettings.text') }}</p>
						<!-- 色弱模式 -->
						<div class="inline-item">
							<span class="title-2 float-left">{{ $t('fixedTool.otherSettings.colorWeakMode') }}</span>
							<el-switch v-model="colorWeekOpen" class="float-right" :width="30" @change="setMode('week')"></el-switch>
						</div>
						<!-- 灰度模式 -->
						<div class="inline-item">
							<span class="title-2 float-left">{{ $t('fixedTool.otherSettings.grayscaleMode') }}</span>
							<el-switch v-model="colorGrayscaleOpen" class="float-right" :width="30" @change="setMode('grayscale')"></el-switch>
						</div>
						<!-- 护眼模式 -->
						<p class="brightness-line"></p>
						<div class="inline-item">
							<span class="title-2 float-left">{{ $t('fixedTool.otherSettings.eyeProtectionMode') }}</span>
							<el-switch v-model="colorBrightnessOpen" class="float-right" :width="30" @change="setMode('brightness')"></el-switch>
						</div>
						<!-- 护眼模式强度 -->
						<div class="inline-item inline-item-select">
							<span class="title-2 float-left">{{ $t('fixedTool.otherSettings.strengthSelection') }}</span>
							<el-select
								v-model="brightnessIntensity"
								:disabled="!colorBrightnessOpen"
								class="select float-right"
								@change="brightnessIntensityChange"
							>
								<el-option v-for="item in brightnessIntensityList" :key="item.key" :label="item.value" :value="item.key"></el-option>
							</el-select>
						</div>
						<!-- 自动护眼模式 -->
						<el-tooltip v-if="!isMobile" effect="dark" :content="$t('fixedTool.otherSettings.tip')" placement="left">
							<div class="inline-item">
								<span class="title-2 float-left">{{ $t('fixedTool.otherSettings.automatic') }}</span>
								<el-switch v-model="autoBrightnessOpen" class="float-right" :width="30" @change="saveUserConfig()"></el-switch>
							</div>
						</el-tooltip>
					</li>
				</ul>
			</vue-scroll>
		</div>
	</div>
</template>

<script>
import themePicker from './themePicker';
import { mapState } from 'vuex';
export default {
	name: 'siteSetting',
	data() {
		return {
			ops: {
				vuescroll: {},
				scrollPanel: {
					scrollingX: false
				},
				rail: {},
				bar: {
					/** 当不做任何操作时滚动条自动消失的时间 */
					showDelay: 1500,
					/** 是否只在滚动的时候现实滚动条 */
					onlyShowBarOnScroll: true,
					/** 背景色*/
					background: '#c1c1c1',
					/**  透明度  */
					opacity: 0.5,
					/** 当你鼠标移动到滚动条的时候滚动条的样式， 返回一个style对象， 和现在的对象融合*/
					hoverStyle: false,
					/** 是否保持rail显示即使内容高度不足的情况下。 */
					keepShow: false
				}
			},
			langList: [{ key: 'zh', value: '中文' }, { key: 'en', value: 'English' }],
			// 默认配置
			isOpen: false,
			theme: 'light', // 主题 亮色、暗色
			isFullScreen: false, // 网页全屏
			isCollapse: false, // 导航是否折叠
			menuFixed: false, // 导航是否固定
			contentWidthType: 'Flow', // 内容区域宽度
			contentWidthTypeList: [
				{
					key: 'Flow',
					value: this.$t('fixedTool.select.flow')
				}
			],
			colorWeekOpen: false, //色弱模式
			colorGrayscaleOpen: false, //灰度模式
			colorBrightnessOpen: false, //夜间模式
			brightnessIntensity: this.$t('fixedTool.select.weak'),
			autoBrightnessOpen: false, //自动夜间模式
			menuType: 1, // 导航模式 侧边布局 顶部布局
			language: 'zh' // 导航模式 侧边布局 顶部布局
		};
	},
	watch: {
		listenMenuCollapse(newVal) {
			this.isCollapse = newVal;
			this.saveUserConfig();
		}
	},
	computed: {
		...mapState({
			vuex_siteSetting: 'siteSetting',
			vuex_login: 'login',
			isMobile: 'isMobile'
		}),
		listenMenuCollapse() {
			return this.vuex_siteSetting.menuCollapse;
		},
		// 内容宽度
		listenMenuType: {
			get: function() {
				return this.contentWidthType;
			},
			set: function(newValue) {
				if (newValue === 2) {
					this.contentWidthTypeList = [
						{
							key: 'Flow',
							value: this.$t('fixedTool.select.flow')
						},
						{
							key: 'Fixed',
							value: this.$t('fixedTool.select.fixed')
						}
					];
				} else {
					this.contentWidthTypeList = [
						{
							key: 'Flow',
							value: this.$t('fixedTool.select.flow')
						}
					];
				}
			}
		},
		// 护眼强度
		brightnessIntensityList() {
			return [
				{
					key: 'Weak',
					value: this.$t('fixedTool.select.weak')
				},
				{
					key: 'Medium',
					value: this.$t('fixedTool.select.medium')
				},
				{
					key: 'Strength',
					value: this.$t('fixedTool.select.strength')
				}
			];
		}
	},
	components: { themePicker },
	created() {
		this.getConfig(); // 获取本地设置
		this.autoBrightnessOpen = this.isMobile ? false : false; // 移动端在获取本地设置之后关闭自动护眼模式
		this.saveUserConfig(); // 再次存储配置
	},
	methods: {
		// 获取本地存储的配置并使之生效
		getConfig: function() {
			// account
			let config = JSON.parse(localStorage.getItem(`${this.vuex_login.account}_user_config`));
			// 如果本地存储有用户配置 则使用本地的配置
			if (config) {
				for (let key in config) {
					this[key] = config[key];
				}
				// 修改语言
				this.$i18n.locale = this.language;
				this.$store.commit('SET_LANGUAGE', this.language); // 存入vuex
				// 触发配置生效
				this.themeChange(this.theme);
				this.menuChange(this.menuType);
				this.setMenuCollapse();
				this.setMenuFixed();
				this.contentWidthChange();
				if (this.autoBrightnessOpen) {
					// 自动护眼模式开启
					this.auto_brightness(this.autoBrightnessOpen);
				} else {
					// auto关闭
					if (this.colorWeekOpen) {
						this.setMode('week');
					} else if (this.colorGrayscaleOpen) {
						this.setMode('grayscale');
					} else if (this.colorBrightnessOpen) {
						this.setMode('brightness');
					} else {
						this.setMode();
					}
				}
			} else {
				this.auto_brightness(this.autoBrightnessOpen);
			}
		},
		// 自动护眼模式
		auto_brightness: function(open) {
			this.autoBrightnessOpen = open;
			if (!this.autoBrightnessOpen) {
				return;
			}
			// 自动护眼模式
			let hour = new Date().getHours();
			// 21-24 1-6
			if (hour > 20 || hour < 7) {
				this.$notify({
					title: '温馨提示',
					type: 'success',
					dangerouslyUseHTMLString: true,
					message: `
					<p>夜已深，已自动为您打开护眼模式</p>
					<p style="color:#999;">(若不希望自动开启，可点击右侧设置按钮关闭)</p>`,
					duration: 7000
				});
				this.colorBrightnessOpen = true;
				this.setMode('brightness');
				this.saveUserConfig();
			}
		},
		// 护眼模式强度change
		brightnessIntensityChange: function(val) {
			if (val === 'Weak' || val === '弱') {
				document.getElementsByTagName('html')[0].className = 'color-brightness-1';
			} else if (val === 'Medium') {
				document.getElementsByTagName('html')[0].className = 'color-brightness-2';
			} else if (val === 'Strength') {
				document.getElementsByTagName('html')[0].className = 'color-brightness-3';
			}
			this.saveUserConfig();
		},
		// 网页全屏
		setFullScreen: function(val) {
			let docElm = document.documentElement; //W3C
			if (this.isFullScreen) {
				let el = document.documentElement;
				let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
				if (typeof rfs !== 'undefined' && rfs) {
					rfs.call(el);
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
		},
		// 改变主题
		themeChange: function(val) {
			this.theme = val;
			if (val === 'dark') {
				this.$store.commit('SET_THEME', true);
			} else {
				this.$store.commit('SET_THEME', false);
			}
			this.saveUserConfig();
		},
		// 改变导航模式
		menuChange: function(val) {
			if (this.isMobile) {
				this.menuType = 1;
			} else {
				this.menuType = val;
			}
			// 计算属性
			this.listenMenuType = val;
			if (this.menuType === 2) {
				this.menuFixed = true;
				this.$store.commit('SET_MENU_FIXED', true);
				this.$store.commit('SET_MENUTYPE', 2);
				this.$store.commit('SET_MENU_COLLAPSE', false);
			} else {
				this.$store.commit('SET_MENUTYPE', 1);
				this.contentWidthType = 'Flow';
				this.$store.commit('SET_CONTENTWIDTH', this.contentWidthType);
				this.menuFixed = false;
				this.$store.commit('SET_MENU_FIXED', false);
				document.body.style.background = '';
			}
			this.saveUserConfig();
		},
		// 改变导航伸缩
		setMenuCollapse: function() {
			this.$store.commit('SET_MENU_COLLAPSE', this.isCollapse);
			this.saveUserConfig();
		},
		// 改变导航固定方式
		setMenuFixed: function() {
			this.$store.commit('SET_MENU_FIXED', this.menuFixed);
			this.saveUserConfig();
		},
		// 内容布局
		contentWidthChange: function() {
			this.$store.commit('SET_CONTENTWIDTH', this.contentWidthType);
			this.saveUserConfig();
		},
		// 设置模式
		setMode: function(mode) {
			let the_mode = mode;
			if (the_mode === 'week' && this.colorWeekOpen === true) {
				this.colorGrayscaleOpen = false;
				this.colorBrightnessOpen = false;
				this.autoBrightnessOpen = false; // 开启色弱模式则关闭自动护眼功能
				document.getElementsByTagName('html')[0].className = 'color-week';
			} else if (the_mode === 'grayscale' && this.colorGrayscaleOpen === true) {
				this.colorWeekOpen = false;
				this.colorBrightnessOpen = false;
				document.getElementsByTagName('html')[0].className = 'color-grayscale';
			} else if (the_mode === 'brightness' && this.colorBrightnessOpen === true) {
				this.colorWeekOpen = false;
				this.colorGrayscaleOpen = false;
				this.brightnessIntensityChange(this.brightnessIntensity);
			} else {
				this.colorWeekOpen = false;
				this.colorGrayscaleOpen = false;
				this.colorBrightnessOpen = false;
				document.getElementsByTagName('html')[0].className = '';
			}
			this.saveUserConfig();
		},
		// 语言切换
		checkLang: function(lang) {
			this.$i18n.locale = lang;
			this.$store.commit('SET_LANGUAGE', lang); // 存入vuex
			this.$message({
				message: lang === 'zh' ? '切换为中文' : 'Switch To English',
				type: 'success'
			});
			this.saveUserConfig();
		},
		// 保存用户设置在本地
		saveUserConfig: function() {
			// config
			let config = {
				theme: this.theme,
				isCollapse: this.isCollapse,
				menuFixed: this.menuFixed,
				contentWidthType: this.contentWidthType,
				colorWeekOpen: this.colorWeekOpen,
				colorGrayscaleOpen: this.colorGrayscaleOpen,
				colorBrightnessOpen: this.colorBrightnessOpen,
				autoBrightnessOpen: this.autoBrightnessOpen,
				brightnessIntensity: this.brightnessIntensity,
				menuType: this.menuType,
				language: this.language
			};
			// 根据账号存不同的配置
			localStorage.setItem(`${this.vuex_login.account}_user_config`, JSON.stringify(config));
		},
		// 回到顶部
		backToTop: function() {
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		},
		// 去到底部
		goToBottom: function() {
			document.body.scrollTop = document.body.clientHeight;
			document.documentElement.scrollTop = document.body.clientHeight;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#siteSetting {
	width: 100%;
	height: 0;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2000;
	.shadow-box {
		width: 0;
		height: 0;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color 0.3s;
	}
	.tools-container {
		width: 320px;
		position: absolute;
		right: -320px;
		top: 60px;
		height: calc(~'100vh - 60px');
		background: #fff;
		box-shadow: -2px 0 8px rgba(0, 0, 0, 0);
		.transi;
		.btn-container {
			width: 38px;
			position: absolute;
			right: 320px;
			bottom: 20%;
			.the-btn {
				position: relative;
				background: @base;
				width: 38px;
				height: 38px;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				pointer-events: auto;
				z-index: 0;
				text-align: center;
				font-size: 16px;
				border-radius: 4px 0 0 4px;
				text-align: center;
				padding: 5px;
				.transi;
				opacity: 0.8;
				margin-top: 1px;
				&:first-of-type {
					margin-top: 0;
				}
				&:hover {
					// background: lighten(#1890ff, 10%);
					.iconfont,
					.el-icon-edit {
						opacity: 0;
					}
					span {
						opacity: 1;
					}
				}
				&:active {
					background: darken(@base, 10%);
				}
				.iconfont,
				.el-icon-edit {
					line-height: 38px;
					color: #fff;
					font-size: 18px;
					text-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					opacity: 1;
					&.el-icon-edit {
						font-size: 20px;
					}
				}
				span {
					opacity: 0;
					color: #fff;
					font-size: 12px;
					line-height: 14px;
				}
			}
		}
		.tools-list {
			padding: 0 20px 20px 20px;
			.item {
				border-bottom: 1px solid #e8e8e8;
				padding-bottom: 25px;
				padding-top: 25px;
				&::after {
					.clear;
				}
				&:last-of-type {
					border-bottom: none;
				}
				.title {
					font-size: 14px;
					margin-bottom: 25px;
				}
				.theme-img {
					float: left;
					width: 48px;
					height: 42px;
					margin-right: 16px;
					margin-bottom: 3px;
					border-radius: 4px;
					box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
					overflow: hidden;
					cursor: pointer;
					position: relative;
					img {
						width: 100%;
						height: 100%;
						display: block;
					}
					.iconfont {
						position: absolute;
						top: 60%;
						left: 60%;
						transform: translate(-50%, -50%);
						color: @blue;
						font-size: 16px;
					}
				}
				.inline-item {
					width: 100%;
					height: 20px;
					margin-top: 15px;
					.title-2 {
						font-size: 12px;
						color: #666;
						line-height: 20px;
						&.title-grey {
							color: @grey;
						}
					}
					.el-switch {
						.el-switch__core {
							height: 15px;
							&::after {
								height: 11px;
								width: 11px;
							}
						}
						&.is-checked {
							.el-switch__core {
								&::after {
									margin-left: -12px;
								}
							}
						}
					}
					&.inline-item-select {
						height: 28px;
						.title-2 {
							line-height: 28px;
						}
						.select {
							width: 100px;
						}
					}
					&.item-collapse {
						margin-top: 30px;
					}
				}
				.brightness-line {
					width: 100%;
					height: 1px;
					background: #e8e8e8;
					margin-top: 15px;
				}
			}
		}
	}
	&.mobile {
		.tools-container {
			width: 16rem;
			right: -16rem;
			.btn-container {
				right: 16rem;
			}
		}
	}
	&.open-tools {
		height: 100vh;
		.shadow-box {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.1);
		}
		.tools-container {
			right: 0;
			box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
		}
	}
}
</style>
