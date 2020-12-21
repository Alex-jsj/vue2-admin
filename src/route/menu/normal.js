export default [
    {
        title: 'home',
        url: '/views/index/home',
        icon: 'home',
        children: []
    },
    {
        title: 'user.index',
        url: '/views/index/user',
        icon: 'user',
        children: [
            {
                title: 'user.normal',
                url: '/views/index/user/normal'
            }
        ]
    },
    {
        title: 'accessory.index',
        url: '/views/index/accessory',
        icon: 'account',
        children: [
            {
                title: 'accessory.list',
                url: '/views/index/accessory/list'
            }
        ]
    },
    {
        title: 'system.index',
        url: '/views/index/system',
        icon: 'setting',
        children: [
            {
                title: 'system.message',
                url: '/views/index/system/message'
            },
            {
                title: 'system.log',
                url: '/views/index/system/log'
            },
            {
                title: 'system.backup',
                url: '/views/index/system/backup'
            },
            {
                title: 'system.permissions',
                url: '/views/index/system/permissions'
            }
        ]
    },
    {
        title: 'account',
        url: '/views/index/account',
        icon: 'head-portrait',
        children: []
    }
];
