<template>
	<div id="overview" :class="{ mobile: isMobile }">
		<div class="title-box">
			<span class="title float-left">{{ $t('home.dataOverview') }}</span>
			<p class="date">{{ $t('home.QueryTime') }}：{{ year }}年</p>
		</div>
		<!-- content -->
		<ul class="list" v-loading="loading">
			<li class="item-li float-left" v-for="(item, index) in overview_list" :key="index">
				<router-link :to="{ path: item.path, query: { status: item.status } }">
					<count-to :start-val="0" :end-val="item.num" :duration="2500" class="num" />
					<p class="title" v-text="item.title"></p>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
// api
import { getOverView } from '@api/mock';
// 插件
import CountTo from 'vue-count-to';
import { mapState } from 'vuex';
export default {
	name: 'overview',
	data() {
		return {
			loading: false,
			data: {}
		};
	},
	computed: {
		...mapState(['isMobile']),
		overview_list() {
			return [
				{
					path: '/views/index/works-list',
					title: '图片',
					num: 8332,
					status: 0
				},
				{
					path: '/views/index/works-list',
					title: '文档',
					num: 9821
				},
				{
					path: '/views/index/leaderboard',
					title: '艺术家',
					num: 239,
					status: 1
				},
				{
					path: '/views/index/exhibition/list',
					title: '展览',
					num: 3
				}
			];
		},
		year() {
			return new Date().getFullYear();
		}
	},
	components: { CountTo },
	created() {
		this.getData();
	},
	methods: {
		getData: async function() {
			this.loading = true;
			try {
				let data = { year: this.year };
				const res = await getOverView(data);
				const respon = res.result || {};
				this.data = respon;
				this.loading = false;
			} catch (err) {
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#overview {
	width: 100%;
	margin-top: 20px;
	height: 250px;
	border: 0.03rem solid #edeef1;
	background: #fff;
	.list {
		margin: 0 auto;
		height: 100px;
		margin-top: 60px;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		.item-li {
			flex: 1 1 auto;
			// width: 4.75rem;
			height: 100%;
			text-align: center;
			border-right: 1px solid #a2b0d6;
			cursor: pointer;
			&:hover {
				.num {
					color: teal;
					&::after {
						background: darken(#edeef1, 10%);
					}
				}
				.title {
					color: teal;
				}
			}
			&:last-of-type {
				border-right: none;
			}
			.num {
				font-size: 34px;
				font-weight: 600;
				display: block;
				color: #46464b;
				.transi;
				&::after {
					content: '';
					display: block;
					width: 45%;
					height: 3px;
					background: #edeef1;
					margin: 12px auto;
					.transi;
				}
			}
			.title {
				font-size: 16px;
				display: block;
				color: @text_color;
				letter-spacing: 1px;
				.transi;
			}
		}
	}
	&.mobile {
		height: auto;
		.list {
			height: auto;
			margin-top: 0;
			flex-flow: row wrap;
			.item-li {
				width: 50%;
				margin: 20px 0;
				&:nth-child(2n) {
					border-right: none;
				}
			}
		}
	}
}
</style>
