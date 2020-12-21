<template>
	<div id="ele-pagination" class="public-pages">
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPaging.currentPage"
			:page-size="currentPaging.pageSize"
			:page-sizes="[10, 50, 100, 500]"
			:pager-count="pagerCount"
			:layout="layout"
			background
			:total="currentPaging.totals"
		></el-pagination>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'ele_pagination',
	data() {
		return {
			pagerCount: 5,
			layout: 'total , sizes, prev, pager, next, jumper'
		};
	},
	props: {
		currentPaging: {}
	},
	computed: {
		...mapState(['isMobile'])
	},
	created() {
		// 移动端减少分页功能
		this.layout = this.isMobile ? 'pager , next' : 'total , sizes, prev, pager, next, jumper';
		// this.pagerCount = this.isMobile ? 5 : 7; // 大于等于5且小于等于21的奇数
	},
	methods: {
		//分页
		handleSizeChange(val) {
			this.$emit('sizeChange', val);
		},
		handleCurrentChange(val) {
			this.$emit('currentChange', val);
		}
	}
};
</script>

<style lang="less" scoped>
#ele-pagination {
	display: inline-block;
	/deep/.el-pagination {
		padding-right: 0;
		.btn-next {
			margin-right: 0;
		}
	}
}
</style>
