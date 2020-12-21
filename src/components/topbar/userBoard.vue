<template>
	<div id="userBoard">
		<!-- 外部信息 -->
		<div class="roles">
			<p>{{ login.nickName }}</p>
			<p>{{ login.role }}</p>
		</div>
		<!-- 头像 -->
		<div class="head-portrait">
			<el-badge :value="login.unread" :max="99" data-step="2" :data-intro="$t('introductorPage.step2')" :class="{ 'badge-show': login.unread }">
				<div class="img-container">
					<img :src="login.head_img | avatar" class="head-img" />
				</div>
			</el-badge>
		</div>
		<!-- 用户面板 -->
		<div class="user-board">
			<p class="user-icon">
				<i class="iconfont icon-triangle-top"></i>
			</p>
			<div class="user-board-container">
				<div class="user-board-info">
					<!-- 头像 -->
					<div class="board-touxiang">
						<img :src="login.head_img | avatar" class="head-img" />
					</div>
					<!-- 信息 -->
					<div class="board-text float-right">
						<span class="nick-name float-left">{{ login.nickName }}</span>
						<span class="float-left">{{ login.role }}</span>
						<p class="account float-left">{{ login.account }} ({{ $t('topBar.userBoard.userName') }})</p>
					</div>
				</div>
				<!-- 操作 -->
				<ul class="user-board-list">
					<!-- <li class="item">
						<router-link to="/views/index/personalCenter/message" class="link">
							{{ $t('topBar.userBoard.messageNotification') }}
							<span v-if="login.unread">( {{ login.unread }} )</span>
						</router-link>
					</li> -->
					<li class="item">
						<router-link to="/views/index/personalCenter/center?modify=1" class="link">{{ $t('topBar.userBoard.changePassword') }}</router-link>
					</li>
					<li class="item">
						<p class="link" @click="log_out()">{{ $t('topBar.userBoard.logout') }}</p>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { logout } from '@api/login';
import { mapState } from 'vuex';
import '@utils/filters';
export default {
	name: 'userBoard',
	computed: {
		...mapState(['login'])
	},
	methods: {
		// 退出登录
		log_out: function() {
			localStorage.removeItem(this.$store.state.token_field); // 移除登录标记
			location.reload(); // 刷新页面
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#userBoard {
	height: 100%;
	position: relative;
	display: table;
	&:hover {
		.user-board {
			height: 300px;
		}
	}
	.roles {
		margin-top: 10px;
		padding-left: 20px;
		position: relative;
		p {
			text-align: right;
			color: #fff;
			white-space: nowrap;
			margin-right: 15px;
			font-size: 14px;
		}
	}
	.head-portrait {
		display: table-cell;
		vertical-align: middle;
		width: 40px;
		height: 40px;
		position: relative;
		cursor: pointer;
		/deep/ .el-badge {
			display: block;
			.el-badge__content {
				display: none;
				border: none;
				height: 16px;
				line-height: 16px;
				&.is-fixed {
					top: 3px;
				}
			}
			&.badge-show {
				.el-badge__content {
					display: block;
				}
			}
		}
		.img-container {
			width: 40px;
			height: 40px;
			border: 1px solid #292c31;
			position: relative;
			overflow: hidden;
			border-radius: 50%;
			cursor: pointer;
			.head-img {
				display: block;
				width: 100%;
				min-height: 100%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	.user-board {
		width: 320px;
		height: 0;
		position: absolute;
		top: 50px;
		right: -20px;
		overflow: hidden;
		.transi;
		.user-icon {
			width: 280px;
			margin: 0 auto;
			height: 16px;
			position: relative;
			overflow: hidden;
			.icon-triangle-top {
				position: absolute;
				right: 7px;
				top: -5px;
				color: @blue;
				font-size: 28px;
			}
		}
		.user-board-container {
			width: 280px;
			margin: 0 auto;
			border-radius: 6px;
			box-shadow: 0 0 15px 0 rgba(119, 119, 119, 0.21);
			overflow: hidden;
			.user-board-info {
				width: 100%;
				height: 100px;
				background: @blue;
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
				background-size: 100% 100%;
				position: relative;
				.board-touxiang {
					width: 66px;
					height: 66px;
					border-radius: 50%;
					border: 1px solid @blue;
					position: relative;
					left: 17px;
					top: 17px;
					overflow: hidden;
					.head-img {
						display: block;
						width: 105%;
						min-height: 105%;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
				.board-text {
					width: 160px;
					position: absolute;
					top: 50%;
					right: 20px;
					transform: translateY(-50%);
					span {
						font-size: 14px;
						color: #fff;
						margin-top: 2px;
					}
					.nick-name {
						font-size: 18px;
						margin-right: 15px;
						margin-top: 0;
					}
				}
				.account {
					font-size: 14px;
					color: #fff;
					margin-top: 12px;
					width: 100%;
					white-space: nowrap;
				}
			}
			.user-board-list {
				width: 100%;
				padding: 12px 15px;
				background: #fff;
				.item {
					width: 100%;
					.link {
						font-size: 14px;
						color: @black;
						display: block;
						line-height: 34px;
						transition: all 0.3s;
						border-bottom: 1px solid transparent;
						cursor: pointer;
						&:hover {
							color: @blue;
							border-bottom: 1px solid #e8e8e8;
						}
					}
				}
			}
		}
	}
}
</style>
