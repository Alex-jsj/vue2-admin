<template>
	<div id="add-categorie">
		<el-cascader
			:disabled="needDisabled"
			v-model="categorieValue"
			:options="optionList"
			:props="typeProps"
			:show-all-levels="false"
			filterable
			clearable
			style="width:100%;"
		></el-cascader>
	</div>
</template>

<script>
/* api */
import { getCategories } from '@api/mock';

export default {
	name: 'add-categorie',
	data() {
		return {
			optionList: [], // 作品类别数组
			typeProps: {
				multiple: true, // 多选
				emitPath: false, // 返回路径
				checkStrictly: true, // 可选任意级
				value: 'id',
				label: 'name'
			}
		};
	},
	props: {
		type: {
			type: String,
			default: 'work'
		},
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
	created() {
		this.get_categories();
	},
	methods: {
		get_categories: async function() {
			try {
				const res = await getCategories({ type: this.type });
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
