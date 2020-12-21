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
                    icon: 'home'
                }
            }
        ]
    },
    {
        path: '*',
        redirect: '/404'
    }
];
