import os
import re

target_dir = r"C:\Users\Bappa official\Desktop\image2pdfpro"
target_files = [
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
]

hreflang_block = """    <!-- Global SEO Alternate Hreflang Tags (Google Traffic Preserver) -->
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
    
    <!-- Open Graph for Social Media Sharing -->"""

for f in target_files:
    file_path = os.path.join(target_dir, f)
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        
    modified = False
    
    # 1. Remove rogue router
    router_pattern = re.compile(r'<!-- Smart International Language Router -->[\s\S]*?</script>')
    if router_pattern.search(content):
        content = router_pattern.sub('', content)
        modified = True
        print(f"[{f}] Removed Router")
        
    # 2. Inject hreflangs
    if 'hreflang="x-default"' not in content:
        if '<!-- Open Graph for Social Media Sharing -->' in content:
            content = content.replace('<!-- Open Graph for Social Media Sharing -->', hreflang_block)
            modified = True
            print(f"[{f}] Injected Hreflang")
            
    # 3. Fix FontAwesome Loading
    old_fa = r'<!-- Deferred Icons \(FontAwesome\) -->\s*<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/6\.4\.0/css/all\.min\.css">'
    new_fa = """<!-- Lazy Loaded Icons (FontAwesome for Instant FCP) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>"""
    
    if re.search(old_fa, content):
        content = re.sub(old_fa, new_fa, content)
        modified = True
        print(f"[{f}] Updated FontAwesome")
        
    if modified:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)

print("Global Sync Complete.")
