


# hexo-sitemap-html

[![npm version](https://img.shields.io/npm/v/hexo-sitemap-html.svg?style=flat-square)](https://www.npmjs.com/package/hexo-sitemap-html) [![npm downloads](https://img.shields.io/npm/dm/hexo-sitemap-html.svg?style=flat-square)](https://www.npmjs.com/package/hexo-sitemap-html) [![License](https://img.shields.io/npm/l/hexo-sitemap-html.svg?style=flat-square)](LICENSE) [![GitHub Stars](https://img.shields.io/github/stars/2winter-dev/hexo-sitemap-html.svg?style=flat-square)](https://github.com/2winter-dev/hexo-sitemap-html)

A **modern, responsive, and highly configurable** Hexo plugin to generate elegant HTML sitemaps. Fully compatible with **Node 22+** and **Hexo 6.x**.

> 📌  [中文版本 (Chinese Version)](./docs/zh-CN/README.md)



## ✨ Core Features

* 🚀 **Node 22 Ready**: Uses the modern `module.exports` pattern to ensure perfect compatibility with the latest Node.js environments.
* 📱 **Responsive Design**: Brand new `modern` layout with a card-grid system that looks great on mobile and desktop.
* 📝 **Flexible Configuration**: Independently enable/disable categories, posts, or pages.
* 🚫 **Fuzzy Exclusion**: Precisely exclude unwanted pages (e.g., 404, tags) using keywords in titles or paths.
* 🎨 **Multiple Layouts**: Built-in styles including `Modern`, `Simple`, and `Rich`.
* 🔧 **Native UTF-8**: Zero garbled characters, perfect for CJK (Chinese, Japanese, Korean) content.

## 📦 Installation

### Method 1: Local Development (Manual)

If you are developing or customizing the plugin:

1. In your Hexo blog root, create the folder: `node_modules/hexo-sitemap-html`.
2. Place `index.js` and `package.json` inside.
3. In your **blog root**, run:
```bash
npm install ./node_modules/hexo-sitemap-html

```



### Method 2: Via npm (Standard)

```bash
npm install hexo-sitemap-html --save

```

## ⚙️ Configuration

Add the following to your Hexo root `_config.yml`:

```yaml
# hexo-sitemap-html Configuration
html_sitemap:
  path: 'sitemap.html'    # Output path
  layout: 'modern'        # Options: modern, simple, rich
  inject_menu: true       # Auto-add "Sitemap" to your blog navigation
  nofollow: true          # Add rel="nofollow" to sitemap links
  
  enable:
    categories: true      # Show categories section
    posts: true           # Show posts section
    pages: true           # Show standalone pages section

  exclude:                # Fuzzy match title or path to hide pages
    - '404'
    - 'guestbook'
    - 'About Me'

```

### Configuration Details

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | String | `sitemap.html` | The filename of the generated sitemap. |
| `layout` | String | `modern` | UI Style: `modern` (Grid), `simple` (List), `rich` (Animated Cards). |
| `inject_menu` | Boolean | `false` | Dynamically injects the sitemap link into `theme.menu`. |
| `nofollow` | Boolean | `false` | If true, search engines won't follow the sitemap links. |
| `exclude` | Array | `[]` | Keywords to filter out specific pages from the sitemap. |

## 🚀 Usage

1. Clean and generate:
```bash
hexo clean && hexo generate

```


2. Start local server:
```bash
hexo server

```


3. Visit: `http://localhost:4000/sitemap.html`

## 🎨 Layout Previews

### 1. Modern Layout (New!)

* **Features**: CSS-Grid card system, mobile-friendly, clean typography.
* **Best for**: Modern tech blogs and large portfolios.

### 2. Simple Layout

* **Features**: Minimalist text list, fast loading, no-distraction design.
* **Best for**: Personal diaries or minimal sites.

### 3. Rich Layout

* **Features**: Card-based design with hover animations and deeper shadows.
* **Best for**: Visually-driven blogs.

## ❓ FAQ

### Q1: The Sitemap is not showing in my Menu?

A: `inject_menu` works by modifying `theme.config.menu` in memory. If your theme uses a non-standard menu structure (not `menu` or `navbar`), you may need to add the link manually to your theme's `_config.yml`.

### Q2: Is it compatible with Node 22?

A: Yes! This version uses the Dependency Injection pattern (`module.exports = function(hexo)...`) which is the safest way to handle plugins in Node 22/Hexo 6.

### Q3: How to customize the CSS?

A: You can find the `<style>` tags in `index.js` under the `LAYOUT_STYLES` constant. Feel free to modify the colors or fonts to match your specific theme.

## 🤝 Contributing

1. Fork the repo.
2. Create your branch (`git checkout -b feature/AmazingFeature`).
3. Commit (`git commit -m 'Add some feature'`).
4. Push to the branch and open a Pull Request.

## 📄 License

This project is licensed under the **MIT License**.
