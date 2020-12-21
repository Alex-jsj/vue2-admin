<template>
	<div id="system" :class="{ mobile: isMobile }">
		<div class="title-box">
			<span class="title float-left">{{ $t('home.serverInformation') }}</span>
		</div>
		<!-- content -->
		<ul class="list" v-loading="loading">
			<li class="item float-left">
				<ul class="_list">
					<li class="_item" v-for="(item, index) in data.info" :key="index">
						<p class="_title">{{ item.title }}</p>
						<p class="_value">{{ item.value || '暂无数据' }}</p>
					</li>
				</ul>
			</li>
			<template v-if="!isMobile">
				<li class="item float-left" v-for="(item, index) in data.volume" :key="item.id">
					<router-link :to="item.path">
						<!-- echart -->
						<canvas :id="`info-${index + 1}`" width="160" height="160"></canvas>
						<p class="data">{{ item.data }}</p>
						<p class="title">{{ item.title }}</p>
					</router-link>
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
// api
import { getSystemInfo } from '@api/home';
import { circle_canvas, component_percent } from '@utils/public';
import { mapState } from 'vuex';
export default {
	name: 'system',
	data() {
		return {
			loading: false
		};
	},
	computed: {
		...mapState(['isMobile']),
		data() {
			return {
				info: [
					{
						title: this.$t('home.system.title1'),
						value: ''
					},
					{
						title: this.$t('home.system.title2'),
						value: ''
					},
					// {
					// 	title: this.$t("home.system.title3"),
					// 	value: ""
					// },
					{
						title: this.$t('home.system.title4'),
						value: ''
					},
					{
						title: this.$t('home.system.title5'),
						value: ''
					},
					{
						title: this.$t('home.system.title6'),
						value: ''
					}
				],
				volume: [
					{
						id: 0,
						path: '/',
						data: 0,
						total: 0,
						title: this.$t('home.diskOccupiedByTheSystem')
					},
					{
						id: 1,
						path: '/',
						data: 0,
						total: 0,
						title: this.$t('home.diskOccupiedBySystemLog')
					},
					{
						id: 2,
						path: '/',
						data: 0,
						total: 0,
						title: this.$t('home.diskOccupiedByDataBackup')
					}
				]
			};
		}
	},
	mounted() {
		// init
		this.$nextTick(() => {
			this.getData();
		});
	},
	methods: {
		getData: async function() {
			this.loading = true;
			try {
				const res = await getSystemInfo();
				const respon = res.result;
				this.data.info[0].value = respon.sys.os; // 操作系统
				// this.data.info[1].value = respon.customInfo.username; // 用户名
				// this.data.info[2].value = respon.customInfo.runEnvironment; // 服务器环境
				// this.data.info[3].value = respon.customInfo.javaVersion; // java版本
				// this.data.info[4].value = respon.customInfo.serviceEnvironment; // 运行环境
				// 内存
				let the_free = respon.disk.available;
				let the_max = respon.disk.maxMemory;
				let the_total = respon.disk.total;
				let the_used = respon.disk.used;
				// 已分配未使用
				this.data.volume[0].data = parseFloat(the_free);
				this.data.volume[0].total = parseFloat(the_total);
				// 已分配已使用
				this.data.volume[1].data = parseFloat(the_used);
				this.data.volume[1].total = parseFloat(the_total);
				// 最大可用内存
				this.data.volume[2].data = parseFloat(the_total);
				this.data.volume[2].total = parseFloat(the_total);
				this.system_canvas();
				this.loading = false;
			} catch (err) {
				this.loading = false;
			}
		},
		//服务器信息canvas
		system_canvas: function() {
			const colors = ['#1CD5AB', '#F44328', '#2BB3FF'];
			for (let i = 0; i < colors.length; i++) {
				let { data, total } = this.data.volume[i];
				circle_canvas(document.getElementById(`info-${i + 1}`), component_percent(data, total), colors[i], '#F5F6FF');
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#system {
	width: 100%;
	height: 340px;
	border: 1px solid #edeef1;
	margin-top: 0.875rem;
	background: #fff;
	.list {
		width: 100%;
		height: 200px;
		margin-top: 50px;
		padding: 0 20px;
		.item {
			width: 23%;
			height: 100%;
			text-align: center;
			position: relative;
			&::after {
				content: '';
				display: block;
				width: 1px;
				height: 100px;
				background: #edeef1;
				position: absolute;
				top: 50%;
				right: 0;
				transform: translateY(-50%);
			}
			&:first-of-type {
				width: 31%;
				&::after {
					display: none;
				}
			}
			&:last-of-type {
				&::after {
					display: none;
				}
			}
			._list {
				width: 100%;
				height: 100%;
				border: 1px solid #edeef1;
				border-radius: 6px;
				border-bottom: none;
				// overflow: hidden;
				._item {
					width: 100%;
					height: 20%;
					border-bottom: 1px solid #edeef1;
					._title,
					._value {
						display: inline-flex;
						align-items: center;
						height: 100%;
						font-size: 14px;
						text-align: left;
						padding: 0 10px;
						color: #5a5b64;
						&._title {
							width: 30%;
							border-right: 1px solid #edeef1;
						}
						&._value {
							width: 70%;
						}
					}
					&:first-of-type {
						height: 25%;
						._value {
							font-size: 12px;
						}
					}
					&:last-of-type {
						._title {
							border-bottom-left-radius: 6px;
						}
						._value {
							border-bottom-right-radius: 6px;
						}
					}
				}
			}
			#info-1,
			#info-2,
			#info-3 {
				width: 140px;
				height: 140px;
				position: absolute;
				top: 45%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.data {
				position: absolute;
				top: 45%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 30px;
				color: @black;
			}
			.title {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				white-space: nowrap;
				bottom: 5%;
				font-size: 16px;
				color: #5a5b64;
			}
		}
	}
	&.mobile {
		height: auto;
		.list {
			height: auto;
			margin: 20px 0;
			padding: 0 10px;
			.item {
				width: 100%;
				float: inherit;
				._list {
					overflow: hidden;
					border-radius: 4px;
					._item {
						display: flex;
						align-items: center;
						min-height: 40px;
						._title,
						._value {
							min-height: 100%;
						}
					}
				}
			}
		}
	}
}
</style>
