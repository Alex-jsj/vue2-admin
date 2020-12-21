<template>
	<div id="myTable">
		<!-- 筛选组件 -->
		<filterGroup
			v-if="!otherConfig.hiddenFilter"
			:filterList="filterConfig.filter_list"
			:search_list="filterConfig.search_list"
			v-on="{ getFilterData: filterData }"
		></filterGroup>
		<!-- 表格上方按钮 -->
		<div class="piliang">
			<router-link class="btn-link" v-for="item in topBtnConfig" :key="item.title" :to="item.jumpPage ? item.jumpAddress : ''">
				<!-- 跳转页面按钮 -->
				<el-button :type="item.hasOwnProperty('type') ? item.type : 'primary'" :plain="item.plain" :icon="item.icon" v-if="item.jumpPage">
					{{ item.title }}
				</el-button>
				<!-- 自定义按钮 -->
				<el-button type="primary" :icon="item.icon" v-else-if="item.custom" @click="customEmit(item.emitName)">{{ item.title }}</el-button>
				<!-- 默认新增按钮 -->
				<el-button type="primary" :icon="item.icon" v-else @click="createOrUpdate()">{{ item.title }}</el-button>
			</router-link>
			<!-- 更新数据 -->
			<el-button :class="isMobile ? 'float-left' : 'float-right'" @click="getData(true)" icon="el-icon-refresh" :loading="loading">
				{{ $t('table.update') }}
			</el-button>
			<!-- 自定义显示 -->
			<customDisplay
				class="float-right"
				v-if="!isMobile"
				:customDisplayList="customArr"
				v-on="{ update_custom_display: updateCustomDisplay }"
			></customDisplay>
		</div>
		<!--主体内容区，展示表格内容-->
		<el-table
			ref="table"
			class="baseTable"
			border
			v-loading="loading"
			tooltip-effect="dark"
			:data="tableData"
			:row-key="treeTable.open ? otherConfig.rowKey : ''"
			:tree-props="treeTable.treeProps"
			:default-expand-all="treeTable.defaultExpandAll"
			@current-change="_handleCurrentChange"
			@selection-change="handleSelectionChange"
		>
			<!-- 多选列 -->
			<el-table-column type="selection" width="40" v-if="otherConfig.needSelect"></el-table-column>
			<!-- 自定义展示区 -->
			<el-table-column
				v-for="(item, index) in tableColumnConfig"
				:key="index"
				:prop="item.prop"
				:label="item.label"
				:width="item.width ? item.width : ''"
				:min-width="item.minWidth ? item.minWidth : ''"
				:max-width="item.maxWidth ? item.maxWidth : ''"
				:sortable="item.sortable ? true : false"
			>
				<template slot-scope="scope">
					<Cell v-if="item.render" :row="scope.row" :column="item" :index="scope.$index" :render="item.render"></Cell>
					<span v-else>{{ scope.row[item.prop] }}</span>
				</template>
			</el-table-column>
			<el-table-column
				:label="$t('table.operate')"
				v-if="tableBtnConfig.width"
				:width="tableBtnConfig.width"
				:fixed="isMobile ? false : 'right'"
				class-name="btns"
			>
				<template slot-scope="scope">
					<!--扩展按钮-->
					<el-button
						type="text"
						:style="`color:${item.color || ''}`"
						v-for="(item, index) in tableBtnConfig.expands"
						:key="index"
						@click="handleEmit(item.emitName, scope.row, scope.$index)"
						:disabled="scope.row.hasOwnProperty(item.disabledField) && scope.row[item.disabledField] !== item.disabledValue"
					>
						{{ item.name }}
					</el-button>
					<!-- 编辑 -->
					<el-button
						type="text"
						:style="
							`color:${
								tableBtnConfig.editBtnConfig.hasOwnProperty('disabledField') &&
								scope.row[tableBtnConfig.editBtnConfig.disabledField] === tableBtnConfig.editBtnConfig.disabledValue
									? '#bbb'
									: '#E6A23C'
							}`
						"
						:disabled="
							tableBtnConfig.editBtnConfig.hasOwnProperty('disabledField') &&
								scope.row[tableBtnConfig.editBtnConfig.disabledField] === tableBtnConfig.editBtnConfig.disabledValue
						"
						v-if="tableBtnConfig.editBtnConfig.show && !tableBtnConfig.editBtnConfig.isToEditPage"
						@click="createOrUpdate(scope.row, scope.$index)"
						:loading="scope.row.editBtnLoading"
					>
						{{ $t('table.edit') }}
					</el-button>
					<!-- 编辑 跳转到编辑页面 -->
					<el-button
						type="text"
						:style="
							`color:${
								tableBtnConfig.editBtnConfig.hasOwnProperty('disabledField') &&
								scope.row[tableBtnConfig.editBtnConfig.disabledField] === tableBtnConfig.editBtnConfig.disabledValue
									? '#bbb'
									: '#E6A23C'
							}`
						"
						:disabled="
							tableBtnConfig.editBtnConfig.hasOwnProperty('disabledField') &&
								scope.row[tableBtnConfig.editBtnConfig.disabledField] === tableBtnConfig.editBtnConfig.disabledValue
						"
						v-else-if="tableBtnConfig.editBtnConfig.show && tableBtnConfig.editBtnConfig.isToEditPage"
						@click="$router.push({ path: tableBtnConfig.editBtnConfig.pageAddress, query: { editId: scope.row.id } })"
					>
						{{ $t('table.edit') }}
					</el-button>
					<!-- 删除 -->
					<el-button
						type="text"
						v-if="tableBtnConfig.delete"
						:disabled="
							tableBtnConfig.hasOwnProperty('deleteDisabledField') &&
								scope.row[tableBtnConfig.deleteDisabledField] === tableBtnConfig.deleteDisabledValue
						"
						@click.native="deleteItem(scope.row.id)"
						:style="
							`color:${
								tableBtnConfig.hasOwnProperty('deleteDisabledField') &&
								scope.row[tableBtnConfig.deleteDisabledField] === tableBtnConfig.deleteDisabledValue
									? '#bbb'
									: '#F56C6C'
							}`
						"
					>
						{{ $t('table.delete') }}
					</el-button>
					<!-- 放置于更多操作下拉框中的按钮 -->
					<el-dropdown @command="dropdownCommand" v-if="tableBtnConfig.moreOperate && tableBtnConfig.moreOperate[0]">
						<el-button type="text">
							{{ $t('table.moreOperate') }}
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								v-for="(item, index) in tableBtnConfig.moreOperate"
								:key="index"
								:command="composeValue(item.emitName, scope.row, scope.$index)"
								:disabled="scope.row[item.disabledField] != item.disabledValue"
							>
								{{ item.name }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<!-- 表格下方操作按钮 -->
		<div class="table-control-box">
			<div style="display:inline-block;" v-if="!isMobile">
				<!-- 全选 -->
				<el-button v-if="otherConfig.needSelect" type="info" @click="toggleSelection(tableData)">{{ $t('table.selectAll') }}</el-button>
				<!-- 批量删除 -->
				<el-button v-if="bottomBtnConfig.batchDelete" :disabled="multipleSelection.length < 1" type="info" @click="batchDeleteConfirm()">
					{{ $t('table.deleteInBatches') }}
				</el-button>
				<!-- 自定义扩展按钮 -->
				<el-button
					v-for="(item, index) in bottomBtnConfig.extends"
					:key="index"
					type="info"
					:disabled="multipleSelection.length < 1"
					@click="handleEmit(item.emitName, multipleSelection, 'batch')"
				>
					{{ item.title }}
				</el-button>
			</div>
			<!-- 分页组件 -->
			<pagination
				v-if="!otherConfig.hiddenPages"
				class="float-right"
				:currentPaging="currentPaging"
				v-on="{ sizeChange: handleSizeChange, currentChange: handleCurrentChange }"
			></pagination>
		</div>
		<!--按钮触发的表单弹窗-->
		<BaseDialogForm
			ref="dialogForm"
			:title="dialogTitle"
			:width="formWidth"
			:labelWidth="formLabelWidth"
			:config="formConfig"
			:form-data="formModel"
			:err-form="formError"
			:is-edit="isEdit"
			:dialogFormLoading.sync="dialogFormLoading"
			:dialogFormVisible.sync="dialogFormVisible"
			@submit="dialogSubmit"
			@resetFormModel="my_initFormModel"
		/>
	</div>
</template>

<script>
import { verifyPsd } from '@api/login';
import { md5Psd } from '@utils/public';
import Cell from './expand';
import baseForm from './mixins/baseForm'; // 表单组件混入部分
import bottomTableConfig from './mixins/bottomTableConfig'; // 表格下方功能区域混入部分
import pagination from './mixins/pagination'; // 分页混入部分
import custom from './mixins/custom'; // 自定义显示组件混入部分
import tableFilter from './mixins/filter'; // 表格上方筛选混入部分
import { mapState } from 'vuex';

export default {
	name: 'base-table',
	data() {
		return {
			loading: false, //  表格加载状态
			tableData: [], // 表格展示数据
			tableColumnConfig: [], // 经过自定义显示组件格式化之后的表格列数据
			multipleSelection: [], // 表格多选数组
			allSelect: false // 全选数据容器
		};
	},
	mixins: [baseForm, bottomTableConfig, custom, tableFilter, pagination],
	props: {
		start_time: {
			type: String // 开始时间
		},
		end_time: {
			type: String // 结束时间
		},
		tableConfig: {
			type: Array,
			default: () => []
		}, // 表格展示数据配置
		tableBtnConfig: {
			type: Object,
			default: () => {
				return {
					editBtnConfig: {
						dataFromInterface: false // 编辑数据是否从接口获取
					}
				};
			}
		}, // 表格内部按钮配置
		theApi: {}, // 数据接口
		otherConfig: {
			type: Object,
			default: () => {}
		}, // 其他表格配置
		topBtnConfig: {
			type: Array,
			default: () => []
		}, // 表格上方按钮配置
		treeTable: {
			type: Object,
			default: () => {
				return {
					open: false,
					treeProps: {},
					defaultExpandAll: true
				};
			}
		}
	},
	components: {
		Cell
	},
	computed: {
		...mapState(['isMobile', 'login']),
		/* 表格刷新控制 */
		refreshTable: {
			get: function() {
				return this.otherConfig.needRef;
			},
			set: function(val) {
				this.$emit('changeNeedRef', val);
			}
		}
	},
	watch: {
		/* 监听外部是否需要刷新表格 */
		refreshTable(val) {
			if (val) {
				this.getData();
				this.refreshTable = false;
			}
		}
	},
	created() {
		this.getData(); // 从接口获取表格数据
	},
	methods: {
		// 获取列表数据
		getData: async function(update = false) {
			this.loading = true;
			const {
				formatData,
				additionalField = '', // 额外的请求参数
				dataFieldUrl // 接口结构
			} = this.otherConfig; // 接口数据配置

			// 默认数据
			let default_data = {
				pageNo: this.currentPaging.currentPage,
				pageSize: this.currentPaging.pageSize
			};
			additionalField && Object.assign(default_data, JSON.parse(additionalField));
			// 筛选数据
			let data = Object.assign(default_data, this.filter_data);
			// 设置查询时间范围
			if (this.start_time) {
				Object.assign(data, { rangeStartTime: this.start_time, rangeEndTime: this.end_time });
			}
			try {
				const res = await this.theApi.getData(data);
				if (res.code === 200) {
					const respon = res.result || {};
					if (dataFieldUrl) {
						this.tableData = this.forMateList(respon[dataFieldUrl] || []); // 给表格赋值
					} else {
						this.tableData = this.forMateList(respon || []); // 给表格赋值
					}
					/* 格式化数据 */
					if (formatData) {
						this.tableData = formatData(this.tableData);
					}
					this.dataFix(this.tableData); // 数据兜底处理
					// this.currentPaging.totals = respon.total || 0; // 数据总条数
					this.currentPaging.totals = 8; // 数据总条数
					update && this.$message.success('数据已更新');
				}
				this.loading = false;
			} catch (err) {
				this.loading = false;
			}
		},
		// 给表格数据循环添加loading字段，用来在点击编辑获取数据的时候给编辑按钮展示loading状态
		forMateList: function(list = []) {
			list.forEach(item => {
				item.editBtnLoading = false;
			});
			return list;
		},
		// 新增 编辑按钮
		createOrUpdate(item, idx) {
			if (item && this.tableBtnConfig.editBtnConfig.dataFromInterface) {
				// 从接口获取数据
				this.getEditData(item, idx, () => {
					this.dialogFormVisible = true; // 打开弹框
					this.isEdit = true;
				});
			} else if (item && !this.tableBtnConfig.editBtnConfig.dataFromInterface) {
				// 从表格获取数据
				this.formModel = Object.assign({}, item);
				this.dialogFormVisible = true; // 打开弹框
				this.isEdit = true;
			} else {
				this.dialogFormVisible = true;
				this.isEdit = false;
			}
			this.dialogTitle = (item ? '编辑' : '添加') + this.formTitle;
		},
		// 从后台获取编辑框需要的数据，表格只用作展示作用，所以不从表格内获取数据
		getEditData: async function(item, idx, callback) {
			this.tableBtnConfig.width += 15; // 增加操作按钮区域的宽度，放置loading的时候按钮掉下来
			this.tableData[idx].editBtnLoading = true; // 编辑按钮loading
			try {
				const res = await this.theApi.getDetail({ id: item.id });
				const respon = res.result || {};
				this.formModel = Object.assign({}, respon);
				this.tableData[idx].editBtnLoading = false; // 编辑按钮loading
				this.tableBtnConfig.width -= 15;
				callback && callback();
			} catch (err) {
				this.tableBtnConfig.width -= 15;
				this.tableData[idx].editBtnLoading = false; // 编辑按钮loading
			}
		},
		// 处理相应父组件的事件方法
		handleEmit(emitName, row, idx) {
			this.$emit(emitName, row, idx);
		},
		// 更多操作按钮绑定的事件
		dropdownCommand: function(command) {
			const { emitName, row, idx } = command;
			this.$emit(emitName, row, idx);
		},
		// 给el-dropdown添加自定义的参数
		composeValue(emitName, row, idx) {
			return {
				emitName,
				row,
				idx
			};
		},
		// 上层按钮 自定义事件
		customEmit(emitName) {
			this.$emit(emitName, this.tableData, this.multipleSelection);
		},
		// 删除
		deleteItem: function(id) {
			const con = this.tableBtnConfig.deleteConfirm; // 是否需要密码确认
			if (con) {
				this.$prompt('为确保数据安全,请输入您的登录密码以确认删除操作', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^[0-9a-zA-Z_@.]{5,20}$/,
					inputErrorMessage: '密码格式不正确',
					type: 'warning'
				})
					.then(({ value }) => {
						verifyPsd({ password: md5Psd(this.login.account, value) }).then(res => {
							if (res.code === 200) {
								//ajax
								this.theApi.deleteItem({ id }).then(() => {
									if (res.code === 200) {
										this.$message.success('删除成功');
										// 刷新数据
										this.getData();
									}
								});
							}
						});
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				this.$confirm('是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						//ajax
						this.theApi.deleteItem({ id }).then(res => {
							if (res.code === 200) {
								this.$message.success('删除成功');
								// 刷新数据
								this.getData();
							}
						});
					})
					.catch(action => {
						this.$message.info('取消删除');
					});
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@assets/css/mixin.less';
.baseTable {
	width: 100%;
	margin-bottom: 0.55rem;
	/deep/ thead {
		th {
			background: lighten(#ebeef5, 3%);
			color: #333;
			font-size: 14px;
		}
	}
}
.table-control-box {
	overflow: hidden;
}
.piliang {
	position: relative;
	&::after {
		.clear;
	}
	.btn-link {
		margin-right: 10px;
		float: left;
	}
	.el-button {
		margin-left: 0;
		margin-bottom: 10px;
	}
}
.table-btn-icon {
	font-size: 12px;
}
.icon-text {
	i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		margin-right: 5px;
	}
}
.table-img-container {
	width: 125px;
	height: 125px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid transparent;
	&:hover {
		border: 1px solid @blue;
	}
	.table-image {
		width: 100%;
	}
}
.accessory-download-link {
	color: @blue;
	.icon-download {
		margin-right: 2px;
	}
	&:hover {
		text-decoration: underline;
	}
}
/deep/.btns {
	.cell {
		padding-right: 0;
		.el-button + .el-button {
			margin-left: 0;
		}
		.el-button {
			&::after {
				content: '|';
				margin: 0 3px;
				color: #c0c4cc;
			}
			&:last-child {
				&::after {
					display: none;
				}
			}
		}
	}
	.el-dropdown {
		.el-button {
			&::after {
				display: none;
			}
			.el-icon--right {
				margin-left: 0;
			}
		}
	}
}
</style>
