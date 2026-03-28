import type { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  profile: {
    name: '王璐迪',
    role: '视频剪辑 / 内容剪辑 / 后期助理',
    tagline: '动漫制作技术专业应届生，擅长视频剪辑、文案策划和视觉表达，期望在深圳从事视频剪辑相关岗位。',
    intro:
      '我目前就读于郑州城市职业学院动漫制作技术专业，专业排名前 5%，获得国家励志奖学金。课程展示和小组作业中，我经常负责文案策划、视频剪辑和后期处理，也会从画面节奏、字幕配合和整体视觉感受去调整内容表达。这个站点保留了作品展示，同时补上教育背景和相关经历，让招聘方可以更快判断我的视频岗位匹配度。',
    location: '期望城市 · 深圳 / 教育背景 · 郑州城市职业学院动漫制作技术',
    availability: '适合投递视频剪辑、内容剪辑、短视频后期、剪辑助理等岗位',
    stats: [
      { label: '求职方向', value: '视频剪辑 / 内容剪辑 / 后期助理' },
      { label: '教育经历', value: '2023-2026 郑州城市职业学院 · 大专' },
      { label: '在校亮点', value: '专业前 5% / 国家励志奖学金 / 校级二等奖' },
    ],
  },
  heroReel: {
    title: '内容与剪辑作品展示',
    subtitle: '用课程展示、模拟品牌视频和动态海报呈现剪辑基础、画面节奏和视觉执行能力',
    description:
      '首页优先展示能体现视频剪辑、字幕节奏、画面审美和后期执行能力的作品，方便招聘方先看到实际产出。',
    videoUrl: '/exports/demo-reel-2026.mp4',
    poster: '/covers/demo-reel-cover.jpg',
    highlights: ['应届生求职版', '视频剪辑', '后期处理', '视觉审美'],
  },
  skills: [
    { name: '视频剪辑', detail: '熟练使用剪映完成剪辑、字幕、配乐和基础节奏控制' },
    { name: '内容策划', detail: '能完成选题梳理、内容结构设计和文案成稿，支持视频前期表达' },
    { name: '后期表达', detail: '会从字幕、音乐、节奏和画面氛围出发，提升内容完成度' },
    { name: '视觉审美', detail: '动漫设计专业背景，具备构图、配色和年轻化风格判断' },
  ],
  highlights: [
    {
      title: '课程展示剪辑经验',
      description: '负责课程展示视频的剪辑与后期，能独立完成素材整理、字幕、配乐和节奏处理。',
    },
    {
      title: '熟练使用剪映',
      description: '能完成基础视频剪辑、字幕添加、音乐搭配和画面节奏调整，适合短视频和展示类内容制作。',
    },
    {
      title: '视觉表达能力',
      description: '参加校级动漫 IP 设计比赛获二等奖，对构图、配色和年轻化画面风格有实际积累。',
    },
    {
      title: '专业基础扎实',
      description: '动漫制作技术专业排名前 5%，获得国家励志奖学金，学习能力强，也能按节点稳定推进任务。',
    },
  ],
  resumeSections: [
    {
      id: 'job-target',
      label: 'Job Target',
      title: '求职意向',
      items: [
        '目标岗位：视频剪辑 / 内容剪辑 / 短视频后期 / 剪辑助理',
        '期望薪资：3-6K',
        '期望城市：深圳',
        '希望用剪辑基础、内容表达和审美能力完成视频相关工作。',
      ],
    },
    {
      id: 'education',
      label: 'Education',
      title: '教育背景',
      items: [
        '郑州城市职业学院 · 动漫制作技术 · 大专 · 2023-2026',
        '专业排名前 5%',
        '主修课程：影视特效、分镜头设计、三维动画制作',
        '获得国家励志奖学金。',
      ],
    },
    {
      id: 'campus-ops',
      label: 'Campus Operations',
      title: '相关实践经历',
      items: [
        '负责班级日常事务协调和活动通知发布，具备基础沟通和执行能力。',
        '策划并执行主题班会、团日活动，能独立推进主题设定到流程安排。',
        '与辅导员、授课老师保持高效沟通，协助解决同学实际问题。',
      ],
    },
    {
      id: 'content-creation',
      label: 'Content Creation',
      title: '内容创作经历',
      items: [
        '小组作业中承担文案与策划角色，负责选题、结构设计与成文全流程，多次被老师列为优秀案例。',
        '课程展示中负责视频剪辑与后期，熟练使用剪映完成剪辑、字幕、配乐和节奏控制。',
        '善于用视觉表达增强内容吸引力，对配色、构图和画面氛围有实际积累。',
      ],
    },
    {
      id: 'tools',
      label: 'Tools & Certificates',
      title: '工具与技能',
      items: [
        '文案与策划：选题策划、内容结构设计、用户视角表达',
        '软件：剪映（熟练）、AE、PS',
        '影视剪辑相关技能可用于课程展示和短视频内容制作',
      ],
    },
  ],
  categories: [
    {
      id: 'editing-video',
      name: '内容剪辑',
      description: '用成片节奏、情绪和镜头语言展示内容剪辑基础。',
    },
    {
      id: 'ae-packaging',
      name: '视觉包装',
      description: '用包装动效、片头和版式节奏展示视觉表达能力。',
    },
    {
      id: 'commercial-video',
      name: '品牌内容',
      description: '用品牌向内容展示对传播目标和卖点表达的理解。',
    },
    {
      id: 'dynamic-poster',
      name: '视觉加分项',
      description: '作为加分项补足视觉表现力与审美完成度。',
    },
  ],
  works: [
    {
      id: 'work-01',
      slug: 'work-1',
      title: '下班后的三十分钟',
      category: 'editing-video',
      projectType: '内容剪辑案例',
      purpose: '内容审美与剪辑节奏',
      year: '2026',
      summary: '30 秒竖版治愈系短视频案例，用日常生活动作做情绪剪辑。',
      description:
        '这支作品更像我对“情绪剪辑”的一次集中表达，适合作为面试开场第一支，先让人看到我的镜头感觉和内容审美。',
      coverImage: '/reference-board.png',
      skillTags: ['治愈系短片', '情绪剪辑', '竖版内容', '字幕节奏'],
      videoUrl: '/exports/work1-healing-short.mp4',
      detailHash: '#/works/work-1',
      status: 'ready',
    },
    {
      id: 'work-02',
      slug: 'work-2',
      title: 'BELLE 百丽秋季通勤企划包装（模拟项目）',
      category: 'ae-packaging',
      projectType: '视觉包装案例',
      purpose: '视觉包装与信息表达',
      year: '2026',
      summary: '以女鞋品牌秋季通勤企划为命题，完成 15 秒栏目包装与动态视觉系统。',
      description:
        '以百丽品牌语境为参考做的模拟项目，重点想体现我不只是会剪镜头，也能把字体、图形和栏目气质做成完整的动态视觉。',
      coverImage: '/covers/work2-belle-cover.jpg',
      skillTags: ['After Effects', '百丽风格', '字体动效', '栏目包装'],
      videoUrl: '/exports/work2-ae-packaging.mp4',
      detailHash: '#/works/work-2',
      renderCommand: 'npm run render:work2',
      status: 'ready',
    },
    {
      id: 'work-03',
      slug: 'work-3',
      title: '花西子新品定妆蜜粉短视频（模拟项目）',
      category: 'commercial-video',
      projectType: '品牌内容案例',
      purpose: '品牌内容理解',
      year: '2026',
      summary: '以国货美妆品牌新品推广为命题，完成面向小红书 / 视频号的商业短视频。',
      description:
        '以花西子品牌语境为参考做的模拟项目，想说明我理解商业内容不只是好看，还要围绕卖点、平台和传播目标去组织视频。',
      coverImage: '/covers/work3-huaxizi-cover.jpg',
      skillTags: ['国货美妆', '商业表达', '卖点梳理', '平台转化'],
      videoUrl: '/exports/work3-commercial-video.mp4',
      detailHash: '#/works/work-3',
      renderCommand: 'npm run render:work3',
      status: 'ready',
    },
    {
      id: 'work-04',
      slug: 'bonus-poster',
      title: '动态海报加分项',
      category: 'dynamic-poster',
      projectType: '视觉加分项',
      purpose: '视觉表现补充',
      year: '2026',
      summary: '作为加分项补一到两张动态海报，强化审美和视觉完成度。',
      description:
        '我把动态海报放在最后，是希望它作为视觉加分项出现，补充版式、配色和轻动效能力，而不是喧宾夺主。',
      coverImage: '/covers/dynamic-poster-01.svg',
      skillTags: ['动态海报', '轻动效', '氛围包装', '视觉加分'],
      videoUrl: '',
      detailHash: '#/works/bonus-poster',
      status: 'ready',
      isBonus: true,
    },
  ],
  experiments: [
    {
      id: 'exp-01',
      title: 'Logo Motion Study',
      summary: '补充 Logo reveal、线条生长和 easing 节奏练习，让视觉包装更完整。',
      coverImage: '/covers/ae-motion-02.svg',
      tags: ['Logo Animation', 'Trim Paths', 'Ease'],
      type: '动效练习',
    },
    {
      id: 'exp-02',
      title: 'Subtitle Rhythm Study',
      summary: '围绕字幕节拍、停顿和呼吸感做信息进场练习，适合短视频内容包装。',
      coverImage: '/covers/short-video-02.svg',
      tags: ['字幕动画', '节奏控制', '竖版包装'],
      type: '剪辑练习',
    },
    {
      id: 'exp-03',
      title: 'Cosmetic Title Motion',
      summary: '模拟标题进场和产品信息卡，练习轻盈、干净的品牌动效语言。',
      coverImage: '/covers/dynamic-poster-02.svg',
      tags: ['美妆视觉', '标题动效', '信息卡'],
      type: '包装练习',
    },
  ],
  references: [
    {
      id: 'ref-01',
      title: '内容灵感参考视频',
      source: 'Vimeo / 非本人项目',
      summary:
        '可作为镜头节奏、版式处理或整体氛围的灵感来源，但不应作为自己的案例展示，更不能混入作品清单里。',
      embedUrl: 'https://player.vimeo.com/video/980153179?h=6c5de8a193',
      href: 'https://player.vimeo.com/video/980153179?h=6c5de8a193',
      note: '建议统一放在 Inspiration / References 模块，并明确标注“参考视频 / 非本人项目 / Source: Vimeo”。',
    },
  ],
  contacts: [
    {
      label: '手机',
      value: '15639571728',
      href: 'tel:15639571728',
    },
    {
      label: '邮箱',
      value: '3514910940@qq.com',
      href: 'mailto:3514910940@qq.com',
    },
    {
      label: 'QQ',
      value: '3514910940',
      href: 'https://wpa.qq.com/msgrd?v=3&uin=3514910940&site=qq&menu=yes',
    },
  ],
};
