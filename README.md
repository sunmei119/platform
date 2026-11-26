# 桂教通 · PC 端改版高保真原型

本项目为「桂教通」PC 端的交互高保真原型集合，全部为**单文件 HTML**，零外部依赖（图标为内联 SVG，logo 与背景为 base64 内联），双击即可在浏览器中打开预览。

## 目录结构

```
.
├── bigscreen/                     # 智慧教育 · 应用数据大屏
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── lib/echarts.min.js
│
└── login-ybt/                     # 登录 / 可信认证 / 门户改版
    ├── index.html                 # 用户登录（密码登录 / 扫码登录 / 右侧下载悬浮坞）
    ├── trust.html                 # 可信登录 · 统一身份认证
    ├── binding.html               # 正在建立身份绑定（过渡页）
    ├── bindings.html              # 绑定管理
    ├── bg.jpg / logo.png
    └── portal-harmony/            # 门户页（新增鸿蒙 APP 二维码）
        ├── index.html
        ├── PRD-门户新增鸿蒙APP二维码.md
        └── 鸿蒙版APP安装指引（帮助中心版）.md
```

## 页面清单

| 页面 | 文件 | 说明 |
| --- | --- | --- |
| 应用数据大屏 | `bigscreen/index.html` | 教育应用数据可视化大屏（ECharts） |
| 用户登录 | `login-ybt/index.html` | 密码登录 / 扫码登录双页签，右下角下载悬浮坞 |
| 可信登录 | `login-ybt/trust.html` | 统一身份认证登录 |
| 身份绑定 | `login-ybt/binding.html` | 建立身份绑定的四步过渡流程 |
| 绑定管理 | `login-ybt/bindings.html` | 已绑定账号列表与解绑 |
| 门户首页 | `login-ybt/portal-harmony/index.html` | 门户首页，新增鸿蒙 APP 二维码下载 |

## 关键交互说明

### 右下角下载悬浮坞

门户页与登录页共用同一套下载悬浮组件（结构、样式、文案完全一致）：

- **悬停**图标栏展开下载面板；面板头部右侧为醒目的橙色提示「点击查看二维码」。
- 点击某个渠道卡片切换到**二维码浮层**，展示该渠道二维码、扫码指引与操作按钮。
- 四端卡片（微信小程序 / Android / iOS / 鸿蒙）结构统一为：
  `平台名称 + 状态标签 + 关闭` → `二维码` → `扫码指引` → `要求` → `操作按钮`；四端等高，均不展示版本号与更新日期。
- **按钮行为**：
  - 微信小程序「打开微信扫一扫」——仅作说明，点击不触发任何操作；
  - Android / iOS / 鸿蒙「复制下载链接」——复制对应渠道链接到剪贴板，并弹出「下载链接已复制到剪贴板」提示。
  - 剪贴板优先使用 `navigator.clipboard`，在 `file://` 等非安全上下文下自动回退到 `execCommand('copy')`。

### 二维码

二维码为**占位图形**（`drawQR()` 按渠道 seed 伪随机生成 33×33 点阵 + 三个定位角），仅用于演示版式，不承载真实链接。

## 预览方式

直接双击任意 `.html` 文件，或在项目根目录启动静态服务：

```bash
python -m http.server 8080
# 然后访问 http://localhost:8080/login-ybt/index.html
```

## 设计约定

- 主色：`--green:#00b89e`（品牌绿）、`--blue:#2c8fec`（信息蓝）
- 文字：`--ink-900:#1b2a42` / `--ink-700:#42536e` / `--ink-500:#7a8ba3` / `--ink-300:#a7b4c6`
- 分割线：`--line:#e8edf4`
- 缓动：`--ease:cubic-bezier(.16,1,.3,1)`
- 所有动效均适配 `prefers-reduced-motion`，减少动效偏好下关闭呼吸动画
