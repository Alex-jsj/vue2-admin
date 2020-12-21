<template>
	<div id="workbench">
		<!-- 快捷入口 -->
		<QuickEnter />
		<!-- 数据概览 -->
		<Overview />
		<!-- 趋势 -->
		<Trend />
		<!-- 服务器信息 -->
		<System />
	</div>
</template>

<script>
import QuickEnter from './components/quickEnter';
import Overview from './components/overview';
import Trend from './components/trend';
import System from './components/system';

export default {
	name: 'workbench',
	components: {
		QuickEnter,
		Overview,
		Trend,
		System
	}
};
</script>

<style scoped lang="less">
@import '~@assets/css/mixin.less';
#workbench {
	/deep/.title-box {
		width: 100%;
		height: 40px;
		padding: 0 0.55rem;
		background: #edeef1;
		position: relative;
		vertical-align: middle;
		.title {
			font-size: 16px;
			color: @text_color;
			line-height: 40px;
		}
		.date {
			float: right;
			line-height: 40px;
			font-size: 12px;
			color: #5a5b64;
		}
		.board {
			float: right;
			line-height: 40px;
			margin-top: 6px;
			margin-left: 15px;
			.el-button {
				display: block;
			}
		}
	}
}
</style>
