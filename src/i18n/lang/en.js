export default {
	base: {
		name: '',
		websiteTitle: 'Database management system', // 站点名称
		zoom: 'Your browser is currently in a zoom state, the page may be misplaced, it is recommended that 100% size display.',
		tips: 'Tips',
		noData: 'No Data',
		to: 'to'
	},
	'404': {
		backToHome: 'Back to home page',
		backToPrev: 'Return to the previous page'
	},
	route: {
		home: 'Home',
		workbench: 'Workbench',
		add: 'Add',
		edit: 'Edit',
		check: 'Check',
		log: 'System Log',
		personInfo: 'Personal information',
		message: 'Message notification',
		account: 'Account information',
		user: {
			index: 'User',
			admin: 'Admin',
			normal: 'Normal'
		},
		data: {
			management: {
				index: 'Data management',
				works: 'Works',
				works_list: 'Works List',
				works_add: 'Add Works',
				works_edit: 'Edit Works',
				works_examine: 'Examine Works',
				document: 'Document',
				document_list: 'Document List',
				document_add: 'Add Document',
				document_edit: 'Edit Document',
				document_examine: 'Examine Document',
				topic: 'Topic',
				topic_list: 'Topic List',
				topic_add: 'Add Topic',
				topic_edit: 'Edit Topic',
				artist: 'Artist',
				artist_list: 'Artist List',
				artist_add: 'Add Artist',
				artist_edit: 'Edit Artist',
				artist_examine: 'Artist Detail',
				tags: 'Tags',
				texture: 'Textures',
				topicRecycleBin: 'Topic Recycle Bin',
				documentRecycleBin: 'Document Recycle Bin'
			},
			classify: {
				index: 'Data classification',
				department: 'Department Setting',
				dynasty: 'Dynasty',
				art_work: 'Art works Classify',
				artist: 'Artist Classify',
				exhibition: 'Exhibition Classify',
				topic: 'Special Classify',
				document: 'Document Classify'
			},
			analysis: {
				index: 'Data Analysis',
				report_form: 'Data Report Form',
				overview: 'Data Overview',
				trend: 'Trend Analysis',
				documents: 'Document Count',
				files: 'File Count',
				pageViews: 'Page Views',
				downloads: 'Downloads',
				tags: 'Tags',
				uploadCount: 'Upload Count',
				leaderboard: 'Leaderboard'
			}
		},
		exhibition: {
			index: 'Exhibition',
			list: 'Exhibition list',
			add: 'Add',
			edit: 'Edit',
			examine: 'Detail'
		},
		system: {
			index: 'System',
			user: 'User management',
			message: 'Message',
			backup: 'Backup',
			roles: 'Roles',
			permission: 'Permission',
			website_config: 'Website set',
			log: 'Log'
		},
		personalCenter: {
			index: 'Personal Center',
			center: 'Account',
			message: 'Message'
		}
	},
	login: {
		title1: 'Welcome to use',
		title2: 'Database management system',
		user: 'Enter one user name',
		psd: 'Input password',
		forgetPassword: 'Forget password',
		signIn: 'Sign In',
		contact: 'Please contact the system administrator',
		email: 'Email',
		autoLogin: 'Auto Login',
		showPsd: 'Show Password',
		hiddenPsd: 'Hidden Password',
		captcha: 'Input calculation results',
		userErr1: 'User name cannot be empty!',
		userErr2: 'User names should be 5-20 digits/letters/underscores/@/.!',
		psdErr1: 'Password cannot be empty!',
		psdErr2: 'The password should be 6-15 digits/letters/underscores!',
		captchaErr: 'Captcha cannot be empty!',
		captcha_err2: 'The captcha should be 5 digits/letters!',
		success: 'Login successfully',
		fail: 'Error in account or password',
		tips: 'Tips',
		alreadyOnline:
			'Your account has been logged in. Do you want to continue? (If you do not operate by yourself, it is recommended that you modify your password to ensure account security)',
		continue: 'Continue login',
		cancel: 'Cancel',
		cancelLogin: 'Cancel Login'
	},
	sideBar: {
		packUp: 'Pack up the menu'
	},
	topBar: {
		userBoard: {
			logout: 'Logout',
			changePassword: 'Change password',
			messageNotification: 'Message notification',
			userName: 'User name'
		}
	},
	tagsView: {
		refresh: 'refresh',
		close: 'close',
		closeOthers: 'closeOthers',
		closeAll: 'closeAll'
	},
	fixedTool: {
		theme: 'Theme',
		themeConfig: {
			content1: 'Light',
			content2: 'Dark'
		},
		navigation: 'Navigation mode',
		navigationConfig: {
			content1: 'Side layout',
			content2: 'Top layout',
			retract: 'Retract navigation',
			fixed: 'Fixed navigation',
			config1: 'Configurable side menu layout',
			config2: 'Configurable top menu layout'
		},
		contentWidth: {
			text: 'Area width'
		},
		btns: {
			open: 'open',
			close: 'close',
			top: 'top',
			bottom: 'bottom',
			feedback: 'feedback'
		},
		select: {
			flow: 'Flow',
			fixed: 'Fixed',
			weak: 'Weak',
			medium: 'Medium',
			strength: 'Strength'
		},
		pageSetup: {
			text: 'Page Setting',
			fullScreen: 'FullScreen',
			switchLang: 'Language switching'
		},
		otherSettings: {
			text: 'Other Settings',
			colorWeakMode: 'Color weak mode',
			grayscaleMode: 'Grayscale mode',
			eyeProtectionMode: 'Eye protection mode',
			strengthSelection: 'Strength selection',
			automatic: 'Open Eye Protection from 21 p.m. to 6 a.m.',
			tip: 'Automatic eye protection mode will be turned off when weak mode is turned on'
		}
	},
	home: {
		dataOverview: 'Data Overview', // 数据概览
		trend: 'Apply Trend', // 趋势
		serverInformation: 'Server Information', // 服务器信息
		numberOfAttachments: 'Number of attachments', //附件数量
		diskOccupiedByTheSystem: 'freeMemory(GB)',
		diskOccupiedBySystemLog: 'usableMemory(GB)',
		diskOccupiedByDataBackup: 'maxMemory(GB)',
		dataBoard: 'Data Board',
		QueryTime: 'Query time',
		canvas: { data1: 'page view ', data2: 'Number of works uploaded' },
		system: {
			title1: 'Operating system',
			title2: 'User name',
			title3: 'Latest login time',
			title4: 'Server environment',
			title5: 'JAVA Version',
			title6: 'Running environment'
		}
	},
	introductorPage: {
		text: 'Open guide',
		prevLabel: '← Prev',
		nextLabel: 'Next →',
		skipLabel: 'Skip',
		doneLabel: 'Done',
		step1: 'Language switching',
		step2: 'User information',
		step3: 'Bread crumb navigation',
		step4: 'Tab page',
		step5: 'System setup'
	},
	table: {
		edit: 'Edit',
		delete: 'Delete',
		selectAll: 'Select All',
		deleteInBatches: 'Delete In Batches',
		update: 'Update',
		operate: 'Operate',
		custom: 'Customize Display',
		moreOperate: 'More Operate'
	}
};
