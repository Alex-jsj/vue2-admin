<template>
	<div id="filterGroup">
		<div class="filter-container" :class="{ opened: open, big: open_btn_show, mobile: isMobile }">
			<el-form :inline="isMobile ? false : true" id="formBox" ref="filterForm">
				<el-form-item label="关键字:" v-if="filterOptions.search">
					<el-input
						v-popover:popover
						v-model="filterData.keyword"
						@keyup.enter.native="getFilterData()"
						placeholder="请输入关键字"
						clearable
					></el-input>
					<el-popover ref="popover" @show="$_getSearchHistory" placement="bottom-start" width="300" trigger="click" popper-class="search-popover">
						<div>
							<div v-if="search_list[0]">
								<p class="popover-title">选择需要搜索的字段</p>
								<div class="_popover-list">
									<el-radio-group class="_popover-item" v-model="search_radio">
										<el-radio class="_popover-item-item" v-for="(item, index) in search_list" :key="index" :label="item.field">
											{{ item.label }}
										</el-radio>
									</el-radio-group>
								</div>
							</div>
							<span v-else>暂无可搜索项</span>
						</div>
						<div class="search-history" v-if="searchHistoryList[0]">
							<p class="history-title">
								<span class="history-text">- 搜索历史 -</span>
								<i class="iconfont icon-delete" @click="$_clearHistory"></i>
							</p>
							<ul class="history-list">
								<li class="history-item" v-for="(item, index) in searchHistoryList" :key="index">
									<span class="history-text" @click="$_handleClickHistory(index)">{{ item }}</span>
									<i class="iconfont icon-close" @click="$_remoteHistoryItem(index)"></i>
								</li>
							</ul>
						</div>
					</el-popover>
				</el-form-item>
				<el-form-item label="操作人:" v-if="filterOptions.operation">
					<el-select v-model="filterData.operation" filterable clearable>
						<el-option v-for="(item, index) in operationList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用户:" v-if="filterOptions.user">
					<el-select v-model="filterData.user" filterable clearable>
						<el-option v-for="(item, index) in userList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="事件:" v-if="filterOptions.event">
					<el-select v-model="filterData.event" filterable clearable>
						<el-option v-for="(item, index) in eventList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核状态:" v-if="filterOptions.examineType">
					<el-select v-model="filterData.examineType" filterable clearable>
						<el-option v-for="(item, index) in examineTypeList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="定稿状态:" v-if="filterOptions.draftType">
					<el-select v-model="filterData.draftType" filterable clearable>
						<el-option v-for="(item, index) in draftTypeList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号状态:" v-if="filterOptions.userState">
					<el-select v-model="filterData.userState" filterable clearable>
						<el-option v-for="(item, index) in userStateList" :key="index.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="权限组:" v-if="filterOptions.permissionGroup">
					<el-cascader
						v-model="filterData.permissionGroup"
						:options="permissionList"
						:props="permissionProps"
						:show-all-levels="false"
						filterable
						clearable
						style="width:100%;"
					></el-cascader>
				</el-form-item>
				<el-form-item :class="{ 'mobile-btn': isMobile, btn: open_btn_show }">
					<el-button :type="isMobile ? 'text' : 'primary'" @click="getFilterData()">查 询</el-button>
					<el-button
						v-if="open_btn_show"
						:type="isMobile ? 'text' : 'primary'"
						plain
						@click="
							open = !open;
							btn_text = !open ? '展开' : '收起';
						"
						:icon="!open ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
					>
						{{ btn_text }}
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 筛选结果项 -->
		<div class="filter-result-container" v-if="filter_arr[0]">
			<ul class="list">
				<li class="item filter-text">
					<i class="iconfont icon-filter"></i>
					<span>检索项：</span>
				</li>
				<li class="item" v-for="item in filter_arr" :key="item.key">
					<el-tag :closable="canClearFilter !== false" size="small" type="primary" class="tag" @close="$_closeTag(item)">
						{{ `${item.title} : ${item.value}` }}
					</el-tag>
				</li>
				<li class="item filter-text clearAll" @click="$_closeAllTag" v-if="showClearAllBtn !== false">清空</li>
			</ul>
		</div>
	</div>
