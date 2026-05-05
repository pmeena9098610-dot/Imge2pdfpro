# Cleanup Plan

## Core App Files (KEEP - Required)
- index.html (Main app)
- app.js (Core functionality)
- script.js (Preview/sorting)
- sw.js (Service Worker)
- style.css (Styling)
- manifest.json (PWA)
- vercel.json (Deploy)

## Optional Files Analysis

### Article/Blog Pages (17 files - 3.3MB)
These are for SEO/blog purposes, NOT part of core app:
- articles.html
- best-ilovepdf-free-alternative-offline.html
- compress-pdf-100kb.html
- heic-to-pdf-converter.html
- how-to-resize-passport-photo-for-us-visa-pdf.html
- how-to-resize-photo-signature-for-ssc-upsc.html
- image-to-pdf-converter-bengali.html
- image-to-pdf-converter-marathi.html
- image-to-pdf-converter-tamil.html
- image-to-pdf-converter-telugu.html
- image-to-pdf-deutsch.html
- image-to-pdf-espanol.html
- image-to-pdf-francais.html
- image-to-pdf-portugues.html
- jpg-to-pdf-converter-hindi.html
- jpg-to-pdf-mac-iphone-guide.html
- resume-cv-to-pdf-compressor.html
- webp-to-pdf-converter.html
- aadhar-card-photo-to-pdf.html

## Option 1: SLIM (Core Only)
Remove all 19 article pages → 400KB project

## Option 2: FULL (Keep All)
Keep all files → 685KB project

## Recommendation
Move article pages to `/blog` folder to keep project clean while preserving them.
