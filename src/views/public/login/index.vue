<template>
	<div id="login" :class="isMobile ? 'mobile' : 'pc'">
		<!-- 背景特效 -->
		<bgCanvas />
		<!-- 登录框 -->
		<div class="login-container">
			<!-- 语言切换 -->
			<switchLang class="switch-language"></switchLang>
			<!-- 标题 -->
			<p class="login-title-1">{{ $t('login.title1') }}</p>
			<p class="login-title-2">{{ $t('login.title2') }}</p>
			<!-- 登录 -->
			<el-form :model="loginForm" class="login-box" ref="loginform" size="small" :rules="rules">
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" :placeholder="`${$t('login.user')}`">
						<i slot="prefix" class="iconfont icon-user"></i>
					</el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password" class="password">
					<el-input v-model="loginForm.password" :placeholder="`${$t('login.psd')}`" :type="show_pwd ? 'text' : 'password'">
						<i slot="prefix" class="iconfont icon-password"></i>
					</el-input>
					<i
						class="iconfont"
						:class="show_pwd ? 'icon-look' : 'icon-nolook'"
						:title="!show_pwd ? $t('login.showPsd') : $t('login.hiddenPsd')"
						@click="show_pwd = !show_pwd"
					></i>
				</el-form-item>
				<!-- 验证码 -->
				<el-form-item prop="captcha" class="captcha">
					<el-input v-model="loginForm.captcha" :placeholder="$t('login.captcha')" @keyup.native.enter="submit" class="captcha-input">
						<i slot="prefix" class="iconfont icon-captcha"></i>
					</el-input>
					<i class="el-icon-refresh" v-if="!captcha_loading" @click="updateCaptcha"></i>
					<i class="el-icon-loading" v-else></i>
					<img class="captcha-img" :src="captcha_img" @click="updateCaptcha" alt="验证码" />
				</el-form-item>
				<el-form-item class="auto-login">
					<el-checkbox v-model="loginForm.autoLogin" @change="handleAutoLogin">{{ $t('login.autoLogin') }}</el-checkbox>
					<span class="forget-psd" :class="{ 'forget-psd-open': explain_switch }" @click="explain_switch = !explain_switch">
						{{ $t('login.forgetPassword') }}
					</span>
				</el-form-item>
				<!-- submit -->
				<el-form-item>
					<el-button type="primary" @click="submit()" :loading="loading" size="small" class="login-btn">{{ $t('login.signIn') }}</el-button>
				</el-form-item>
			</el-form>
			<div class="login-explain" :class="{ 'explain-open': explain_switch }">
				<ul class="explain-info float-left">
					<li class="item">· {{ $t('login.contact') }}</li>
					<li class="item">· {{ $t('login.email') }}：329255122@qq.com</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/login';
/* 组件 */
import switchLang from '@components/switchLang';
import bgCanvas from './components/bgCanvas';
/* 方法 */
import { uuid, md5Psd } from '@utils/public';
import { mapState, mapMutations } from 'vuex';
import { log } from 'util';

