// 路由配置
import superConfig from '@route/routeModules/superConfig'; // 超级管理员
import normalConfig from '@route/routeModules/normalConfig'; // 校工会管理员

export default {
    // 根据权限动态加载菜单
    GenerateRoutes: state => {
        if (state.role === '超级管理员') {
            return superConfig;
        } else if (state.role === '管理员') {
            return normalConfig;
        }
    }
};
