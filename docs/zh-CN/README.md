

# hexo-sitemap-html

一个**现代、响应式、高度可配置**的 Hexo 插件，用于生成美观的 HTML 格式站点地图。完美适配 **Node 22+** 和 **Hexo 6.x**。

> 📌 语言切换：[English Version](../en-US/README.md)

## ✨ 核心特性

* 🚀 **适配 Node 22**：采用现代的 `module.exports` 插件导出模式，解决新版本 Node 环境下的作用域与全局变量注入问题。
* 📱 **响应式设计**：全新的 `modern` 布局，采用网格系统（Grid），完美适配手机和电脑端浏览。
* 🔗 **菜单自动注入**：支持将站点地图链接自动插入到主题的导航栏（适配 NexT, Butterfly, Fluid 等主流主题）。
* 📝 **灵活配置**：独立控制分类、文章、页面模块的开关。
* 🚫 **模糊排除**：支持通过标题或路径关键词，精准排除不需要展示的页面（如 404 页、标签页）。
* 🎨 **多布局风格**：内置 3 种布局（Modern 现代 / Simple 简洁 / Rich 丰富）。
* 🔧 **零乱码**：原生支持 UTF-8，完美适配中日韩等非 ASCII 字符。

## 📦 安装

### 方式 1：本地开发（推荐）

如果您正在开发或自定义插件：

1. 在 Hexo 博客根目录下创建目录：`node_modules/hexo-sitemap-html`。
2. 将 `index.js` 和 `package.json` 放入该目录。
3. 在**博客根目录**执行：
```bash
npm install ./node_modules/hexo-sitemap-html

```



### 方式 2：npm 安装（发布后）

```bash
npm install hexo-sitemap-html --save

```

## ⚙️ 配置

在 Hexo 博客根目录的 `_config.yml` 中添加以下配置：

```yaml
# hexo-sitemap-html 配置
html_sitemap:
  path: 'sitemap.html'    # 输出路径
  layout: 'modern'        # 布局选择: modern, simple, rich
  inject_menu: true       # 自动将“站点地图”添加到博客导航栏
  nofollow: true          # 为地图链接添加 rel="nofollow"，避免分散权重
  
  enable:
    categories: true      # 显示分类
    posts: true           # 显示文章
    pages: true           # 显示独立页面

  exclude:                # 排除页面（模糊匹配标题或路径）
    - '404'
    - 'guestbook'
    - '关于我'

```

### 配置项详情

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `path` | String | `sitemap.html` | 生成的文件名。 |
| `layout` | String | `modern` | UI 风格：`modern` (响应式网格), `simple` (纯文本列表), `rich` (带动画的卡片)。 |
| `inject_menu` | Boolean | `false` | 是否自动修改 `theme.menu` 配置，动态注入菜单链接。 |
| `nofollow` | Boolean | `false` | 开启后，生成的链接会带上 `nofollow` 属性。 |
| `exclude` | Array | `[]` | 关键词数组，匹配到的页面将不会出现在站点地图中。 |

## 🚀 使用

1. 清除并生成：
```bash
hexo clean && hexo generate

```


2. 本地预览：
```bash
hexo server

```


3. 访问：`http://localhost:4000/sitemap.html`

## 🎨 布局风格预览

### 1. modern（现代版 - 推荐）

* **特点**：基于 CSS Grid 的卡片系统，响应式布局，极简线条感。
* **适用**：现代技术博客、作品集。

### 2. simple（简洁版）

* **特点**：无装饰列表，加载速度最快。
* **适用**：追求极致简约或极简风主题。

### 3. rich（丰富版）

* **特点**：带悬浮阴影（Hover Shadow）的深色卡片设计。
* **适用**：视觉表现力强的主题。

## ❓ 常见问题

### Q1: 导航栏没有出现“站点地图”链接？

A: `inject_menu` 功能通过内存修改主题配置实现。如果你的主题导航栏配置非常特殊（非 `menu` 或 `navbar` 字段），可能无法自动注入。建议在主题配置中手动添加一行链接。

### Q2: 兼容 Node 22 吗？

A: 是的。针对 Node 22 严格模式下全局 `hexo` 变量获取不到的问题，本项目采用了 Dependency Injection（依赖注入）模式重新编写了入口逻辑。

### Q3: 这会影响 SEO 吗？

A: 不会。此插件生成的 HTML 地图是给**人**看的（方便读者快速定位内容）。如果你需要给搜索引擎看的地图，请同时安装 `hexo-generator-sitemap` 生成 `sitemap.xml`。

## 📄 许可证

本项目采用 **MIT** 许可证。