export default {
	name: 'login',
	data() {
		return {
			loginForm: {
				autoLogin: true,
				captcha: ''
			},
			// 自动登录
			autoLogin: true,
			explain_switch: false,
			loading: false,
			captcha_loading: false,
			// 显示密码
			show_pwd: false,
			// 验证码
			captcha_img: '',
			captcha_key: ''
		};
	},
	components: {
		switchLang,
		bgCanvas
	},
	computed: {
		...mapState(['isMobile', 'token_field']),
		rules() {
			let userErr1 = this.$t('login.userErr1');
			let userErr2 = this.$t('login.userErr2');
			let psdErr1 = this.$t('login.psdErr1');
			let psdErr2 = this.$t('login.psdErr2');
			let captchaErr = this.$t('login.captchaErr');
			let captcha_err2 = this.$t('login.captcha_err2');
			return {
				username: [
					{
						required: true,
						validator: function(rule, value, callback) {
							let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
							if (!value) {
								callback(new Error(userErr1));
							} else if (!reg.test(value)) {
								callback(new Error(userErr2));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						validator: function(rule, value, callback) {
							let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
							if (!value) {
								callback(new Error(psdErr1));
							} else if (!reg.test(value)) {
								callback(new Error(psdErr2));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				captcha: [
					{
						required: true,
						validator: function(rule, value, callback) {
							let reg = /^-?\d+$/; // 数字
							if (!value) {
								callback(new Error(captchaErr));
							} else if (!reg.test(value)) {
								callback(new Error(captcha_err2));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				]
			};
		}
	},
	mounted: function() {
		this.updateCaptcha(); // 获取验证码
	},
	methods: {
		...mapMutations(['SET_AUTOLOGIN']),
		// 获取验证码
		updateCaptcha: async function() {
			this.captcha_key = '987a0aab-f170-403a-8185-5bcb304173bb';
			this.captcha_img =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAwCAIAAABSYzXUAAADKElEQVR42u2a30taYRjH/Z+8qC3OhY1d7arAMexi7KYkCySC0UWDEbEuV4MtKaWCwCGaFFJMokYXebBM0ElIRwOlJUbDmTv58+w5e0VLT5tHnedde768F+/7vHCo76fzPOd93lQCigKp0ALEgEIMiAGFGBADCjEgBhRiQAwoxIAYUIgBMaAQA2JAdQJDLpmMz8190WqPGMbHMDCBZe7igqrfpFAQpqaEwcHyUFY/8nlrIKDf2Hi0vNy1sPB4ZcW4ufn59LR5DCmWPdJoDtTqmuHXaL6zLD0YnM4qA2UxfOI4cF9tMtWP17u7xVJJNgae4+DPH0z39fQk7fZCKgUDJrAUgwzDRyKt/9yEaytPiEYFvV4cNGAAuxmL5e3+fiiZ5PP5xNXVx2AQIoQEzGVjCI+MEI8ut7dvxmFJ4uHRUcUx5HLC5KRo/fo6FRheut2XPF8TdIXDBMNTm00eBj4aJQaFBgbqd0M6Hdnl7055ncFgtYq+Q2GA8kBJbahXOpslGB4sLsrD8NVsJgbB5He7FouCGI6PhaEhYXhYiMXEJbUYYqkUwfBkdVUehpOxMWKQZCmG0k12T8bHlcIAr/7EhGi6y1WOUIvh1c4OwfDe65WHIdjXRwy6jsfrd69jMbIb7O9XCsPSkuj49LRQLFKN4YPXSxg8X1vLQuqUhaHynVrMZCS+0zOZ8pdrb68iGPx+0W5IR2dn1WDTGFSmgyZGI09+x7KEwQunEyqE7HPDYVcXMagkBRCCZPewu7vzGNJpAXIh2L21dStOG4Y3e3uEgcHlgjNdM8e3tmOoPwM2MiQfNT8vej0zU01HFCYleyhUeQ8kc5EySaldGDwe0WiDQTg/r92iCsMzm41gCCQSzfeUqC3RRqNotNstsUUVhodmM8GQq3ln78cH683e0R+HgrWh0kpqqcNK7fHt/8LARyLlZoZOR3Mzg9qkJOM7rbnW3jeaWnv3H8OtRrfDUW50OxzVRjfHIYa/m5TKpdjjkbz2gWCqTdc+iKHhS9DZ2aBW6/t1CQoTWLbxEhQx4L8E/Au1AYUYEAMKMSAGFGJADCjEgEIMiAFV0U/qKxysOIrI9QAAAABJRU5ErkJggg==';
			// this.captcha_loading = true;
			// const data = {
			// 	type: 4, //验证码类型 0 1 2 3 4
			// 	uuid: uuid() // 生成唯一标识符
			// };
			// try {
			// 	const res = await theApi.captcha(data);
			// 	const respon = res.result || {};
			// 	this.captcha_loading = false;
			// 	if (res.code !== 200) {
			// 		return;
			// 	}
			// 	this.captcha_key = data.uuid;
			// 	this.captcha_img = respon.base64 || '';
			// } catch (err) {
			// 	this.captcha_loading = false;
			// }
		},
		// 登录
		submit: function(isForce) {
			this.$refs['loginform'].validate(valid => {
				if (!valid) {
					return;
				}
				this.loading = true;
				let { username, password, captcha } = this.loginForm;
				// ajax
				let data = {
					username, //账号
					password: md5Psd(username, password), // 密码md5加密
					// password, // 密码md5加密
					uuid: this.captcha_key, //验证码 key
					captcha //验证码 value
					// force: isForce // 强制登录 1
				};
				this.loginSubmit(data);
			});
		},
		// 登录ajax
		loginSubmit: async function(data) {
			localStorage.setItem(
				this.token_field,
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ3ZWIiLCJpc3MiOiLono3lqpLkvZMiLCJleHAiOjE2MDgyMjcwMjQsImlhdCI6MTYwODE5MTAyNCwianRpIjoiYWY4MDRhYjMyZDljNDdmZmI0ZjNiN2VlMzBiMjY1ZGQiLCJ1c2VybmFtZSI6ImFkbWluIn0.VBMT3jv_ugelvwR3WddXs07bEx1sVxhuT4pdP3PMUa8'
			);
			this.$router.push({
				path: './views/index'
			});
			this.$message.success(this.$t('login.success'));
			// try {
			// 	const res = await theApi.login(data);
			// 	this.loading = false;
			// 	if (res.code !== 200) {
			// 		return;
			// 	}
			// 	const respon = res.result || {};
			// 	if (res.msg === 'AlreadyOnline') {
			// 		this.loginForce(); // 强制登录
			// 	} else {
			// 		// 保存登录标记
			// 		localStorage.setItem(this.token_field, respon.token || '');
			// 		// 跳转到首页
			// 		this.$router.push({
			// 			path: './views/index'
			// 		});
			// 		this.$message.success(this.$t('login.success'));
			// 	}
			// } catch (err) {
			// 	this.updateCaptcha(); // 登录失败刷新验证码
			// 	this.loading = false;
			// }
		},
		// 强制登录
		loginForce: function() {
			// 账号已登录，是否需要强制登录
			this.$confirm(this.$t('login.alreadyOnline'), this.$t('login.tips'), {
				confirmButtonText: this.$t('login.continue'),
				cancelButtonText: this.$t('login.cancel'),
				type: 'warning'
			})
				.then(() => {
					this.submit(1);
				})
				.catch(() => {
					this.$message.info(this.$t('login.cancelLogin'));
				});
		},
		// 自动登录
		handleAutoLogin: function(val) {
			this.SET_AUTOLOGIN(val);
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';

#login {
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background: url('../../../../public/img/login_background_2.jpg') no-repeat;
	background-size: cover;
	background-position: center;
	position: relative;
	.login-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		background: #fff;
		box-shadow: 0.13rem 0.13rem 0.63rem 0rem rgba(179, 179, 179, 0.25);
		border-radius: 0.2rem;
		overflow: hidden;
		padding: 0 1.13rem;
		padding-bottom: 3vh;
		.login-title-1 {
			font-size: 0.5rem;
			color: @grey_2;
			text-align: center;
			margin-top: 3.7vh;
			font-weight: 600;
		}
		.login-title-2 {
			width: 100%;
			height: 1.75rem;
			font-size: 20px;
			color: @grey_2;
			text-align: center;
			margin-top: 1vh;
			font-weight: 600;
			&::after {
				content: ' ';
				display: inline-block;
				width: 100%;
			}
		}
		// 登录框样式
		/deep/.login-box {
			width: 100%;
			margin-top: 2.22vh;
			.el-form-item__content {
				height: 32px;
			}
			.password {
				position: relative;
				.icon-look,
				.icon-nolook {
					color: @grey_2;
					position: absolute;
					top: 50%;
					right: 0.3rem;
					transform: translateY(-50%);
					font-size: 0.5rem;
					cursor: pointer;
					transition: all 0.3s;
				}
			}
			.captcha {
				.captcha-input {
					width: 250px;
				}
				.el-icon-refresh,
				.el-icon-loading {
					overflow: hidden;
					width: 24px;
					height: 100%;
					float: right;
					font-size: 24px;
					color: #c0c4cc;
					cursor: pointer;
					text-align: center;
					line-height: 36px;
					position: relative;
					&:hover {
						color: @blue;
					}
				}
				.captcha-img {
					display: block;
					width: 80px;
					height: 36px;
					float: right;
					cursor: pointer;
					border-radius: 4px;
					margin-right: 10px;
				}
			}
			.auto-login {
				.el-form-item__content {
					display: flex;
					justify-content: space-between;
					&::before,
					&::after {
						display: none;
					}
				}
			}
			.forget-psd {
				color: @grey;
				cursor: pointer;
				.transi;
				&:hover {
					color: darken(@grey, 30%);
				}
				&.forget-psd-open {
					color: @blue;
				}
			}
			.login-btn {
				width: 100%;
				display: block;
				font-size: 0.4rem;
			}
		}
		.login-explain {
			width: 100%;
			&::after {
				content: '';
				display: block;
				visibility: hidden;
				clear: both;
			}
			.explain-info {
				width: 100%;
				border-top: 1px solid #d9d9d9;
				margin-top: 0;
				padding: 0;
				opacity: 0;
				// transition: opacity 0.3s, padding 0.3s, margin-top 0.3s;
				transition: all 0.3s;
				.item {
					width: 100%;
					height: 0;
					font-size: 14px;
					color: #636363;
					line-height: 0.53rem;
					white-space: nowrap;
					opacity: 0;
					overflow: hidden;
					transition: all 0.3s;
				}
			}
			&.explain-open {
				.explain-info {
					padding: 1.03vh 0;
					opacity: 1;
					.item {
						height: 0.53rem;
						opacity: 1;
					}
				}
			}
		}
		/deep/ .switch-language {
			height: auto;
			margin-right: 0;
			position: absolute;
			top: 1vh;
			right: 0.3rem;
			.iconfont {
				color: #999;
				font-size: 0.6rem;
			}
		}
	}
	&.mobile {
		.login-container {
			width: 16rem;
			.login-title-1 {
				font-size: 0.7rem;
			}
			.login-title-2 {
				font-size: 0.55rem;
			}
			.login-box {
				.password {
					.icon-look,
					.icon-nolook {
						top: 50%;
						font-size: 1rem;
					}
					.show-pwd {
						color: @blue;
					}
				}
				.captcha {
					.captcha-input {
						width: 9rem;
					}
					.captcha-img {
						width: 3rem;
					}
				}
				.forget-psd {
					font-size: 0.6rem;
				}
				.login-btn {
					font-size: 0.7rem;
				}
			}
			.login-explain {
				.explain-info {
					.item {
						line-height: 1rem;
					}
				}
				&.explain-open {
					.explain-info {
						.item {
							height: 1rem;
						}
					}
				}
			}
		}
		/deep/ .switch-language {
			.iconfont {
				color: #999;
				font-size: 0.9rem;
			}
		}
	}
}
</style>
