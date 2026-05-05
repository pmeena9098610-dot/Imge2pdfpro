const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\Bappa official\\Desktop\\image2pdfpro';

const targetFiles = [
    'image-to-pdf-espanol.html',
    'image-to-pdf-francais.html',
    'image-to-pdf-deutsch.html',
    'image-to-pdf-portugues.html',
    'image-to-pdf-converter-bengali.html',
    'image-to-pdf-converter-tamil.html',
    'image-to-pdf-converter-telugu.html',
    'image-to-pdf-converter-marathi.html',
    'jpg-to-pdf-converter-hindi.html',
    'how-to-resize-passport-photo-for-us-visa-pdf.html',
    'how-to-resize-photo-signature-for-ssc-upsc.html',
    'webp-to-pdf-converter.html',
    'articles.html',
    'compress-pdf-100kb.html',
    'best-ilovepdf-free-alternative-offline.html',
    'aadhar-card-photo-to-pdf.html'
];

const hreflangBlock = `    <!-- Global SEO Alternate Hreflang Tags (Google Traffic Preserver) -->
    <link rel="alternate" hreflang="x-default" href="https://photosepdf.in/" />
    <link rel="alternate" hreflang="en" href="https://photosepdf.in/" />
    <link rel="alternate" hreflang="es" href="https://photosepdf.in/image-to-pdf-espanol.html" />
    <link rel="alternate" hreflang="fr" href="https://photosepdf.in/image-to-pdf-francais.html" />
    <link rel="alternate" hreflang="de" href="https://photosepdf.in/image-to-pdf-deutsch.html" />
    <link rel="alternate" hreflang="pt" href="https://photosepdf.in/image-to-pdf-portugues.html" />
    <link rel="alternate" hreflang="hi" href="https://photosepdf.in/jpg-to-pdf-converter-hindi.html" />
    <link rel="alternate" hreflang="bn" href="https://photosepdf.in/image-to-pdf-converter-bengali.html" />
    <link rel="alternate" hreflang="ta" href="https://photosepdf.in/image-to-pdf-converter-tamil.html" />
    <link rel="alternate" hreflang="te" href="https://photosepdf.in/image-to-pdf-converter-telugu.html" />
    <link rel="alternate" hreflang="mr" href="https://photosepdf.in/image-to-pdf-converter-marathi.html" />
    
    <!-- Open Graph for Social Media Sharing -->`;

// Regex to capture the smart router block
const routerRegex = /<!-- Smart International Language Router -->[\s\S]*?<\/script>/;

// Regex to capture where we inject hreflang (replace the start of OG tags)
const ogRegex = /<!-- Open Graph for Social Media Sharing -->/;

for (let file of targetFiles) {
    let filePath = path.join(targetDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file}, not found.`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove rogue router
    if (routerRegex.test(content)) {
        content = content.replace(routerRegex, '');
        modified = true;
        console.log(`[${file}] Removed Router.`);
    }

    // 2. Inject hreflangs if not present
    if (!content.includes('hreflang="x-default"')) {
        if (ogRegex.test(content)) {
            content = content.replace(ogRegex, hreflangBlock);
            modified = true;
            console.log(`[${file}] Injected Hreflang.`);
        }
    }

    // 3. Fix FontAwesome Lazy loading
    const oldFa = /<!-- Deferred Icons \(FontAwesome\) -->\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/;
    const newFa = `<!-- Lazy Loaded Icons (FontAwesome for Instant FCP) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>`;
    
    if (oldFa.test(content)) {
        content = content.replace(oldFa, newFa);
        modified = true;
        console.log(`[${file}] Updated FontAwesome.`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

console.log("Global Sync Complete.");
