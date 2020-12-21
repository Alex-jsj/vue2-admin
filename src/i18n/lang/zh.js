export default {
	base: {
		name: '',
		websiteTitle: '后台管理系统',
		zoom: '你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示',
		tips: '提示',
		noData: '暂无数据',
		to: '至'
	},
	'404': {
		backToHome: '返回首页',
		backToPrev: '返回上一页'
	},
	route: {
		home: '首页',
		workbench: '工作台',
		add: '添加',
		edit: '编辑',
		check: '查看',
		log: '系统日志',
		personInfo: '个人信息',
		message: '消息通知',
		account: '账户信息',
		user: {
			index: '用户管理',
			admin: '系统用户',
			normal: '普通用户'
		},
		data: {
			management: {
				index: '数据管理',
			},
			classify: {
				index: '数据分类',
				topic: '专题分类',
				document: '文档分类'
			},
			analysis: {
				index: '数据分析',
				report_form: '数据报表',
				overview: '数据概况',
				trend: '趋势分析',
				documents: '文档总数',
				files: '文件总量大小',
				pageViews: '浏览量',
				downloads: '下载量',
				tags: '标签量',
				uploadCount: '上传数',
				leaderboard: '排行榜'
			}
		},
		system: {
			index: '系统管理',
			user: '用户管理',
			message: '消息通知',
			backup: '数据备份',
			roles: '角色管理',
			permission: '菜单管理',
			website_config: '网站设置',
			watermark: '水印管理',
			log: '系统日志'
		},
		personalCenter: {
			index: '个人中心',
			center: '我的账户',
			message: '消息通知'
		}
	},
	login: {
		title1: '欢迎使用',
		title2: '后台管理系统',
		user: '请输入用户名',
		psd: '请输入密码',
		forgetPassword: '忘记密码',
		signIn: '登 录',
		contact: '请联系系统管理员',
		email: '邮箱',
		autoLogin: '自动登录',
		showPsd: '显示密码',
		hiddenPsd: '隐藏密码',
		captcha: '请输入验证码',
		userErr1: '用户名不能为空!',
		userErr2: '用户名应为5~20位数字/字母/下划线/@/.!',
		psdErr1: '密码不能为空!',
		psdErr2: '密码应为5~20位数字/字母/下划线/@/.!',
		captchaErr: '验证码不能为空!',
		captcha_err2: '验证码格式错误',
		success: '登录成功',
		fail: '账号或密码错误',
		tips: '提示',
		alreadyOnline: '您的帐号已经登录系统，是否继续登录？（如非本人操作，建议您修改密码以确保帐号安全）',
		continue: '继续登录',
		cancel: '取消',
		cancelLogin: '取消登录'
	},
	sideBar: {
		packUp: '收起菜单'
	},
	topBar: {
		userBoard: {
			logout: '退出登录',
			changePassword: '修改密码',
			messageNotification: '我的消息',
			userName: '登录用户名'
		}
	},
	tagsView: {
		refresh: '刷新',
		close: '关闭',
		closeOthers: '关闭其他',
		closeAll: '关闭全部'
	},
	fixedTool: {
		backToTop: '',
		goToBottom: '',
		closeSet: '',
		openSet: '',
		theme: '整体风格设置',
		themeConfig: {
			content1: '亮色菜单风格',
			content2: '暗色菜单风格'
		},
		navigation: '导航模式',
		navigationConfig: {
			content1: '侧边菜单布局',
			content2: '顶部菜单布局',
			retract: '收起导航',
			fixed: '固定导航',
			config1: '侧边菜单布局时可配置',
			config2: '顶部菜单布局时可配置'
		},
		contentWidth: {
			text: '内容区域宽度'
		},
		btns: {
			open: '打 开设 置',
			close: '关 闭设 置',
			top: '回 到顶 部',
			bottom: '去 到底 部',
			feedback: '意 见反 馈'
		},
		select: {
			flow: '流式',
			fixed: '定宽',
			weak: '弱',
			medium: '中',
			strength: '强'
		},
		pageSetup: {
			text: '页面设置',
			fullScreen: '网页全屏',
			switchLang: '语言切换'
		},
		otherSettings: {
			text: '其他设置',
			colorWeakMode: '色弱模式',
			grayscaleMode: '灰度模式',
			eyeProtectionMode: '护眼模式',
			strengthSelection: '强度选择',
			automatic: '夜间21点-凌晨6点自动开启护眼模式',
			tip: '色弱模式开启时会关闭自动护眼模式功能'
		}
	},
	home: {
		dataOverview: '数据概览',
		trend: '数据趋势',
		serverInformation: '服务器信息',
		numberOfAttachments: '附件数量',
		diskOccupiedByTheSystem: '已分配未使用内存(GB)',
		diskOccupiedBySystemLog: '已分配已使用内存(GB)',
		diskOccupiedByDataBackup: '系统已分配内存(GB)',
		dataBoard: '数据看板',
		QueryTime: '查询时间',
		canvas: { data1: '访问量', data2: '作品上传数量' },
		system: {
			title1: '操作系统',
			title2: '用户名',
			title3: '最近登录时间',
			title4: '服务器环境',
			title5: 'JAVA 版本',
			title6: '运行环境'
		}
	},
	introductorPage: {
		text: '打开引导',
		prevLabel: '← 上一步',
		nextLabel: '下一步 →',
		skipLabel: '跳过',
		doneLabel: '结束',
		step1: '语言切换',
		step2: '用户信息',
		step3: '面包屑导航',
		step4: '标签页',
		step5: '系统设置'
	},
	table: {
		edit: '编辑',
		delete: '删除',
		selectAll: '全选',
		deleteInBatches: '批量删除',
		update: '更新数据',
		operate: '操作',
		custom: '自定义显示',
		moreOperate: '更多操作'
	}
};
