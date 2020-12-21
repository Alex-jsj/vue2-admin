<template>
	<div>
		<p class="center-title">新消息通知</p>
		<ul class="list">
			<li class="item">
				<div class="left-container">
					<p class="title-1">账户密码</p>
					<span class="title-2">其他用户的消息将以站内信的形式通知</span>
				</div>
				<div class="right-container">
					<el-switch v-model="form.switch_1" disabled></el-switch>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<p class="title-1">系统消息</p>
					<span class="title-2">系统消息将以站内信的形式通知</span>
				</div>
				<div class="right-container">
					<el-switch v-model="form.switch_2"></el-switch>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<p class="title-1">待办任务</p>
					<span class="title-2">待办任务将以站内信的形式通知</span>
				</div>
				<div class="right-container">
					<el-switch v-model="form.switch_3" disabled></el-switch>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "personalCenter-center-messageSet",
	data() {
		return {
			form: {
				switch_1: false,
				switch_2: true,
				switch_3: false
			}
		};
	}
};
</script>
