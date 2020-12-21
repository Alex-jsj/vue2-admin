<template>
	<el-dialog
		:title="title"
		:visible.sync="dialogFormVisible"
		v-if="dialogFormVisible"
		:width="width"
		:before-close="closeDailog"
		:close-on-click-modal="false"
	>
		<el-form :model="formModel" ref="configForm" :label-width="labelWidth">
			<el-row :gutter="16">
				<el-col :span="item.span ? item.span : 8" v-for="(item, index) in config" :key="index">
					<el-form-item :prop="item.prop" :rules="item.rules" :label="item.label">
						<!-- 部门 -->
						<el-cascader
							v-if="item.type === 'department'"
							v-model="formModel[item.prop]"
							:options="departmentOptions"
							:props="departmentProps"
							clearable
							style="width:100%;"
						></el-cascader>
						<!-- 角色组 -->
						<el-select
							v-if="item.type === 'role'"
							v-model="formModel[item.prop]"
							:placeholder="item.placeholder ? item.placeholder : '请选择角色组'"
						>
							<el-option v-for="role_item in roleList" :key="role_item.id" :label="role_item.roleName" :value="role_item.id"></el-option>
						</el-select>
						<!--输入框表单类型-->
						<el-input
							v-if="item.type === 'text' || item.type === 'password' || item.type === 'textarea'"
							:type="item.type"
							v-model="formModel[item.prop]"
							:placeholder="item.placeholder ? item.placeholder : '请输入'"
							:maxlength="item.maxlength"
							:show-password="item.showPassword || false"
							show-word-limit
						></el-input>
						<!-- 计数器 -->
						<el-input-number v-if="item.type === 'el-input-number'" v-model="formModel[item.prop]" :min="1" :step="1"></el-input-number>
						<!-- 开关 -->
						<el-switch v-if="item.type === 'switch'" v-model="formModel[item.prop]" active-color="#67C23A" inactive-color="#909399"></el-switch>
						<!--checkbox表单类型-->
						<el-checkbox-group
							v-if="item.type === 'checkbox'"
							v-model="formModel[item.prop]"
							:placeholder="item.placeholder ? item.placeholder : '请选择'"
						>
							<el-checkbox v-for="option in item.data" :label="option.id" :key="option.id">{{ option.name }}</el-checkbox>
						</el-checkbox-group>
						<!--radio表单类型-->
						<el-radio-group
							v-if="item.type === 'radio'"
							v-model="formModel[item.prop]"
							:placeholder="item.placeholder ? item.placeholder : '请选择'"
						>
							<el-radio v-for="option in item.data" :label="option.id" :key="option.id">{{ option.name }}</el-radio>
						</el-radio-group>
						<!--下拉选择类型-->
						<el-select v-if="item.type === 'select'" v-model="formModel[item.prop]" :placeholder="item.placeholder ? item.placeholder : '请选择'">
							<el-option v-for="option in item.data" :key="option.id" :label="option.name" :value="option.id"></el-option>
						</el-select>
						<!-- 日期 -->
						<el-date-picker
							v-if="item.type === 'date'"
							v-model="formModel[item.prop]"
							:type="item.datetype"
							format="yyyy-MM-dd HH:mm:ss"
							value-format="timestamp"
							:placeholder="item.placeholder ? item.placeholder : '请选择日期'"
							style="width:100%;"
							:default-time="item.defaultTime || '08:00:00'"
						></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="closeDailog">取 消</el-button>
			<el-button type="primary" :loading="dialogFormLoading" @click="submitForm(formModel)">提 交</el-button>
		</span>
	</el-dialog>
</template>

<script>
/* 混入 */
import business from './mixins/business'; // 业务组件
/* 方法 */
import { checkboxAddID, IDToArray, formatSize } from '@utils/public';
/* vuex */
import { mapState } from 'vuex';
export default {
	name: 'base-dialog-form',
	props: {
		dialogFormLoading: {
			type: Boolean,
			default: false
		}, // 提交按钮loading
		dialogFormVisible: {
			type: Boolean,
			default: false
		}, // 模态框是否开启
		title: {
			type: String,
			default: ''
		}, // 标题
		width: {
			type: [String, Number],
			default: '80%'
		}, // 宽度
		labelWidth: {
			type: [String, Number],
			default: ''
		}, // label宽度
		config: {
			type: Array,
			default: () => []
		}, // 表单配置
		formData: {
			type: Object,
			default: () => {}
		}, // 默认数据
		errForm: {
			type: Object,
			default: () => {}
		}, // 后端返回的错误数据
		isEdit: {
			type: Boolean,
			default: false
		} // 是否是编辑状态
	},
	mixins: [business],
	data() {
		return {
			formModel: {},
			dialogTitle: ''
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	watch: {
		/*实现表单数据的绑定，实时接收父组件的数据变化*/
		formData() {
			this.formModel = JSON.parse(JSON.stringify(this.formData));
			if (this.formModel.selecteddeparts) {
				this.formModel = IDToArray(this.formModel, ['selecteddeparts', 'selectedroles'], 'id'); // 对象数组转换成string数组
				Object.assign(this.formModel, { selecteddeparts: this.formModel.selecteddeparts[0], selectedroles: this.formModel.selectedroles[0] });
			}
		},
		dialogFormVisible(newValue) {
			if (!newValue) {
				// 当弹框关闭的时候重置表单模型
				this.$emit('resetFormModel'); // 重置父组件的表单模型，防止新增的时候由于watch formData导致新增时也被填入数据
				this.$refs.configForm.clearValidate(); // 移除表单校验
			}
		}
	},
	created() {},
	mounted() {
		// 将组件上的属性赋值给当前组件内变量，因为props只能单向绑定,还需要监听属性值变化进行父子组件间交互
		this.formModel = JSON.parse(JSON.stringify(this.formData));
		this.dialogTitle = this.title;
	},
	methods: {
		// 提交表单数据
		submitForm(obj) {
			this.$refs.configForm.validate(valid => {
				if (valid) {
					this.$emit('submit', this.formModel); // 让父组件接收到响应数据
					// this.$emit('update:dialogFormLoading', true); // 表单提交按钮loading
					// this.$emit('update:dialogFormVisible', false); // 模态框关闭
				} else {
					return false;
				}
			});
		},
		closeDailog: function() {
			this.$emit('update:dialogFormVisible', false);
		}
	}
};
</script>

<style lang="less" scoped>
.el-input {
	width: 100% !important;
}
.el-select {
	width: 100% !important;
}
</style>
