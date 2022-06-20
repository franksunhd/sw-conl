// 默认菜单
export const defaultMenu = [
    {
        id: '1',
        name: '发布动态',
        url: '/teamWang/dynamic',
        icon: 'icon-release',
        flag: false,
        children: [
            {
                id: '1-1',
                name: '生活方式',
                url: '/teamWang/dynamic',
                icon: 'icon-life',
                flag: true
            },
            {
                id: '1-2',
                name: '独家动态',
                url: '/teamWang/vipDynamic',
                icon: 'icon-vipActivity',
                flag: true,
                vip: true
            },
        ]
    },
    {
        id: '2',
        name: '留言板',
        url: '/teamWang/vipMassage',
        icon: 'icon-message',
        flag: true,
        vip: true
    },
    {
        id: '3',
        name: '发布内容',
        url: '/teamWang/content',
        icon: 'icon-content',
        flag: false,
        children: [
            {
                id: '3-1',
                name: 'COMMON',
                url: '/teamWang/content',
                icon: 'icon-common',
                flag: true
            },
            {
                id: '3-2',
                name: 'VIP',
                url: '/teamWang/vipContent',
                icon: 'icon-vip',
                flag: true,
                vip: true
            },
        ]
    },
    {
        id: '4',
        name: '会员订单',
        url: '/teamWang/order',
        icon: 'icon-order',
        flag: true,
        vip: true
    },
    {
        id: '5',
        name: '权限管理',
        url: '/teamWang/user',
        icon: 'icon-iconJurisdiction',
        flag: false,
        children: [
            {
                id: '5-1',
                name: '用户管理',
                url: '/teamWang/user',
                icon: 'icon-user',
                flag: false,
            },
            {
                id: '5-2',
                name: '角色管理',
                url: '/teamWang/role',
                icon: 'icon-iconRole',
                flag: false,
            },
        ]
    },
    {
        id: '7',
        name: '会员权益',
        url: '/teamWang/vipRights',
        icon: 'icon-rights',
        flag: true,
        vip: true
    },
    {
        id: '6',
        name: '系统设置',
        url: '/teamWang/data',
        icon: 'icon-setting',
        flag: false,
        children: [
            {
                id: '6-1',
                name: '闪屏动画',
                url: '/teamWang/animation',
                icon: 'icon-iconFlashScreen',
                flag: true
            },
            {
                id: '6-2',
                name: '协议维护',
                url: '/teamWang/vipNotice',
                icon: 'icon-iconAgreement',
                flag: true
            },
            {
                id: '6-3',
                name: '艺人资料',
                url: '/teamWang/artistData',
                icon: 'icon-artist',
                flag: true
            },
            {
                id: '6-4',
                name: '艺人经历',
                url: '/teamWang/personalData',
                icon: 'icon-iconArtExpeirence',
                flag: true
            },
            {
                id: '6-5',
                name: '团队资料',
                url: '/teamWang/teamInformation',
                icon: 'icon-teamData',
                flag: true
            },
            {
                id: '6-6',
                name: '团队介绍',
                url: '/teamWang/teamData',
                icon: 'icon-team',
                flag: true
            },
            {
                id: '6-7',
                name: '资源管理',
                url: '/teamWang/logoManage',
                icon: 'icon-resources',
                flag: true
            },
            {
                id: '6-8',
                name: '官网菜单',
                url: '/teamWang/menuManage',
                icon: 'icon-Menu',
                flag: true
            }
        ]
    }
];

// 王嘉尔固定菜单
export const fixedMenu = [
    {
        id: '1',
        name: '生活方式',
        url: '/teamWang/dynamic',
        icon: 'icon-shenghuo',
    },
    {
        id: '2',
        name: '独家动态',
        url: '/teamWang/vipDynamic',
        icon: 'icon-sirenhuodong',
    },
    {
        id: '3',
        name: '留言板',
        url: '/teamWang/vipMassage',
        icon: 'icon-huifuliuyan',
        flag: true,
    },
];
