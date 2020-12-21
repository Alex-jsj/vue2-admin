export default [
	{
		title: 'workbench',
		url: '/views/index/workbench',
		icon: 'gongzuotai',
		children: []
	},
	{
		title: 'data.management.index',
		url: '/views/index/works-list',
		icon: 'shujuguanli',
		children: [
		]
	},
	{
		title: 'data.classify.index',
		url: '/views/index/dataClassify',
		icon: 'shujufenlei',
		children: [
			{
				title: 'data.classify.topic',
				url: '/views/index/dataClassify/topic'
			}
		]
	},
	{
		title: 'data.analysis.index',
		url: '/views/index/dataAnalysis',
		icon: 'chart',
		children: [
			{
				title: 'data.analysis.report_form',
				url: '/views/index/reportForm'
			},
			{
				title: 'data.analysis.leaderboard',
				url: '/views/index/leaderboard'
			}
		]
	},
	{
		title: 'personalCenter.index',
		url: '/views/index/personalCenter',
		icon: 'user',
		children: [
			{
				title: 'personalCenter.center',
				url: '/views/index/personalCenter/center'
			},
			{
				title: 'personalCenter.message',
				url: '/views/index/personalCenter/message'
			}
		]
	},
	{
		title: 'system.index',
		url: '/views/index/system',
		icon: 'xitong',
		children: [
			{
				title: 'system.user',
				url: '/views/index/system/user'
			},
			{
				title: 'system.roles',
				url: '/views/index/system/roles'
			},
			{
				title: 'system.permission',
				url: '/views/index/system/permission'
			},
			{
				title: 'system.watermark',
				url: '/views/index/system/watermark'
			},
			{
				title: 'system.log',
				url: '/views/index/system/log'
			}
			// {
			// 	title: 'system.website_config',
			// 	url: '/views/index/system/website_config'
			// }
		]
	}
];
