<template>
	<div id="system-user">
		<!-- 表格 -->
		<baseTable
			:theApi="theApi"
			:table-config="configData.tableConfig"
			:top-btn-config="configData.topBtnConfig"
			:bottom-btn-config="configData.bottomBtnConfig"
			:table-btn-config="configData.tableBtnConfig"
			:other-config="configData.otherConfig"
			:filter-config="configData.filterConfig"
			form-title="用户"
			:form-label-width="isMobile ? '' : '80px'"
			:form-width="isMobile ? '95%' : '40%'"
			:form-config="configData.formConfig"
			:form-data-model="configData.formModel"
			ref="table"
			@getUserDetail="getUserDetail"
		></baseTable>
		<!-- 用户详情 -->
		<el-drawer
			:size="isMobile ? '100%' : '30%'"
			title="用户详情"
			:visible.sync="drawerVisible"
			v-if="drawerVisible"
			direction="rtl"
			:before-close="closeDrawer"
		>
			<el-form :model="userDetail" label-position="top" class="user-info">
				<el-form-item label="头像">
					<img :src="userDetail.avatar" alt="用户头像" />
				</el-form-item>
				<el-form-item label="所属部门">
					<p>{{ userDetail.selecteddeparts.length === 0 ? '' : userDetail.selecteddeparts[0].name }}</p>
				</el-form-item>
				<el-form-item label="所属用户组">
					<p>{{ userDetail.selectedroles.length === 0 ? '' : userDetail.selectedroles[0].name }}</p>
				</el-form-item>
				<el-form-item label="性别">
					<p>{{ userDetail.sex === 1 ? '男' : '女' }}</p>
				</el-form-item>
				<el-form-item label="生日">
					<p>{{ userDetail.birthday }}</p>
				</el-form-item>
				<el-form-item label="邮箱">
					<p>{{ userDetail.email }}</p>
				</el-form-item>
				<el-form-item label="手机号">
					<p>{{ userDetail.phone }}</p>
				</el-form-item>
			</el-form>
		</el-drawer>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/system/user';
/* 组件 */
import baseTable from '@components/baseTable';
/* 状态识别 */
import { checkState } from '@utils/checkTypes';
/* 验证规则 */
import { checkUserName } from '@utils/verify';
/* vuex */
import { mapState } from 'vuex';

