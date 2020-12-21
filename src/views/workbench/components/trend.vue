<template>
	<div id="trend" :class="{ mobile: isMobile }">
		<div class="title-box">
			<span class="title float-left">{{ $t('home.trend') }}</span>
			<p class="date">{{ $t('home.QueryTime') }}：{{ startDate }} {{ $t('base.to') }} {{ endDate }}</p>
		</div>
		<!-- content -->
		<div class="echarts" v-loading="loading">
			<span class="no-data" v-show="!data[0]">{{ $t('base.noData') }}</span>
			<div id="echart-bar" :class="{ canShow: data[0] }"></div>
		</div>
	</div>
</template>

<script>
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts');
// 引入折线图
require('echarts/lib/chart/line');
// 引入提示框
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
// api
import { getTrend } from '@api/mock';
import { mapState } from 'vuex';
export default {
	name: 'trend',
	data() {
		return {
			// 查询时间
			startDate: '',
			endDate: '',
			loading: false,
			data: []
		};
	},
	watch: {
		listenMenuCollapse() {
			// 动态变化canvas宽度
			setTimeout(function() {
				echarts.init(document.getElementById('echart-bar')).resize();
			}, 500);
		},
		listenContentWidthType() {
			// 动态变化canvas宽度
			setTimeout(function() {
				echarts.init(document.getElementById('echart-bar')).resize();
			}, 500);
		},
		listenMenuType() {
			// 动态变化canvas宽度
			setTimeout(function() {
				echarts.init(document.getElementById('echart-bar')).resize();
			}, 500);
		},
		trend_title() {
			let chart = echarts.init(document.getElementById('echart-bar'));
			chart.clear();
			this.the_chart();
		}
	},
	computed: {
		...mapState(['isMobile', 'siteSetting']),
		// 菜单是否收起
		listenMenuCollapse() {
			return this.siteSetting.menuCollapse;
		},
		// 菜单模式
		listenMenuType() {
			return this.siteSetting.menuType;
		},
		// 页面宽度
		listenContentWidthType() {
			return this.siteSetting.contentWidthType;
		}
	},
	created: function() {
		// 报考趋势时间范围(当前月份)
		this.scope();
	},
	mounted() {
		// init
		this.$nextTick(() => {
			this.get_trend();
		});
	},
	methods: {
		get_trend: async function() {
			this.loading = true;
			let data = {
				timeType: 'custom',
				rangeStartTime: this.startDate,
				rangeEndTime: this.endDate
			};
			try {
				const res = await getTrend(data);
				const respon = res.result || [];
				this.data = respon;
				this.the_chart();
				this.loading = false;
			} catch (err) {
				this.loading = false;
			}
		},
		// 趋势echart
		the_chart: function() {
			let myChart = echarts.init(document.getElementById('echart-bar')); // 初始化echarts实例
			const that = this;
			let data1 = []; // 作品
			let data2 = []; // 文档
			let data3 = []; // 艺术家
			let data4 = []; // 专题
			let data5 = []; // 展厅
			let dates = [];
			let list = JSON.parse(JSON.stringify(that.data));
			list.map(item => {
				data1.push(item.workCount);
				data2.push(item.documentCount);
				data3.push(item.artistCount);
				data4.push(item.topicCount);
				data5.push(item.exhibitionCount);
				dates.push(item.time);
			});
			/* 图表配置 */
			myChart.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['作品', '文档', '艺术家', '专题', '展厅']
				},
				grid: {
					left: '1%',
					right: '1%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					axisTick: {
						show: false
					},
					data: dates
				},
				yAxis: {
					type: 'value',
					axisTick: {
						show: false
					},
					minInterval: 1,
					splitLine: {
						lineStyle: {
							type: 'dotted'
						}
					}
				},
				series: [
					{
						name: '作品',
						type: 'line',
						symbolSize: 7, //拐点圆的大小
						data: data1,
						smooth: 0.1, // 折线弧度
						itemStyle: {
							normal: {
								color: '#4771FF',
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					},
					{
						name: '艺术家',
						type: 'line',
						symbolSize: 7, //拐点圆的大小
						data: data2,
						smooth: 0.1, // 折线弧度
						itemStyle: {
							normal: {
								color: '#f3566f',
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					},
					{
						name: '文档',
						type: 'line',
						symbolSize: 7, //拐点圆的大小
						data: data3,
						smooth: 0.1, // 折线弧度
						itemStyle: {
							normal: {
								color: '#da70d6',
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					},
					{
						name: '专题',
						type: 'line',
						symbolSize: 7, //拐点圆的大小
						data: data4,
						smooth: 0.1, // 折线弧度
						itemStyle: {
							normal: {
								color: '#87cefa',
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					},
					{
						name: '展厅',
						type: 'line',
						symbolSize: 7, //拐点圆的大小
						data: data5,
						smooth: 0.1, // 折线弧度
						itemStyle: {
							normal: {
								color: '#ff7f50',
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					}
				]
			});
			let timer = null;
			window.addEventListener('resize', function() {
				// 防抖处理
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(function() {
					myChart.resize();
				}, 200);
			});
		},
		// 报考趋势时间范围(当前月份)
		scope: function() {
			let now = new Date();
			let lastMonth = now.getTime() - 1000 * 60 * 60 * 24 * 30; // 往前推30天
			// 赋值
			this.startDate = this.$moment(lastMonth).format('YYYY-MM-DD');
			this.endDate = this.$moment(now).format('YYYY-MM-DD');
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#trend {
	width: 100%;
	height: 400px;
	border: 1px solid #edeef1;
	margin-top: 0.875rem;
	background: #fff;
	.echarts {
		width: 100%;
		height: calc(~'100% - 40px - 10px');
		position: relative;
		margin-top: 10px;
		.no-data {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 12px;
			color: @grey;
		}
		#echart-bar {
			width: 100%;
			height: 350px;
			opacity: 0;
			&.canShow {
				opacity: 1;
			}
		}
	}
}
</style>
