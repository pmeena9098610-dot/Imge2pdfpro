import os, re

BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"

# Check all HTML files for internal links pointing to redirect sources
redirect_sources = ["image-to-pdf", "pdf-compress", "pdf-merge", "photo-resizer", "aadhaar-pdf-maker"]
# Also check for links to non-www version or .html extension links
problems = {src: [] for src in redirect_sources}
non_www_links = []
html_ext_links = []

for fname in sorted(os.listdir(BASE)):
    if not fname.endswith(".html"):
        continue
    filepath = os.path.join(BASE, fname)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Check for redirect source links
    for src in redirect_sources:
        # Match href="/image-to-pdf" or href="image-to-pdf" etc.
        pattern = r'href="[^"]*/' + re.escape(src) + r'(?:"|/)'
        if re.search(pattern, content):
            problems[src].append(fname)
    
    # Check for non-www links
    if "photosepdf.in" in content:
        # Find http://photosepdf.in or https://photosepdf.in (without www)
        matches = re.findall(r'https?://photosepdf\.in[^"]*', content)
        if matches:
            non_www_links.append((fname, matches[:3]))

    # Check for .html extension in internal links 
    html_links = re.findall(r'href="(?:https://www\.photosepdf\.in)?/[a-z-]+\.html"', content)
    if html_links:
        html_ext_links.append((fname, html_links[:3]))

print("=== Internal links pointing to REDIRECT source URLs ===")
for src, files in problems.items():
    if files:
        print(f"  /{src} linked from: {', '.join(files[:5])}")
    else:
        print(f"  /{src} - no internal links found (OK)")

print("\n=== Links to non-www domain (causes redirect chain) ===")
for fname, links in non_www_links[:10]:
    print(f"  {fname}: {links}")
if not non_www_links:
    print("  None found (OK)")

print("\n=== Links with .html extension (unnecessary redirect) ===")
for fname, links in html_ext_links[:10]:
    print(f"  {fname}: {links}")
if not html_ext_links:
    print("  None found (OK)")

# Check the 404.html canonical issue
print("\n=== 404.html canonical check ===")
with open(os.path.join(BASE, "404.html"), "r", encoding="utf-8", errors="ignore") as f:
    c404 = f.read()
canon = re.search(r'rel="canonical"\s+href="([^"]+)"', c404)
if canon:
    print(f"  Canonical: {canon.group(1)}")
    print(f"  This points to homepage, which makes 404 'Alternative page with proper canonical' in GSC")

# Check embed-widget.html for noindex
print("\n=== embed-widget.html robots check ===")
with open(os.path.join(BASE, "embed-widget.html"), "r", encoding="utf-8", errors="ignore") as f:
    ew = f.read()
if "noindex" in ew:
    print("  Has noindex tag (OK)")
else:
    print("  NO noindex tag - Google will try to index this utility page")
    
# Check cookies.html
print("\n=== cookies.html check ===")
cookies_path = os.path.join(BASE, "cookies.html")
if os.path.exists(cookies_path):
    with open(cookies_path, "r", encoding="utf-8", errors="ignore") as f:
        ccc = f.read()
    canon2 = re.search(r'rel="canonical"\s+href="([^"]+)"', ccc)
    if canon2:
        print(f"  Canonical: {canon2.group(1)}")
    print(f"  In sitemap: YES")
else:
    print("  File does not exist!")
