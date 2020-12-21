<template>
	<div id="add-workCategorie">
		<el-cascader
			:disabled="needDisabled"
			v-model="categorieValue"
			:options="optionList"
			:props="typeProps"
			:show-all-levels="false"
			filterable
			clearable
		></el-cascader>
		<el-button :disabled="needDisabled" type="text" class="add-more-btn" @click="dialogFormVisible = true">添加分类</el-button>
		<BaseDialogForm
			ref="dialogForm"
			title="添加作品分类"
			width="500px"
			labelWidth="80px"
			:config="formConfig"
			:form-data="formModel"
			:err-form="formError"
			:dialogFormLoading.sync="dialogFormLoading"
			:dialogFormVisible.sync="dialogFormVisible"
			@submit="dialogSubmit"
		/>
	</div>
</template>

<script>
/* api */
import * as theApi from '@api/mock';
import { getCategories } from '@api/filterGroup';
/* 组件 */
import BaseDialogForm from '@components/baseDialog'; // 基础表单
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';

/* 添加艺术作品分类 */
export default {
	name: 'add-workCategorie',
	data() {
		return {
			optionList: [], // 作品类别数组
			typeProps: {
				multiple: true, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'id',
				label: 'name'
			},
			dialogFormLoading: false, // 表单弹框loading
			dialogFormVisible: false, // 表单弹框开关
			formConfig: [
				{
					span: 24,
					label: '分类名称',
					prop: 'name',
					type: 'text',
					maxlength: 20, // 输入字数限制
					rules: {
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}
				},
				{
					span: 24,
					label: '排序',
					prop: 'sort',
					type: 'text',
					rules: {
						required: true,
						validator: checkPositiveInteger,
						trigger: 'blur'
					}
				},
				{
					span: 24,
					label: '是否启用',
					prop: 'enable',
					type: 'radio',
					data: [
						{
							id: true,
							name: '启用'
						},
						{
							id: false,
							name: '禁用'
						}
					],
					rules: {
						required: true,
						message: '请选择状态',
						trigger: 'change'
					}
				}
			],
			/* 表单基础数据类型，需要预先赋值 */
			formModel: {
				name: '',
				type: 'work',
				pid: '',
				sort: 999,
				enable: true
			},
			formError: {} // 后台输出错误信息
		};
	},
	props: {
		needDisabled: {
			type: Boolean,
			default: false
		},
		categories: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		// 定义一个计算属性,给子组件的 v-model使用
		categorieValue: {
			// 计算属性的 get 返回父组件传入的 value,即model,props中定义的 prop
			get: function() {
				return this.categories;
			},
			set: function(value) {
				//向父组件触发事件,此事件为model中定义的event,子组件v-model绑定了该计算属性,输入时会触发计算属性的set方法,即向父组件触发该事件
				this.$emit('update', value);
			}
		}
	},
	model: {
		prop: 'categories',
		event: 'update'
	},
	components: { BaseDialogForm },
	created() {
		this.get_artType();
	},
	methods: {
		// 模态框数据提交
		dialogSubmit: async function(data) {
			this.dialogFormLoading = true; // 打开弹框提交按钮loading
			// 根据是否有id判断是新增还是编辑
			try {
				const res = await theApi.addItem(data);
				if (res.code === 200) {
					this.dialogFormVisible = false; // 弹框关闭
					this.get_artType();
					this.$message.success('作品类别添加成功!');
				}
				this.dialogFormLoading = false; // 弹框loading取消
			} catch (err) {
				this.dialogFormLoading = false;
			}
		},
		get_artType: async function() {
			try {
				const res = await getCategories({ type: 'work' });
				if (res.code === 200) {
					const respon = res.result || [];
					this.optionList = respon;
				}
			} catch (err) {
				// console.log(err);
			}
		}
	}
};
</script>
<style lang="less" scoped>
#add-workCategorie {
	display: inline-block;
	width: 100%;
	.el-cascader {
		width: calc(100% - 70px);
	}
}
</style>
