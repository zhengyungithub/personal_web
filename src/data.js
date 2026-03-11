import { reactive, watch } from 'vue';

const defaultData = {
  profile: {
    name: "郑筠",
    title: "软件工程 | 产品实习生",
    bio: "具备良好的产品思维与技术背景，能以技术视角理解产品落地逻辑，独立完成从「用户痛点调研→需求拆解→原型设计→开发跟进→功能验证」的全流程产品工作。主导 2 个健康领域产品从 0 到 1 的原型输出与需求落地，通过用户访谈、数据分析推动核心功能迭代，实现用户满意度 88%、操作流畅度提升 60% 的业务成果。逻辑清晰，注重用户体验与商业价值的平衡，同时主动学习 AIGC 在产品设计中的应用，能快速适配不同业务场景的产品迭代需求。",
    email: "zhengyun_0629@qq.com",
    phone: "13368969405",
    location: "深圳、杭州",
    avatar: "/1.png",
    avatarList: ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png", "/7.png", "/8.png", "/9.png"]
  },
  education: [
    {
      id: 1,
      school: "湖南理工大学",
      degree: "本科",
      major: "软件工程",
      period: "2022/09-2026/06",
      details: "班级排名: 3/42\n主修课程: 软件项目管理(89)、软件工程、后端技术开发(92)、软件体系结构(91)、数据库原理(SQLServer)、大型数据库应用(Oracle)、软件设计模式、数据结构、软件测试技术、系统分析与设计 (95)"
    }
  ],
  work: [
    {
      id: 1,
      company: "深圳量云能源网络科技有限公司",
      role: "产品实习生",
      period: "2026/01-至今",
      description: "所有的工作经历，应该采用倒叙（个别单位特殊规定除外），最近的两段工作，一般要写5-8项职责和业绩，如果是高层管理岗位，那么可以扩展到12项，均采用STAR法则书写，不仅仅要写做了什么，更要通过数据写出来做成了什么。"
    }
  ],
  projects: [
    {
      id: 1,
      title: "智能健康饮食系统",
      role: "产品负责人",
      period: "2025/06-2025/07",
      description: "需求挖掘与定位: 基于外卖商战内卷背景下，通过用户调研和竞品分析，发现年轻用户“饮食搭配不合理、健康需求难满足”的痛点，明确“个性化精准推荐 + 营养师 1v1 服务”的产品定位，覆盖健康数据管理、个性化饮食推荐、营养师服务三大核心模块。\nAI 应用与用户体验优化: 调用ollama大模型 API，完成业务场景封装（包括后端接口调用、健康场景 Prompt 工程设计、AI 生成结果与用户健康数据的联动处理），实现个性化饮食方案的自动生成；同时主导核心流程迭代，将用户生成饮食方案的操作步骤从 8 步精简至 3 步，操作时长从 3 分钟缩短到 1 分钟，用户操作满意度提升至 88%；依托大模型搭建饮食健康智能问答功能，减轻人工咨询压力，推动营养师咨询入口从个人中心移至方案详情页，使模块使用率提升 40%。\n跨团队协作与落地: 协调团队对齐需求，解决 AI 推荐精准度不足、技术实现难点等问题，推动功能 100% 落地；独立输出 PRD、接口文档、用户操作手册等 10 + 份核心文档，保障信息对齐。\n数据驱动迭代: 通过埋点追踪用户行为，发现 AI 推荐采纳率仅 40%，推动大模型 Prompt 优化，最终采纳率提升至 72%；同步优化服务分配机制，将营养师平均响应时间从 15 分钟缩短至 5 分钟，服务满意度提升至 92%。\n技术方案落地: 推动集成 AI 推荐与 Redis 缓存技术，将平台平均加载时间控制在 1.5 秒内，线上 Bug 率低于 5%，保障产品稳定运行。",
      image: "/智能健康饮食系统.png"
    },
    {
      id: 2,
      title: "养老健康服务平台",
      role: "产品负责人",
      period: "2025/04-2025/06",
      description: "用户需求挖掘: 通过走访养老社区、访谈 30 + 老年用户及家属，挖掘出“界面简洁、操作简单、实时掌握健康状态”的核心诉求，推动产品从“功能堆砌”转向“适老化设计”。\n适老化体验优化: 主导界面优化，将字体放大 20%，减少输入操作，支持语音录入，使老年用户独立操作成功率从 60% 提升至 85%；新增“健康异常预警”功能，当用户健康指标超出正常范围时自动通知家属，提升产品实用价值。\n快速迭代与验证: 采用敏捷开发模式，从需求调研到上线仅用 2 个月，快速验证产品价值；通过用户反馈（80 + 有效反馈）持续迭代，推动“健康趋势分析”等功能优化，用户满意度提升至 80%。\n跨角色协同设计: 协调医生、家属等多角色参与需求评审，设计“健康档案管理 + 异常预警 + 在线问诊”的闭环服务，平台数据同步效率达 100%，保障数据安全与实时性。",
      image: "/养老健康服务平台.png"
    }
  ],
  certificates: [
    { id: 1, name: "软件设计师（软考中级）", image: "/软件设计师（软考中级).png" },
    { id: 2, name: "CET-6", image: "/CET-6(460).png" },
    { id: 3, name: "CET-4", image: "/CET-4(491).png" },
    { id: 4, name: "驾驶证", image: "" },
    { id: 5, name: "普通话二甲", image: "" }
  ],
  skills: [
    { name: "日常剪辑", level: 75 },
    { name: "Vue3/HTML/CSS/JS", level: 85 },
    { name: "Java/Spring Boot", level: 80 },
    { name: "SQL/MYSQL/ORACLE/SQL SERVER", level: 75 },
    { name: "Cursor/豆包/deepseek/gemini", level: 85 },
    { name: "Excel/PPT/Word", level: 80 },
    { name: "Figma/Axure", level: 75 },
    { name: "Processon/Xmind/Visio", level: 80 },
    { name: "PRD/用户操作手册/接口文档/需求调研报告", level: 85 },
    { name: "敏捷开发流程", level: 80 }
  ],
  interests: [
    "摄影: 熟练使用后期软件进行后期调色与构图优化，具备较强审美能力与细节把控力，可辅助产品截图美化、活动海报设计等宣传材料制作。",
    "随笔写作: 善于用文字记录思考与观察，撰写技术随笔、复盘报告，注重逻辑性与表达深度。能助力需求业务文档、复盘报告撰写，提升文档质量"
  ]
};

