'use strict';

const _ = require('lodash');
const fs = require('hexo-fs');
const path = require('path');
const getTemplate = require('./lib/templates'); // 引用模板

const DEFAULT_CONFIG = {
  path: 'sitemap.html',
  enable: { categories: true, posts: true, pages: true },
  exclude: [],
  layout: 'minimal', 
  nofollow: false
};

async function createHtmlSitemap(hexo, force = false) {
  const hexoInstance = hexo || this;
  if (!hexoInstance) return;


  const currentCmd = hexoInstance.env?.cmd;
  if (currentCmd === 'server' && !force) {
    hexoInstance.log.info(`[hexo-sitemap-html] Skip generating in server environment (use hexo generate/sitemap-html to generate)`);
    return;
  }

  await hexoInstance.load();
  const urlFor = hexoInstance.extend.helper.get('url_for')?.bind(hexoInstance) || (p => p);
  const config = _.merge({}, DEFAULT_CONFIG, (hexoInstance.config.html_sitemap || {}));
  
  // 获取 i18n 和 CSS
  const lang = hexoInstance.config.language || 'en';
  const { t, css } = getTemplate(config.layout, lang);

  const locals = hexoInstance.locals?.toObject() || {};
  const nofollow = config.nofollow ? 'rel="nofollow"' : '';

 
  const posts = config.enable.posts && locals.posts ? locals.posts.toArray().sort((a,b)=>b.date-a.date) : [];
  const cats = config.enable.categories && locals.categories ? locals.categories.toArray() : [];
  const pages = config.enable.pages && locals.pages ? locals.pages.toArray().filter(p => !config.exclude.some(ex => (p.title||'').includes(ex))) : [];

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${hexoInstance.config.title || 'Hexo Blog'}</title>
  ${css}
</head>
<body>
  <div class="container">

  <nav style="display:flex; gap: 1rem; margin-bottom: 2rem;">
  <a  class="${config.layout === 'minimal' ? '' : 'card item-link'}"  href="/">${t.home || 'Home'}</a>
  <a  class="${config.layout === 'minimal' ? '' : 'card item-link'}"  href="javascript:history.back()">${t.back || 'Back'}</a>
  </nav>

    <h1>${t.title || 'Site Sitemap'}</h1>

    ${posts.length ? `<section class="section"><h2>${t.posts || 'Posts'}</h2><div class="${config.layout === 'flat' ? 'grid' : 'list'}">
      ${posts.map(p => `
        <div class="item">
          <a href="${urlFor(p.path)}" class="${config.layout === 'minimal' ? '' : 'card item-link'}" ${nofollow}>
            <span class="card-title">${p.title || 'Untitled'}</span>
          </a>
          ${config.layout === 'minimal' ? `<div class="dot"></div>` : ''}
          <span class="meta card-meta">${p.date ? p.date.format('YYYY-MM-DD') : 'No Date'}</span>
        </div>`).join('')}
    </div></section>` : ''}

    ${cats.length ? `<section class="section"><h2>${t.categories || 'Categories'}</h2><div class="${config.layout === 'flat' ? 'grid' : 'list'}">
      ${cats.map(c => `
        <div class="item">
          <a href="${urlFor(c.path)}" class="${config.layout === 'minimal' ? '' : 'card item-link'}" ${nofollow}>
            <span class="card-title">${c.name || 'Uncategorized'}</span>
          </a>
          ${config.layout === 'minimal' ? `<div class="dot"></div>` : ''}
          <span class="meta card-meta">${c.posts ? c.posts.length : 0} ${t.items || 'Items'}</span>
        </div>`).join('')}
    </div></section>` : ''}

   
    ${pages.length ? `<section class="section"><h2>${t.pages || 'Pages'}</h2><div class="${config.layout === 'flat' ? 'grid' : 'list'}">
      ${pages.map(p => `
        <div class="item">
          <a href="${urlFor(p.path)}" class="${config.layout === 'minimal' ? '' : 'card item-link'}" ${nofollow}>
            <span class="card-title">${p.title || 'Untitled Page'}</span>
          </a>
          ${config.layout === 'minimal' ? `<div class="dot"></div>` : ''}
          <span class="meta card-meta">${p.date ? p.date.format('YYYY-MM-DD') : 'No Date'}</span>
        </div>`).join('')}
    </div></section>` : ''}
  </div>
</body>
</html>`;

  const dest = path.join(hexoInstance.public_dir || './public', config.path);
  
  // 优化：增加文件存在性判断，避免强制删除不存在的文件
  if (force && await fs.exists(dest)) {
    await fs.unlink(dest);
  }
  
  // 写入文件
  await fs.writeFile(dest, html);
  hexoInstance.log.info(`[hexo-sitemap-html] Generated: ${config.path} with ${config.layout} style`);
}


  // 注册生成器钩子
  hexo.extend.generator.register('html-sitemap', function() {
    return createHtmlSitemap(this);
  });

  // 注册独立控制台命令
  hexo.extend.console.register('sitemap-html', 'Generate HTML sitemap', {
    options: [{ name: '-f, --force', desc: 'Overwrite existing sitemap.html' }]
  }, async function(args) {
    return createHtmlSitemap(this, args.f || args.force);
  });
