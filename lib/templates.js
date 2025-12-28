'use strict';

const i18n = {
  'zh-CN': { home:"首页",back:"返回",title: '站点地图', posts: '文章归档', categories: '分类目录', pages: '独立页面', items: '篇内容', updated: '更新于' },
  'en': {  home:"Home",back:"Back",title: 'Sitemap', posts: 'Posts', categories: 'Categories', pages: 'Pages', items: 'items', updated: 'Updated' }
};

const styles = {
  // 风格 1：极致简约 (Minimal) - 衬线体、大留白、呼吸感
  minimal: `
    <style>
      :root { --accent: #111; --text: #1a1a1a; --light: #888; }
      body { font-family: "Optima", "Georgia", serif; background: #fff; color: var(--text); padding: 80px 10%; line-height: 1.8; }
      .container { max-width: 800px; margin: 0 auto; }
      h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 60px; letter-spacing: -2px; }
      h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 4px; color: var(--light); margin-top: 60px; border: none; }
      .list { list-style: none; padding: 0; }
      .item { display: flex; align-items: baseline; margin-bottom: 12px; }
      .item a { text-decoration: none; color: var(--text); font-size: 1.15rem; transition: 0.3s; border-bottom: 1px solid transparent; }
      .item a:hover { border-bottom: 1px solid var(--accent); }
      .dot { flex: 1; border-bottom: 1px dotted #ececec; margin: 0 15px; }
      .meta { font-size: 0.85rem; color: var(--light); font-style: italic; font-family: sans-serif; }
    </style>
  `,
  // 风格 2：扁平克制 (Flat) - 非衬线体、灰度层次、现代感
  flat: `
    <style>
      :root { --bg: #f9f9fb; --primary: #000; --text: #111; --border: #eaeaea; }
      body { font-family: -apple-system, system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 40px; }
      .container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 50px; border: 1px solid var(--border); border-radius: 4px; }
      h1 { font-size: 24px; font-weight: 600; margin-bottom: 30px; }
      h2 { font-size: 14px; font-weight: 600; color: #666; margin: 40px 0 20px; text-transform: uppercase; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; }
      .card { display: block; padding: 16px; border: 1px solid var(--border); text-decoration: none; color: inherit; transition: 0.2s; }
      .card:hover { border-color: var(--primary); background: #fafafa; }
      .card-title { font-weight: 500; display: block; margin-bottom: 4px; }
      .card-meta { font-size: 12px; color: #999; }
    </style>
  `,
  // 风格 3：丰富视觉 (Rich) - 渐变、毛玻璃、动态感
  rich: `
    <style>
      body { background: #f0f2f5; font-family: "Segoe UI", system-ui; padding: 60px 20px; }
      .container { max-width: 900px; margin: 0 auto; }
      h1 { font-size: 3rem; text-align: center; margin-bottom: 50px; background: linear-gradient(45deg, #007aff, #00c6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .section { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
      h2 { color: #333; margin-bottom: 20px; padding-left: 12px; border-left: 5px solid #007aff; }
      .item-link { display: flex; justify-content: space-between; padding: 15px; border-radius: 12px; text-decoration: none; color: #444; transition: all 0.3s; margin-bottom: 5px; }
      .item-link:hover { background: #fff; transform: scale(1.02); box-shadow: 0 5px 15px rgba(0,0,0,0.05); color: #007aff; }
    </style>
  `
};

module.exports = function(layout, lang = 'en') {
  const t = i18n[lang] || i18n['en'];
  const css = styles[layout] || styles.flat;
  return { t, css };
};