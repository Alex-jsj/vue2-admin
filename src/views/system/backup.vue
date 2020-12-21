<template>
    <div :class="{'mobile':isMobile}">
        <el-tag
            type="warning"
            size="small"
            style="margin-bottom:10px;"
        >数据备份操作在服务器端操作，此处仅展示备份信息。</el-tag>
        <br />
        <el-tag
            type="primary"
            size="small"
            style="margin-bottom:20px;"
        >备份数据统计：备份文件35个，占用空间320.48MB, 服务器数据磁盘空间还剩余 17.34GB</el-tag>
        <!-- 表格 -->
        <baseTable
            :theApi="theApi"
            :table-config="configData.tableConfig"
            :top-btn-config="configData.topBtnConfig"
            :table-btn-config="configData.tableBtnConfig"
            :other-config="configData.otherConfig"
            :filter-config="configData.filterConfig"
            :grid-edit-width="200"
            :form-label-width="isMobile?'':'80px'"
            :form-width="isMobile?'95%':'40%'"
            :form-config="configData.formConfig"
            :form-data-model="configData.formModel"
        ></baseTable>
    </div>
</template>

<script>
import * as theApi from '@api/system/backup';
import baseTable from '@components/baseTable';
import { mapState } from 'vuex';
export default {
	name: 'system-backup',
	data() {
		return {
			//表格配置
			configData: {
				otherConfig: {
					sortValue: 'modifyTime,desc', // 排序规则
					dataFieldUrl: 'data', // 接口数据结构地址 (必填)
					needSelect: false // 是否可以多选
				},
				tableConfig: [
					{ label: '备份名称', prop: 'title' },
					{ label: '备份类型', prop: 'backupType' },
					{ label: '文件大小', prop: 'size' },
					{
						label: '创建时间',
						prop: 'permission',
						width: 170,
						render: (h, params) => {
							return (
								<span>
									{this.$moment(params.row.startTime).format(
										'YYYY-MM-DD HH:mm:ss'
									)}
								</span>
							);
						}
					}
				],
				tableBtnConfig: {},
				topBtnConfig: [], // 表格上方自定义按钮配置
				filterConfig: {
					// 筛选组件配置
					filter_list: ['date_scope'], // 需要筛选的字段
					search_field: [], // 字段替换
					search_list: []
				},
				// table的模态框表单配置，可配置表单类型，验证规则，是否必填,col-span布局可通过span参数配置
				formConfig: [],
				// 表单基础数据类型，需要预先赋值
				formModel: {}
			},
			theApi // 表格用ajax
		};
	},
	computed: {
		...mapState(['isMobile'])
	},
	components: { baseTable }
};
</script>

<style lang="less" scoped>
.mobile {
	.el-tag {
		white-space: normal;
		height: auto;
	}
}
</style>
