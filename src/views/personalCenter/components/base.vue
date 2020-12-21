<template>
	<div :class="{ mobile: isMobile }">
		<p class="center-title">基本设置</p>
		<div class="bind-container">
			<div class="left-c">
				<el-form ref="form" label-position="top" :model="form">
					<el-form-item label="昵称">
						<el-input v-model="form.realname"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="form.sex">
							<el-radio :label="1">男</el-radio>
							<el-radio :label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="个人简介">
						<el-input type="textarea" :rows="5" v-model="form.intro"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input v-model="form.phone"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="form.email"></el-input>
					</el-form-item>
				</el-form>
				<el-button icon="el-icon-refresh" type="primary" size="small">更新信息</el-button>
			</div>
			<div class="right-c" v-if="!isMobile">
				<p>头像</p>
				<div class="avatar-container">
					<el-image :src="form.src | avatar"></el-image>
					<el-button icon="el-icon-thumb" plain>更换头像</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* api */
import { getUserInfo } from '@/api/login';
import { mapState } from 'vuex';
export default {
	name: 'personalCenter-center-bind',
	data() {
		return {
			form: {}
		};
	},
	created() {
		this.getUserInfo();
	},
	computed: {
		...mapState(['isMobile'])
	},
	methods: {
		getUserInfo() {
			getUserInfo().then(res => {
				this.form = res.result.userInfo;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.bind-container {
	display: flex;
	.left-c {
		flex: 1;
		margin-right: 100px;
	}
	.right-c {
		flex: 1;
		.avatar-container {
			display: flex;
			align-items: center;
			.el-image {
				width: 160px;
				height: 160px;
				border-radius: 50%;
				margin-right: 12px;
			}
		}
	}
}
.mobile {
	.bind-container {
		.left-c {
			margin-right: 0;
		}
	}
}
</style>
