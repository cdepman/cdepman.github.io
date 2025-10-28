# Charlie Depman's Portfolio Website

A modern, interactive personal portfolio website featuring an innovative D3.js-powered menu system. Built with vanilla JavaScript and modern web standards.

## Features

- **Interactive D3.js Menu**: Draggable, physics-based circular menu on the landing page
- **Portfolio Sections**: Software projects, design work, photography, and writing
- **Responsive Design**: Mobile-friendly layout using Materialize CSS
- **Modern Build System**: Vite for fast development and optimized production builds
- **Zero Framework Dependencies**: Pure vanilla JavaScript for maximum performance

## Tech Stack

- **D3.js v7**: Data visualization and interactive menu
- **Vite 6**: Modern build tooling and dev server
- **Materialize CSS**: Responsive UI framework
- **Font Awesome 6**: Icon library
- **Vanilla JavaScript**: ES6+ modules, no frameworks

## Development

### Prerequisites

- Node.js 18+ (specified in `.nvmrc`)
- npm 9+

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start dev server at http://localhost:8000
npm run dev
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Format code with Prettier
npm run format

# Lint JavaScript
npm run lint
```

## Project Structure

```
├── app/
│   ├── assets/          # Images, resume, logos
│   ├── myWork/          # Portfolio section HTML files
│   │   ├── software/
│   │   ├── design/
│   │   ├── photography/
│   │   └── writing/
│   ├── styles/          # CSS files
│   ├── menu.js          # D3.js interactive menu
│   ├── router.js        # Client-side router
│   └── myWork.html      # Portfolio container page
├── index.html           # Landing page
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Deployment

This site is deployed to GitHub Pages. The custom domain is configured via the `CNAME` file.

### Manual Deployment

```bash
# Build and deploy
npm run build
# Copy dist/ contents to gh-pages branch
```

## Modernization (v2.0)

This repository was recently modernized from a 6+ year old codebase:

### What Changed

- ✅ Migrated from AngularJS 1.3 to vanilla JavaScript
- ✅ Upgraded D3.js from v3 to v7
- ✅ Replaced Bower with npm
- ✅ Removed jQuery dependencies
- ✅ Added Vite build system
- ✅ Updated to Google Analytics 4
- ✅ Modernized all dependencies
- ✅ Added ESLint and Prettier
- ✅ Improved accessibility and SEO

### What Stayed the Same

- ✨ The unique interactive D3.js menu
- 🎨 The visual design and color scheme
- 📱 Mobile-responsive layout
- 🖼️ All portfolio content and images

## License

MIT

## Author

**Charlie Depman**
- GitHub: [@cdepman](https://github.com/cdepman)
- Website: [depman.dev](https://depman.dev)
- Email: cdepman@gmail.com
