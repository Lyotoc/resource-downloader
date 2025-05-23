import { title } from "process";

// 子菜单
export default {
    framework: {
        'menu_100': {
            icon: 'profile',
            title: '通信',
            pageName: 'FrameworkSocketIpc',
            params: {}
        },
        'menu_101': {
            icon: 'profile',
            title: 'http服务',
            pageName: 'FrameworkSocketHttpServer',
            params: {}
        },
        'menu_102': {
            icon: 'profile',
            title: 'socket服务',
            pageName: 'FrameworkSocketSocketServer',
            params: {}
        },
        'menu_104': {
            icon: 'profile',
            title: 'sqlite数据库',
            pageName: 'FrameworkSqliteDBIndex',
            params: {}
        },
        'menu_105': {
            icon: 'profile',
            title: '任务',
            pageName: 'FrameworkJobsIndex',
            params: {}
        },
        'menu_106': {
            icon: 'profile',
            title: '软件调用',
            pageName: 'FrameworkSoftwareIndex',
            params: {}
        },
        'menu_107': {
            icon: 'profile',
            title: '自动更新',
            pageName: 'FrameworkUpdaterIndex',
            params: {}
        },
    },
    os: {
        'menu_100': {
            icon: 'profile',
            title: '文件',
            pageName: 'OsFileIndex',
            params: {}
        },
        'menu_102': {
            icon: 'profile',
            title: '窗口',
            pageName: 'OsWindowIndex',
            params: {}
        },
        'menu_103': {
            icon: 'profile',
            title: '桌面通知',
            pageName: 'OsNotificationIndex',
            params: {}
        },
        'menu_110': {
            icon: 'profile',
            title: '图片',
            pageName: 'OsFilePic',
            params: {}
        },
    },
    effect: {
        'menu_100': {
            icon: 'profile',
            title: '登录',
            pageName: 'EffectLoginIndex',
            params: {}
        }
    },
    cross: {
        'menu_100': {
            icon: 'profile',
            title: 'go服务',
            pageName: 'CrossGoIndex',
            params: {}
        },
        'menu_110': {
            icon: 'profile',
            title: 'java服务',
            pageName: 'CrossJavaIndex',
            params: {}
        },
        'menu_120': {
            icon: 'profile',
            title: 'python服务',
            pageName: 'CrossPythonIndex',
            params: {}
        },
    },
    feature: { // 新增"功能"顶级菜单
        'menu_100': { // 新增"网页抓取"二级菜单
            icon: 'profile', // 可以根据需要修改图标
            title: '网页抓取',
            pageName: 'WebCapture',
            params: {}
        },
        'menu_110': { // 新增"图片处理"二级菜单
            icon: 'picture', // 使用图片图标
            title: '图片处理',
            pageName: 'ImageProcessing',
            params: {}
        }
    },
    setting: {
        'menu_100': {
            icon: 'profile',
            title: '自动更新',
            pageName: 'SettingsUpdaterIndex',
            params: {}
        }
    }
}
