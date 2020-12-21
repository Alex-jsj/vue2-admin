<template>
	<div :class="isMobile ? 'mobile' : 'pc'">
		<el-tabs v-model="activeName" :tab-position="isMobile ? 'top' : 'left'" size="small">
			<el-tab-pane label="基本设置" name="baseSet">
				<baseSet v-if="activeName === 'baseSet'" />
			</el-tab-pane>
			<el-tab-pane label="安全设置" name="safe">
				<safe v-if="activeName === 'safe'" />
			</el-tab-pane>
			<el-tab-pane label="账号绑定" name="bind">
				<bind v-if="activeName === 'bind'" />
			</el-tab-pane>
			<el-tab-pane label="新消息通知" name="messageSet">
				<messageSet v-if="activeName === 'messageSet'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import baseSet from './components/base';
import safe from './components/safe';
import bind from './components/bind';
import messageSet from './components/messageSet';
import { mapState } from 'vuex';
export default {
	name: 'personalCenter-center',
	data() {
		return {
			activeName: 'baseSet'
		};
	},
	created() {
		if (this.$route.query.modify === '1') {
			this.activeName = 'safe';
		}
	},
	components: {
		baseSet,
		safe,
		bind,
		messageSet
	},
	computed: {
		...mapState(['isMobile'])
	}
};
</script>
<style lang="less" scoped>
.pc {
	/deep/.el-tabs {
		padding: 20px 20px 20px 0;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 0, 0, 0.04);
		.el-tabs__header {
			margin-right: 40px;
			.el-tabs__nav-scroll {
				min-height: 400px;
			}
			.el-tabs__item {
				color: #303133;
				padding: 0 40px;
				font-weight: 400;
				&.is-active {
					color: teal;
				}
			}
		}
	}
}
/deep/.center-title {
	font-size: 20px;
	margin-top: 10px;
	margin-bottom: 30px;
	padding-bottom: 8px;
	border-bottom: 1px solid rgb(232, 232, 232);
}
/deep/.list {
	width: 100%;
	.item {
		display: flex;
		align-items: center;
		padding: 12px 0px;
		border-bottom: 1px solid rgb(232, 232, 232);
		.left-container {
			align-items: flex-start;
			flex: 1 1 0%;
			.title-1 {
				margin-bottom: 4px;
				color: rgba(0, 0, 0, 0.65);
				font-size: 14px;
				line-height: 22px;
			}
			.title-2 {
				color: rgba(0, 0, 0, 0.45);
				font-size: 14px;
				line-height: 22px;
			}
			.prominent {
				color: teal;
			}
		}
		.right-container {
			margin-left: 48px;
			font-size: 0px;
			flex: 0 0 auto;
			padding: 0px;
		}
	}
}
</style>
