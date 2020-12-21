<template>
	<div>
		<p class="center-title">账号绑定</p>
		<ul class="list">
			<li class="item">
				<div class="left-container">
					<div class="bind-1">
						<img src="../../../../public/img/QQ.png" class="bind-img" />
					</div>
					<div class="bind-2">
						<p class="title-1">绑定QQ</p>
						<span class="title-2">当前未绑定QQ账号</span>
					</div>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">绑定</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<div class="bind-1">
						<img src="../../../../public/img/wechat.png" class="bind-img" />
					</div>
					<div class="bind-2">
						<p class="title-1">绑定微信</p>
						<span class="title-2">当前未绑定微信账号</span>
					</div>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">绑定</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<div class="bind-1">
						<img src="../../../../public/img/163.png" class="bind-img" />
					</div>
					<div class="bind-2">
						<p class="title-1">绑定网易邮箱</p>
						<span class="title-2">当前未绑定网易邮箱账号</span>
					</div>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">绑定</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<div class="bind-1">
						<img src="../../../../public/img/dingding.png" class="bind-img" />
					</div>
					<div class="bind-2">
						<p class="title-1">绑定钉钉</p>
						<span class="title-2">当前未绑定钉钉账号</span>
					</div>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">绑定</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "personalCenter-center-messageSet",
	data() {
		return {};
	}
};
</script>
<style lang="less" scoped>
.left-container {
	display: flex;
	flex: 1 1;
	align-items: flex-start;
	font-size: 0;
	.bind-1 {
		margin-right: 16px;
		.bind-img {
			width: 48px;
			height: auto;
		}
	}
	.bind-2 {
		flex: 1 0;
	}
}
</style>
