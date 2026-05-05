# Image2PDF Pro - Project Setup Guide

## 🚀 Project Information
- **Repository**: https://github.com/pmeena9098610-dot/Imge2pdfpro
- **Branch**: main
- **Current Commit**: 7dd88e6 (Bug fixes applied)

## 📋 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pmeena9098610-dot/Imge2pdfpro.git
cd Imge2pdfpro
```

### 2. Dependencies
This is a **pure frontend project** - No npm/package installation needed!
- Uses CDN for libraries (jsPDF, SortableJS, FontAwesome, etc.)
- 100% offline capable

### 3. Run Locally
```bash
# Option A: Simple HTTP server
python -m http.server 8000

# Option B: Node.js http-server
npx http-server

# Option C: Live Server (VS Code)
- Install "Live Server" extension
- Right-click index.html → Open with Live Server
```

Then visit: `http://localhost:8000`

## 📁 Project Structure
```
.
├── index.html                          # Main app
├── app.js                              # Core functionality (856 lines)
├── script.js                           # Sorting & preview logic (418 lines)
├── sw.js                               # Service Worker
├── style.css                           # Styling (848 lines)
├── manifest.json                       # PWA manifest
├── vercel.json                         # Vercel deployment config
├── [language-pages].html               # Localized versions
└── SETUP.md                            # This file
```

## 🔧 Key Features
- ✅ Image to PDF conversion (JPG, PNG, HEIC, WebP, GIF, BMP)
- ✅ Drag & drop reordering
- ✅ Multiple layout options (1, 2, 4 per page)
- ✅ Passport photo generator
- ✅ PDF compression (100KB-200KB)
- ✅ 100% offline - no server uploads
- ✅ Password protection
- ✅ Dark mode support
- ✅ Progressive Web App (PWA)

## 🐛 Recent Bug Fixes
- Fixed sorting function parameter issues
- Fixed HEIC filename handling
- Improved drag-drop reordering logic

## 📤 Git Workflow

### Check Status
```bash
git status
```

### Make Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

## 🌐 Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Notes
- Service Worker enables offline functionality
- All processing happens client-side
- PWA can be installed on mobile/desktop
- CSS is mobile-responsive

## 🔗 GitHub Repository
https://github.com/pmeena9098610-dot/Imge2pdfpro

---
*Last Updated: 2026-05-05*
