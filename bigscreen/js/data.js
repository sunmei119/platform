/* ===== 模拟数据层：接真实接口时替换为本目录 api.js（fetch + 轮询） ===== */
window.BS_DATA = {
  screens: [
    {
      id: "overview",
      name: "应用数据总览",
      kpiRows: [
        [
          { key: "total",  label: "应用总数",   value: 12348, badge: "较上月 +2.6%", color: "#4080ff", tint: "#eaf2ff", icon: "grid" },
          { key: "native", label: "原生应用数", value: 356,   badge: "较上月 +1.1%", color: "#7c6cf5", tint: "#efedff", icon: "chip" },
          { key: "eco",    label: "生态应用数", value: 123,   badge: "较上月 +4.8%", color: "#00b390", tint: "#e5faf4", icon: "leaf" },
          { key: "self",   label: "自建应用数", value: 11869, badge: "较上月 +2.9%", color: "#ff8b4a", tint: "#fff3ea", icon: "build" },
          { key: "act",    label: "活动总数",   value: 39,    badge: "本月新增 4 场", color: "#e05a7a", tint: "#fdeef3", icon: "calendar" }
        ]
      ],
      panels: [
        { type: "activeTrend", title: "活跃应用总数", note: "隔周统计 · 近五周", size: "wide" },
        { type: "radarDist",   title: "活跃应用种类分布", note: "活跃度指数 / 100", size: "norm" },
        { type: "actTable",    title: "平台活动", note: "进行中 · 5 场", size: "mid" }
      ]
    },
    {
      id: "insight",
      name: "应用活跃洞察",
      kpiRows: [[
        { key: "day",   label: "日活跃应用", value: 4236, badge: "昨日 +3.4%", color: "#4080ff", tint: "#eaf2ff", icon: "grid" },
        { key: "week",  label: "周活跃应用", value: 6891, badge: "本周 +5.2%", color: "#7c6cf5", tint: "#efedff", icon: "chip" },
        { key: "month", label: "月活跃应用", value: 8752, badge: "本月 +6.7%", color: "#00b390", tint: "#e5faf4", icon: "leaf" },
        { key: "new",   label: "本季新增应用", value: 214, badge: "环比 +9.3%", color: "#ff8b4a", tint: "#fff3ea", icon: "build" }
      ]],
      panels: [
        { type: "top10",       title: "活跃应用 TOP10", note: "按周使用量", size: "wide" },
        { type: "changeTrend", title: "新增与更新应用趋势", note: "隔周统计 · 近五周", size: "norm" }
      ]
    }
  ],

  /* 活跃应用总数 · 隔周（近五周） */
  weeks: ["0928-1004", "1005-1011", "1012-1018", "1019-1025", "1026-1101"],
  activeTrend: [8196, 8652, 8908, 9241, 9586],

  /* 活跃应用种类分布雷达（活跃度指数 0-100） */
  radar: {
    dims: ["协同管理", "教学研训", "教务管理", "教育管理", "校园安全", "校务管理", "家校互动"],
    cur:  [86, 92, 78, 74, 65, 70, 58],
    prev: [79, 85, 74, 70, 60, 66, 61]
  },

  /* 活跃应用 TOP10（周使用量） */
  top10: {
    names: ["招生管理系统", "党史知识竞答", "在线答题", "智慧课堂", "全区依法治校达标评定", "教师数字素养测评", "学籍管理系统", "校园一卡通", "家校互联平台", "电子班牌"],
    values: [1252796, 1234137, 1228973, 986420, 697945, 682244, 536081, 428765, 356214, 289530]
  },

  /* 新增与更新应用趋势 */
  changeTrend: {
    added:   [68, 74, 71, 82, 89],
    updated: [135, 148, 152, 169, 181]
  },

  /* 平台活动（进行中） */
  activities: [
    { name: "三月三创意设计大赛",           target: "全国所有人、个人",           orgs: 655,  people: 2500 },
    { name: "全区依法治校",                 target: "全区独立法人学校约 9800 所", orgs: 9274, people: 411077 },
    { name: "教育数字化转型优秀案例征集评选", target: "全区学校教职工",             orgs: 481,  people: 2819 },
    { name: "资助征文比赛",                 target: "全区",                       orgs: 252,  people: 418 },
    { name: "院校国际化评价",               target: "全区高校约 85 所，前期试用 34 所", orgs: 35, people: 3027 }
  ]
};