export default {
	name: 'system-user',
	data() {
		return {
			drawerVisible: false,
			userDetail: '',
			//表格配置
			configData: {
				otherConfig: {
					additionalField: JSON.stringify({
						column: 'createTime',
						order: 'desc'
					}), // 额外的请求参数
					dataFieldUrl: 'records', // 接口数据结构地址 (必填)
					rowKey: '', // 优化表格循环的key,值为空的时候无法启动树形表格
					needSelect: true, // 是否可以多选
					needRef: false // 是否需要刷新表格
				},
				tableConfig: [
					{ label: '账号', prop: 'username' },
					{ label: '昵称', prop: 'realname' },
					{ label: '所属部门', prop: '' },
					{ label: '角色组', prop: '' },
					{
						label: '状态',
						width: 90,
						render: (h, params) => {
							const { color, text } = checkState(params.row.status);
							return (
								<div class="icon-text">
									<i style={`background-color:${color}`}></i>
									<span>{text}</span>
								</div>
							);
						}
					},
					{
						label: '创建时间',
						width: 160,
						render: (h, params) => {
							return <span>{this.$moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
						}
					}
				],
				tableBtnConfig: {
					width: 127, //宽度
					/* 编辑按钮配置 */
					editBtnConfig: {
						show: true,
						dataFromInterface: true // 编辑数据是否从接口获取
					},
					delete: true, // 是否需要删除
					deleteConfirm: true, // 删除是否需要输入密码进行确认
					/* 自定义扩展按钮配置 */
					expands: [
						{
							name: '详情', // 按钮title
							emitName: 'getUserDetail' // 绑定事件的事件名
						}
					]
				},
				topBtnConfig: [
					{
						title: '添加用户',
						icon: 'el-icon-plus'
					}
				],
				/* 表格下方自定义按钮配置 */
				bottomBtnConfig: {
					batchDelete: true, // 需要批量删除
					extends: []
				},
				/* 表格上方自定义按钮配置 */
				filterConfig: {
					// 筛选组件配置
					filter_list: ['search', 'userState'], // 需要筛选的字段
					search_field: [['userState', 'status']], // 字段替换
					search_list: [
						// 搜索框支持的搜索字段配置
						{
							field: 'realname',
							label: '昵称'
						},
						{
							field: 'username',
							label: '用户名'
						}
					]
				},
				// table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
				formConfig: [
					{
						span: 24,
						label: '所属部门',
						prop: 'selecteddeparts',
						type: 'department',
						rules: {
							required: false,
							message: '请选择部门',
							trigger: 'change'
						}
					},
					{
						span: 24,
						label: '角色组',
						prop: 'selectedroles',
						type: 'role',
						rules: {
							required: false,
							message: '请选择角色组',
							trigger: 'change'
						}
					},
					{
						span: 24,
						label: '昵称',
						prop: 'realname',
						type: 'text',
						rules: {
							required: true,
							message: '请输入昵称',
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '用户名',
						prop: 'username',
						type: 'text',
						rules: {
							required: true,
							validator: async (rule, value, callback) => {
								let data = { username: value };
								const result = await this.theApi.checkOnlyUser(data);
								const isEdit = this.$refs.table.$refs.dialogForm.isEdit;
								const reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
								if (!value) {
									return callback(new Error('用户名不能为空'));
								} else if (reg.test(value) === false) {
									callback(new Error('用户名必须为5~20位，英文/数字/下划线/@/.'));
								} else if (result.success === false && !isEdit) {
									callback(new Error('该用户已存在'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '密码',
						prop: 'password',
						type: 'password',
						showPassword: true,
						rules: {
							required: true,
							validator: (rule, value, callback) => {
								const isEdit = this.$refs.table.$refs.dialogForm.isEdit;
								let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位英文数字/字母/下划线/@/.
								if (!value && !isEdit) {
									callback(new Error('密码不能为空'));
								} else if (reg.test(value) === false) {
									callback(new Error('密码必须为5-20位英文/数字/下划线/@/.'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '确认密码',
						prop: 'confirmPassword',
						type: 'password',
						showPassword: true,
						rules: {
							required: true,
							validator: (rule, value, callback) => {
								const isEdit = this.$refs.table.$refs.dialogForm.isEdit;
								let psd = this.$refs.table.$refs.dialogForm.formModel.password;
								let reg = /^[0-9a-zA-Z_@.]{5,20}$/; //5-20位数字/字母/下划线/@/.
								if (!value && !isEdit) {
									callback(new Error('密码不能为空'));
								} else if (value !== psd) {
									callback(new Error('两次输入的密码不一致'));
								} else if (reg.test(value) === false) {
									callback(new Error('密码必须为5-20位数字/字母/下划线/@/.'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					},
					{
						span: 24,
						label: '状态',
						prop: 'status',
						type: 'radio',
						data: [
							{ id: 1, name: '正常' },
							{ id: 2, name: '冻结' }
						],
						rules: {
							required: true,
							message: '请选择状态',
							trigger: 'change'
						}
					}
				],
				// 表单基础数据类型，需要预先赋值
				formModel: {
					realname: '',
					username: '',
					password: '',
					status: 1,
					force: 1
				}
			},
			theApi // 表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	created() {},
	components: { baseTable },
	methods: {
		/* 获取用户详情 */
		getUserDetail: async function(row = {}) {
			const { id } = row;
			try {
				const res = await theApi.getDetail({ id });
				if (res.code === 200) {
					const respon = res.result || [];
					this.userDetail = respon;
					this.drawerVisible = true;
				}
			} catch (err) {
				console.log(err);
			}
		},
		// 关闭drawer
		closeDrawer: function() {
			// 重置数值
			this.userDetail = '';
			this.drawerVisible = false;
		}
	}
};
</script>

<style lang="less" scoped>
#system-user {
	/deep/.user-info {
		padding: 20px;
		.el-form-item__label {
			padding-bottom: 0;
		}
		.el-form-item__content {
			border: 1px solid #ddd;
			padding-left: 15px;
			border-radius: 4px;
			color: #777;
			min-height: 28px;
		}
	}
}
</style>
