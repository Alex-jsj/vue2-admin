<template>
	<div>
		<p class="center-title">安全设置</p>
		<ul class="list">
			<li class="item">
				<div class="left-container">
					<p class="title-1">账户密码</p>
					<span class="title-2">当前密码强度：强</span>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium" @click="dialogVisible = true">修改</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<p class="title-1">密保手机</p>
					<span class="title-2">
						已绑定手机：
						<i class="prominent">153****0398</i>
					</span>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">修改</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<p class="title-1">密保问题</p>
					<span class="title-2">未设置密保问题，密保问题可有效保护账户安全</span>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">设置</el-button>
				</div>
			</li>
			<li class="item">
				<div class="left-container">
					<p class="title-1">密保邮箱</p>
					<span class="title-2">未绑定邮箱</span>
				</div>
				<div class="right-container">
					<el-button type="text" size="medium">设置</el-button>
				</div>
			</li>
		</ul>
		<el-dialog title="修改密码" :width="isMobile ? '90%' : '40%'" :visible.sync="dialogVisible">
			<div>
				<el-form ref="form" label-width="100px" :model="form" :rules="rules">
					<el-row>
						<el-col :span="20">
							<el-form-item label="旧密码:" class="old_password" prop="oldPassword">
								<input name="a" style="display:none" type="password" placeholder="密码" />
								<el-input
									v-model="form.oldPassword"
									autocomplete="off"
									:type="show_pwd ? 'text' : 'password'"
									style="width:100%"
									placeholder="请输入原密码"
								></el-input>
								<i class="iconfont" :class="show_pwd ? 'icon-look' : 'icon-nolook'" @click="show_pwd = !show_pwd"></i>
							</el-form-item>
							<el-form-item label="新密码:" class="password" prop="newPassword">
								<el-input
									v-model="form.newPassword"
									autocomplete="off"
									:type="show_passwd ? 'text' : 'password'"
									style="width:100%"
									placeholder="请输入新密码"
								></el-input>
								<i class="iconfont" :class="show_passwd ? 'icon-look' : 'icon-nolook'" @click="show_passwd = !show_passwd"></i>
							</el-form-item>
							<el-form-item label="确认密码:" class="password_confirmation" prop="confirmPassword">
								<el-input
									v-model="form.confirmPassword"
									autocomplete="off"
									:type="show_password ? 'text' : 'password'"
									style="width:100%"
									placeholder="请再次输入新密码"
								></el-input>
								<i class="iconfont" :class="show_password ? 'icon-look' : 'icon-nolook'" @click="show_password = !show_password"></i>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div slot="footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* api */
import { change } from '@api/personalCenter/account';
import { mapState } from 'vuex';
import { md5Psd } from '@utils/public';

export default {
	name: 'personalCenter-center-messageSet',
	data() {
		return {
			dialogVisible: false,
			show_pwd: false, // 是否显示旧密码
			show_passwd: false, // 是否显示新密码
			show_password: false, // 是否显示确认新密码
			form: {
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			}
		};
	},
	computed: {
		...mapState(['isMobile', 'login']),
		rules() {
			return {
				oldPassword: [
					{
						validator: function(rule, value, callback) {
							let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
							if (!value) {
								callback(new Error('请输入旧密码'));
							} else if (!reg.test(value)) {
								callback(new Error('密码应为5-20位数字/字母/下划线/@/.'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				newPassword: [
					{
						validator: function(rule, value, callback) {
							let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
							if (!value) {
								callback(new Error('请设置新密码'));
							} else if (!reg.test(value)) {
								callback(new Error('密码应设置为5-20位数字/字母/下划线/@/.'));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				confirmPassword: [
					{
						validator: (rule, value, callback) => {
							const newPassword = this.form.newPassword;
							let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
							if (!value) {
								callback(new Error('请确认新密码'));
							} else if (!reg.test(value)) {
								callback(new Error('密码应设置为5-20位数字/字母/下划线/@/.'));
							} else if (value !== newPassword) {
								callback(new Error('两次密码输入不一致'));
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
	methods: {
		//提交验证
		submit: function() {
			this.$refs['form'].validate(valid => {
				if (!valid) {
					return;
				}
				this.$confirm('确定修改密码?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						let data = this.form;
						this.confirmHandle(data);
					})
					.catch(() => {
						this.dialogVisible = false;
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});
			});
		},
		//提交处理
		confirmHandle: async function(val) {
			let data = {
				confirmPassword: md5Psd(this.login.account, val.confirmPassword),
				newPassword: md5Psd(this.login.account, val.newPassword),
				oldPassword: md5Psd(this.login.account, val.oldPassword)
			};
			const res = await change(data);
			if (res.code === 200) {
				this.$message({
					type: 'success',
					message: '修改成功!'
				});
				this.dialogVisible = false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.old_password,
.password,
.password_confirmation {
	position: relative;
	.icon-look,
	.icon-nolook {
		position: absolute;
		top: 50%;
		right: 0.3rem;
		transform: translateY(-50%);
		font-size: 0.5rem;
		cursor: pointer;
		transition: all 0.3s;
	}
}
</style>
