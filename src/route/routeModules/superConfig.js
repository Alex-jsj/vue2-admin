// 超级管理员 路由配置
export default [
	{
		path: '/views/index',
		component: () => import('@/views/public/index'),
		children: [
			{
				path: '/',
				redirect: 'workbench',
				component: () => import('@/views/workbench/index')
			},
			{
				path: 'workbench',
				name: 'workbench',
				component: () => import('@/views/workbench/index'),
				meta: {
					title: 'workbench',
					icon: 'home',
					permission: ['update', 'delete']
				}
			},
			/* 数据分类 */
			{
				path: 'dataClassify',
				component: () => import('@/views/dataClassify/index'),
				meta: {
					title: 'data.classify.index',
					icon: 'shujuguanli'
				},
				children: [
					{
						path: '/',
						redirect: 'topic',
						component: () => import('@/views/dataClassify/topic')
					},
					{
						path: 'topic',
						name: 'data-classify-topic',
						component: () => import('@/views/dataClassify/topic'),
						meta: {
							title: 'data.classify.topic'
						}
					},
					{
						path: 'document',
						name: 'data-classify-document',
						component: () => import('@/views/dataClassify/document'),
						meta: {
							title: 'data.classify.document'
						}
					}
				]
			},
			/* 数据管理 - 作品管理 */
			{
				path: 'works-list',
				name: 'data-management-works-list',
				component: () => import('@/views/dataManagement/works/views/list'),
				meta: {
					title: 'data.management.works_list'
				}
			},
			{
				path: 'works-add',
				name: 'data-management-works-add',
				component: () => import('@/views/dataManagement/works/views/add'),
				meta: {
					title: 'data.management.works_add',
					need_path: '/views/index/works-list',
					noCache: true
				}
			},
			{
				path: 'works-edit',
				name: 'data-management-works-edit',
				component: () => import('@/views/dataManagement/works/views/edit'),
				meta: {
					title: 'data.management.works_edit',
					need_path: '/views/index/works-list',
					noCache: true
				}
			},
			{
				path: 'works-examine',
				name: 'data-management-works-examine',
				component: () => import('@/views/dataManagement/works/views/examine'),
				meta: {
					title: 'data.management.works_examine',
					need_path: '/views/index/works-list',
					noCache: true
				}
			},
			/* 标签 */
			{
				path: 'tags',
				name: 'data-management-tags',
				component: () => import('@/views/dataManagement/tags'),
				meta: {
					title: 'data.management.tags'
				}
			},
			/* 数据分析 */
			{
				path: 'reportForm',
				name: 'reportForm',
				component: () => import('@/views/dataAnalysis/dataReportForm'),
				meta: {
					title: 'data.analysis.report_form'
				}
			},
			{
				path: 'leaderboard',
				name: 'leaderboard',
				component: () => import('@/views/dataAnalysis/leaderboard'),
				meta: {
					title: 'data.analysis.leaderboard'
				}
			},
			/* 系统管理 */
			{
				path: 'system',
				component: () => import('@/views/system/index'),
				meta: {
					title: 'system.index',
					icon: 'setting'
				},
				children: [
					{
						path: '/',
						redirect: 'user',
						component: () => import('@/views/system/user')
					},
					{
						path: 'user',
						name: 'system_user',
						component: () => import('@/views/system/user'),
						meta: {
							title: 'system.user'
						}
					},
					{
						path: 'log',
						name: 'system_log',
						component: () => import('@/views/system/log'),
						meta: {
							title: 'system.log'
						}
					},
					{
						path: 'backup',
						name: 'system_backup',
						component: () => import('@/views/system/backup'),
						meta: {
							title: 'system.backup'
						}
					},
					{
						path: 'roles',
						name: 'system_roles',
						component: () => import('@/views/system/roles'),
						meta: {
							title: 'system.roles'
						}
					},
					{
						path: 'permission',
						name: 'system_permission',
						component: () => import('@/views/system/permission/index'),
						meta: {
							title: 'system.permission'
						}
					},
					{
						path: 'watermark',
						name: 'system_watermark',
						component: () => import('@/views/system/watermark/index'),
						meta: {
							title: 'system.watermark'
						}
					}
					// {
					// 	path: 'website_config',
					// 	name: 'system_website_config',
					// 	component: () => import('@/views/system/website_config'),
					// 	meta: {
					// 		title: 'system.website_config'
					// 	}
					// }
				]
			},
			/* 个人中心 */
			{
				path: 'personalCenter',
				component: () => import('@/views/personalCenter/index'),
				meta: {
					title: 'personalCenter.index',
					icon: 'head-portrait'
				},
				children: [
					{
						path: '/',
						redirect: 'center',
						component: () => import('@/views/personalCenter/center')
					},
					{
						path: 'center',
						name: 'personalCenter_center',
						component: () => import('@/views/personalCenter/center'),
						meta: {
							title: 'personalCenter.center'
						}
					},
					{
						path: 'message',
						name: 'personalCenter_message',
						component: () => import('@/views/personalCenter/message'),
						meta: {
							title: 'personalCenter.message'
						}
					}
				]
			}
		]
	},
	{
		path: '*',
		redirect: '/404'
	}
];
