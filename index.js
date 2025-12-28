'use strict';

const _ = require('lodash');
const fs = require('hexo-fs');
const path = require('path');

// 默认配置
const DEFAULT_CONFIG = {
  path: 'sitemap.html',
  enable: {
    categories: true,
    posts: true,
    pages: true
  },
  exclude: [],
  layout: 'modern', // 默认使用新模板
  nofollow: false
};

const LAYOUT_STYLES = {
  simple: `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; color: #333; line-height: 1.6; }
      h1 { text-align: center; margin-bottom: 2rem; color: #2c3e50; }
      .section { margin-bottom: 3rem; }
      h2 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem; color: #34495e; }
      .list { list-style: none; }
      .list-item { padding: 0.5rem 0; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between; }
      .list-item a { color: #3498db; text-decoration: none; }
      .list-item a:hover { color: #2980b9; text-decoration: underline; }
      .meta { color: #95a5a6; font-size: 0.9em; }
    </style>
  `,
  modern: `
    <style>
      :root { --primary: #6366f1; --bg: #f8fafc; --card: #ffffff; --text: #1e293b; --text-light: #64748b; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: "Inter", system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 3rem 1rem; line-height: 1.5; }
      .container { max-width: 1000px; margin: 0 auto; }
      header { text-align: center; margin-bottom: 4rem; }
      h1 { font-size: 2.5rem; font-weight: 800; color: var(--text); margin-bottom: 1rem; }
      .section { margin-bottom: 4rem; }
      h2 { font-size: 1.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
      h2::before { content: ''; display: inline-block; width: 4px; height: 1.5rem; background: var(--primary); border-radius: 4px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
      .card { background: var(--card); padding: 1.25rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s; border: 1px solid #e2e8f0; text-decoration: none; display: block; }
      .card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: var(--primary); }
      .card-title { display: block; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .card-meta { font-size: 0.875rem; color: var(--text-light); }
      @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
    </style>
  `
};

function formatDate(date) {
  if (!date) return 'No Date';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

async function createHtmlSitemap(hexo, force = false) {
  const config = _.merge({}, DEFAULT_CONFIG, hexo.config.html_sitemap || {});
  
  // 校验布局
  if (!LAYOUT_STYLES[config.layout]) {
    hexo.log.warn(`[hexo-sitemap-html] Invalid layout: ${config.layout}, fallback to modern`);
    config.layout = 'modern';
  }

  const nofollowAttr = config.nofollow ? 'rel="nofollow"' : '';
  const { categories, posts, pages } = hexo.site;

  // 1. 处理数据
  const postList = config.enable.posts ? posts.sort('date', 'desc').map(p => ({
    title: p.title || 'Untitled',
    path: hexo.url_for(p.path),
    date: formatDate(p.date)
  })) : [];

  const categoryList = config.enable.categories ? categories.map(c => ({
    name: c.name || 'Uncategorized',
    path: hexo.url_for(c.path),
    count: c.posts.length
  })) : [];

  const pageList = config.enable.pages ? pages.filter(p => {
    const isExcluded = config.exclude.some(ex => p.title?.includes(ex) || p.path?.includes(ex));
    return !isExcluded && p.path;
  }).map(p => ({
    title: p.title || 'Untitled Page',
    path: hexo.url_for(p.path),
    date: formatDate(p.date)
  })) : [];

  // 2. 生成 HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="${hexo.config.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Map - ${hexo.config.title}</title>
  ${LAYOUT_STYLES[config.layout]}
</head>
<body>
  <div class="container">
    <header>
      <h1>Site Map</h1>
      <p style="color: #64748b;">Total ${postList.length} posts, ${categoryList.length} categories</p>
    </header>

    ${postList.length ? `
    <div class="section">
      <h2>Posts</h2>
      <div class="grid">
        ${postList.map(item => `
          <a href="${item.path}" class="card" ${nofollowAttr}>
            <span class="card-title">${item.title}</span>
            <span class="card-meta">Published: ${item.date}</span>
          </a>
        `).join('')}
      </div>
    </div>` : ''}

    ${categoryList.length ? `
    <div class="section">
      <h2>Categories</h2>
      <div class="grid">
        ${categoryList.map(item => `
          <a href="${item.path}" class="card" ${nofollowAttr}>
            <span class="card-title">${item.name}</span>
            <span class="card-meta">${item.count} articles</span>
          </a>
        `).join('')}
      </div>
    </div>` : ''}

    ${pageList.length ? `
    <div class="section">
      <h2>Pages</h2>
      <div class="grid">
        ${pageList.map(item => `
          <a href="${item.path}" class="card" ${nofollowAttr}>
            <span class="card-title">${item.title}</span>
            <span class="card-meta">Updated: ${item.date}</span>
          </a>
        `).join('')}
      </div>
    </div>` : ''}
  </div>
</body>
</html>`;

  const outputPath = path.join(hexo.public_dir, config.path);
  
  if (force && await fs.exists(outputPath)) {
    await fs.unlink(outputPath);
  }

  await fs.writeFile(outputPath, htmlContent, 'utf8');
  hexo.log.info(`[hexo-sitemap-html] Generated: ${config.path}`);
  return outputPath;
}

// 插件入口
module.exports = function(hexo) {
  // 生成器：hexo g 时自动运行
  hexo.extend.generator.register('html-sitemap', function(locals) {
    return createHtmlSitemap(this);
  });

  // 独立命令：hexo sitemap-html 运行
  hexo.extend.command.register('sitemap-html', {
    desc: '独立生成 HTML 站点地图',
    options: [
      { name: 'force', alias: 'f', desc: '强制覆盖已有文件', type: Boolean }
    ]
  }, async function(args) {
    try {
      await createHtmlSitemap(this, args.f || args.force);
    } catch (e) {
      this.log.error(`[hexo-sitemap-html] Failed: ${e.message}`);
    }
  });
};