</template>

<script>
import jumpWithParams from './mixins/jumpWithParams'; // 带参数的跳转，进行主动筛选
import matchDictionary from './mixins/matchDictionary'; // 展示已筛选项
import siteSetting from './mixins/siteSetting'; // 站点设置匹配
import options from './mixins/options'; // 筛选选项
import search_history from './mixins/search_history'; // 搜索历史
import { mapState } from 'vuex';
import { isEmpty } from '@utils/public'; // 公用函数

export default {
	// 筛选项组件
	name: 'filterGroup',
	data() {
		return {
			search_radio: null, // 关键字搜索指定要搜索的字段
			open: false, // btn
			btn_text: '展开', // btn
			open_btn_show: false, // btn
			filterOptions: {}, // 映射表
			filterData: {} // 点击查询之后传到父级的筛选项数据
		};
	},
	mixins: [jumpWithParams, matchDictionary, siteSetting, options, search_history],
	props: {
		// 筛选项配置 外部传入
		filterList: Array,
		search_list: Array, // 搜索框支持的搜索项
		showClearAllBtn: {
			type: Boolean,
			default: true
		}, // 是否显示清空按钮
		canClearFilter: {
			type: Boolean,
			default: true
		} // 是否能清除单个筛选
	},
	computed: {
		...mapState(['isMobile'])
	},
	watch: {
		search_radio(newVal, oldVal) {
			// 防止bug
			if (this.filterData[oldVal]) {
				delete this.filterData[oldVal];
			}
		}
	},
	created: function() {
		this.init();
	},
	mounted: function() {
		this.showBtn(this.$_activeScreening());
	},
	methods: {
		// 初始化
		init: function() {
			// 默认选中第一个筛选项
			if (this.search_list.length > 0) {
				this.search_radio = this.search_list[0].field;
			}
			// 匹配显示
			this.filterList.map(item => {
				this.filterOptions[item] = true;
			});
		},
		// 判断是否需要显示展开收起按钮
		showBtn: function(callback) {
			if (this.isMobile) {
				// 移动端根据选项的数量来决定是否需要展示展开收起按钮
				let filterItemLength = Object.keys(this.filterOptions).length;
				this.open_btn_show = filterItemLength > 1 ? true : false;
			} else {
				// 加上300的延时 因为css切换的过渡时间是.3s
				setTimeout(() => {
					const formContainer = document.getElementById('formBox');
					this.open_btn_show = formContainer.clientHeight > 50 ? true : false;
					// 回调函数
					callback && callback();
				}, 310);
			}
		},
		// 显示级联选择器选中的值
		show_cascader_text: function(name) {
			let treeArr = this[`${name}List`];
			let id = this.filterData[name];
			let str = '';
			function dg(arr) {
				arr.forEach(item => {
					if (item.id === id) {
						str = item.name || item.title;
					} else if (item.hasOwnProperty('children')) {
						dg(item.children);
					}
				});
			}
			dg(treeArr);
			return str;
		},
		// 传递筛选数据
		getFilterData() {
			let obj = JSON.parse(JSON.stringify(this.filterData));
			for (let key in obj) {
				if (isEmpty(obj[key])) {
					delete obj[key];
				} else if (key === 'keyword') {
					// 如果有关键字搜索则存入本地历史搜索
					this.$_saveHistory(obj[key]);
					obj[this.search_radio] = `*${obj[key].trim()}*`; // 需要去除前后的空格 模糊搜索
				} else {
					// 根据后台需求，时间范围拆分成两个字段
					switch (key) {
						case 'date_scope':
							{
								const [start_time, end_time] = obj[key];
								Object.assign(obj, { start_time }, { end_time });
							}
							break;
						default:
					}
				}
			}
			this.$emit('getFilterData', obj);
			this.$_initFilter(obj);
		}
	}
};
</script>
<style lang="less" scoped>
@import '~@assets/css/mixin.less';
#filterGroup {
	width: 100%;
	background: #fff;
	margin-bottom: 0.55rem;
	/deep/.filter-container {
		width: 100%;
		height: 30px;
		overflow: hidden;
		position: relative;
		background: #fff;

		#formBox {
			overflow: hidden;

			&.el-form--inline {
				.el-form-item {
					float: left;
					margin-bottom: 0;
					height: 30px;
					margin-bottom: 5px;
					.el-form-item__label,
					.el-form-item__content {
						float: left;
					}

					&.date-filter {
						.el-form-item__content {
							width: auto;
						}
					}
				}

				.el-form-item__content {
					vertical-align: middle;
					// width: 140px;
				}
			}

			.btn {
				position: absolute;
				top: 0;
				right: 0;
				margin-right: 0;

				.el-form-item__content {
					width: auto;
				}
			}
		}

		&.big {
			padding-right: 150px;
		}

		&.opened {
			height: auto;
		}
		&.mobile {
			height: auto;
			padding-right: 0;
			&.opened {
				#formBox {
					height: auto;
				}
			}
			#formBox {
				height: 60px;
				.el-form-item {
					float: inherit;
					width: 100%;
					height: 60px;
					margin-bottom: 0;
					.el-form-item__label,
					.el-form-item__content {
						float: inherit;
					}
					.el-input__inner {
						width: 100%;
					}
					.el-form-item__content {
						width: 100%;
						.el-select {
							width: 100%;
						}
					}
				}
				.mobile-btn {
					position: absolute;
					top: 0;
					right: 0;
					height: 30px;
					text-align: right;
					.el-button {
						border: none;
					}
				}
			}
		}
	}
	.filter-result-container {
		width: 100%;
		min-height: 36px;
		margin-top: 0.3rem;

		.list {
			width: 100%;
			height: 100%;
			padding: 0 3px 3px 3px; // border: 1px solid #dcdfe6;
			border-radius: 4px;
			margin-top: 6px;
			overflow: hidden;

			.item {
				float: left;
				margin-right: 3px;
				margin-top: 3px;

				&:last-of-type {
					margin-right: 0;
				}

				.tag {
					display: block;
				}

				&.filter-text {
					font-size: 14px;
					color: teal;
					height: 24px;
					line-height: 22px;
				}

				&.clearAll {
					cursor: pointer;
					margin-left: 6px;
					color: #888;
					font-size: 12px;
				}
			}
		}
	}
}
/* 搜索框提示popover */
.search-popover {
	.popover-title {
		color: #333;
		font-weight: 600;
		margin-bottom: 10px;
		font-size: 14px;
	}
	._popover-list {
		._popover-item {
			color: #aaa;
			font-size: 14px;
			position: relative;
			width: 100%;
			._popover-item-item {
				width: 100%;
				display: block;
				height: 24px;
				line-height: 24px;
				padding: 0 8px;
				&:hover {
					background: #f5f5f5;
				}
			}
		}
	}
	.search-history {
		border-top: 1px solid @grey;
		margin-top: 10px;
		padding: 10px 0;

		.history-title {
			margin-bottom: 10px;
			overflow: hidden;

			.history-text {
				float: left;
				font-weight: 600;
			}

			.icon-delete {
				float: right;
				cursor: pointer;

				&:hover {
					color: @blue;
				}
			}
		}

		.history-list {
			.history-item {
				color: #999;
				font-size: 13px;
				line-height: 24px;
				height: 24px;
				position: relative;
				font-weight: 500;
				padding: 0 8px;
				cursor: pointer;
				&:hover {
					background: #f5f5f5;

					.icon-close {
						display: block;
					}
				}

				.history-text {
					float: left;
					width: 240px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.icon-close {
					font-size: 12px;
					float: right;
					display: none;

					&:hover {
						color: @blue;
					}
				}
			}
		}
	}
}
</style>