const STORAGE_KEY = 'resume_data';

export const useResumeData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === '1') {
    localStorage.removeItem(STORAGE_KEY);
  }

  const savedData = localStorage.getItem(STORAGE_KEY);
  let initialData = savedData ? JSON.parse(savedData) : defaultData;
  
  // Migration: Replace old placeholder avatar with new local one
  if (initialData.profile && initialData.profile.avatar && initialData.profile.avatar.includes('placeholder.com')) {
    initialData.profile.avatar = '/卡通肖像.png';
  }
  if (Array.isArray(initialData.certificates)) {
    const certImageMap = {
      "软件设计师（软考中级）": "/软件设计师（软考中级).png",
      "CET-6(460)": "/CET-6(460).png",
      "CET-4(491)": "/CET-4(491).png",
    };
    initialData.certificates = initialData.certificates.map((cert) => {
      if (!cert || typeof cert !== 'object') return cert;
      if (cert.image) return cert;
      const mapped = certImageMap[cert.name];
      return mapped ? { ...cert, image: mapped } : cert;
    });
  }
  if (Array.isArray(initialData.projects)) {
    initialData.projects = initialData.projects.map((project) => {
      if (!project || typeof project !== 'object') return project;
      const description = typeof project.description === 'string' ? project.description : '';
      if (!description) return project;
      const cleaned = description
        .replaceAll('<strong>', '')
        .replaceAll('</strong>', '')
        .replaceAll('&lt;strong&gt;', '')
        .replaceAll('&lt;/strong&gt;', '');
      return cleaned === description ? project : { ...project, description: cleaned };
    });
  }
  if (Array.isArray(initialData.skills)) {
    initialData.skills = initialData.skills.map((skill) => {
      if (typeof skill === 'string') {
        return { name: skill, level: 80 };
      }
      if (!skill || typeof skill !== 'object') return skill;
      const name = typeof skill.name === 'string' ? skill.name : '';
      const parsed = Number(skill.level);
      const level = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 80;
      return { ...skill, name, level };
    });
  }

  const data = reactive(initialData);

  watch(data, (newData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, { deep: true });

  const addItem = (section, item) => {
    if (Array.isArray(data[section])) {
      // Ensure unique ID
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
         item.id = Date.now();
      }
      data[section].unshift(item);
    }
  };
  
  const updateItem = (section, index, newItem) => {
      if (Array.isArray(data[section])) {
          if (Array.isArray(newItem)) {
              // 替换整个数组
              data[section].splice(0, data[section].length, ...newItem);
          } else {
              // 替换单个元素
              data[section][index] = newItem;
          }
      } else if (section === 'profile') {
          Object.assign(data.profile, newItem);
      }
  }

  const deleteItem = (section, index) => {
    if (Array.isArray(data[section])) {
      data[section].splice(index, 1);
    }
  };

  return {
    data,
    addItem,
    updateItem,
    deleteItem
  };
};
