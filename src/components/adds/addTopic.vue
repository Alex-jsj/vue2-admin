<template>
	<div id="add-topic">
		<el-select :disabled="needDisabled" v-model="topicValue" placeholder="请选择主题" multiple filterable clearable style="width:100%;">
			<el-option v-for="item in topicList" :key="item.id" :label="item.name" :value="item.id"></el-option>
		</el-select>
	</div>
</template>

<script>
/* api */
import { getTopic } from '@api/mock';

export default {
	name: 'add-topic',
	data() {
		return {
			topicList: [] // 数组
		};
	},
	props: {
		needDisabled: {
			type: Boolean,
			default: false
		},
		topics: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		// 定义一个计算属性,给子组件的 v-model使用
		topicValue: {
			// 计算属性的 get 返回父组件传入的 value,即model,props中定义的 prop
			get: function() {
				return this.topics;
			},
			set: function(value) {
				//向父组件触发事件,此事件为model中定义的event,子组件v-model绑定了该计算属性,输入时会触发计算属性的set方法,即向父组件触发该事件
				this.$emit('update', value);
			}
		}
	},
	model: {
		prop: 'topics',
		event: 'update'
	},
	created() {
		this.get_topic();
	},
	methods: {
		/* 获取主题 */
		get_topic: async function() {
			try {
				const res = await getTopic();
				if (res.code === 200) {
					const respon = res.result || [];
					this.topicList = respon;
				}
			} catch (err) {
				// console.log(err);
			}
		}
	}
};
</script>
