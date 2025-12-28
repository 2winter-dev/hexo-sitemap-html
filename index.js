'use strict';

const _ = require('lodash');
const fs = require('hexo-fs');
const path = require('path');
const getTemplate = require('./lib/templates'); // 引用模板

const DEFAULT_CONFIG = {
  path: 'sitemap.html',
  enable: { categories: true, posts: true, pages: true },
  exclude: [],
  layout: 'minimal', // 默认改用简约风
  nofollow: false
};

async function createHtmlSitemap(hexo, force = false) {
  const hexoInstance = hexo || this;
  if (!hexoInstance) return;

  await hexoInstance.load();
  const urlFor = hexoInstance.extend.helper.get('url_for').bind(hexoInstance);
  const config = _.merge({}, DEFAULT_CONFIG, (hexoInstance.config.html_sitemap || {}));
  
  // 获取 i18n 和 CSS
  const lang = hexoInstance.config.language || 'en';
  const { t, css } = getTemplate(config.layout, lang);

  const locals = hexoInstance.locals.toObject();
  const nofollow = config.nofollow ? 'rel="nofollow"' : '';

  // 处理数据（逻辑同前，仅抽取数据）
  const posts = config.enable.posts ? locals.posts.toArray().sort((a,b)=>b.date-a.date) : [];
  const cats = config.enable.categories ? locals.categories.toArray() : [];
  const pages = config.enable.pages ? locals.pages.toArray().filter(p => !config.exclude.some(ex => (p.title||'').includes(ex))) : [];

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${t.title} - ${hexoInstance.config.title}</title>
  ${css}
</head>
<body>
  <div class="container">

  <nav style="display:flex;">
  <a  class="${config.layout === 'minimal' ? '' : 'card item-link'}"  href="/">${t.home}</a>
  <a  class="${config.layout === 'minimal' ? '' : 'card item-link'}"  href="javascript:history.back()">${t.back}</a>
  </nav>

    <h1>${t.title}</h1>

    ${posts.length ? `<section class="section"><h2>${t.posts}</h2><div class="${config.layout === 'flat' ? 'grid' : 'list'}">
      ${posts.map(p => `
        <div class="item">
          <a href="${urlFor(p.path)}" class="${config.layout === 'minimal' ? '' : 'card item-link'}" ${nofollow}>
            <span class="card-title">${p.title || 'Untitled'}</span>
          </a>
          ${config.layout === 'minimal' ? `<div class="dot"></div>` : ''}
          <span class="meta card-meta">${p.date.format('YYYY-MM-DD')}</span>
        </div>`).join('')}
    </div></section>` : ''}

    ${cats.length ? `<section class="section"><h2>${t.categories}</h2><div class="${config.layout === 'flat' ? 'grid' : 'list'}">
      ${cats.map(c => `
        <div class="item">
          <a href="${urlFor(c.path)}" class="${config.layout === 'minimal' ? '' : 'card item-link'}" ${nofollow}>
            <span class="card-title">${c.name}</span>
          </a>
          ${config.layout === 'minimal' ? `<div class="dot"></div>` : ''}
          <span class="meta card-meta">${c.posts.length} ${t.items}</span>
        </div>`).join('')}
    </div></section>` : ''}
  </div>
</body>
</html>`;

  const dest = path.join(hexoInstance.public_dir, config.path);
  if (force && await fs.exists(dest)) await fs.unlink(dest);
  await fs.writeFile(dest, html);
  hexoInstance.log.info(`[hexo-sitemap-html] Generated: ${config.path} with ${config.layout} style`);
}

  hexo.extend.generator.register('html-sitemap', function() { return createHtmlSitemap(this); });
  hexo.extend.console.register('sitemap-html', 'Generate HTML sitemap', {
    options: [{ name: '-f, --force', desc: 'Overwrite' }]
  }, function(args) { return createHtmlSitemap(this, args.f || args.force); });
