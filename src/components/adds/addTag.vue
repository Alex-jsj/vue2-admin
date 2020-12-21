<template>
	<div id="add-dynasty">
		<el-select :disabled="needDisabled" v-model="tagsValue" multiple filterable placeholder="请选择作品标签">
			<el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		</el-select>
		<el-button :disabled="needDisabled" type="text" class="add-more-btn" @click="dialogFormVisible = true">添加标签</el-button>
		<BaseDialogForm
			ref="dialogForm"
			title="添加标签"
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
import { getTag } from '@api/filterGroup';
/* 组件 */
import BaseDialogForm from '@components/baseDialog'; // 基础表单
/* 验证规则 */
import { checkPositiveInteger } from '@utils/verify';

export default {
	name: 'add-tag',
	data() {
		return {
			tagList: [],
			dialogFormLoading: false, // 表单弹框loading
			dialogFormVisible: false, // 表单弹框开关
			formConfig: [
				{
					span: 24,
					label: '标题',
					prop: 'name',
					type: 'text',
					rules: {
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}
				}
			],
			/* 表单基础数据类型，需要预先赋值 */
			formModel: {
				name: '',
				sort: 999
			},
			formError: {} // 后台输出错误信息
		};
	},
	props: {
		needDisabled: {
			type: Boolean,
			default: false
		},
		tags: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		// 定义一个计算属性,给子组件的 v-model使用
		tagsValue: {
			// 计算属性的 get 返回父组件传入的 value,即model,props中定义的 prop
			get: function() {
				return this.tags;
			},
			set: function(value) {
				//向父组件触发事件,此事件为model中定义的event,子组件v-model绑定了该计算属性,输入时会触发计算属性的set方法,即向父组件触发该事件
				this.$emit('change', value);
			}
		}
	},
	model: {
		prop: 'tags',
		event: 'change'
	},
	components: { BaseDialogForm },
	created() {
		this.get_tag();
	},
	methods: {
		/* 模态框数据提交 */
		dialogSubmit: async function(data) {
			this.dialogFormLoading = true; // 打开弹框提交按钮loading
			// 根据是否有id判断是新增还是编辑
			try {
				const res = await theApi.addItem(data);
				if (res.code === 200) {
					this.dialogFormVisible = false; // 弹框关闭
					this.get_tag();
					this.$message.success('标签添加成功!');
				}
				this.dialogFormLoading = false; // 弹框loading取消
			} catch (err) {
				this.dialogFormLoading = false;
			}
		},
		/* 获取标签 */
		get_tag: async function() {
			try {
				const res = await getTag();
				if (res.code === 200) {
					const respon = res.result || [];
					this.tagList = respon;
				}
			} catch (err) {
				// console.log(err);
			}
		}
	}
};
</script>
<style lang="less" scoped>
#add-dynasty {
	display: inline-block;
	width: 100%;
}
</style>
