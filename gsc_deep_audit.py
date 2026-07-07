"""
Ultra-Deep GSC Audit Script
Analyzes ALL 5 GSC issues:
1. Page with redirect (5 pages)
2. Alternative page with proper canonical tag (1 page)
3. Crawled - currently not indexed (11 pages)
4. Not found 404 (3 pages)
5. Discovered - currently not indexed (131 pages)
"""
import os
import re
import xml.etree.ElementTree as ET

BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"

# 1. Parse sitemap.xml to get all URLs
tree = ET.parse(os.path.join(BASE, "sitemap.xml"))
root = tree.getroot()
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap_urls = set()
sitemap_paths = set()
for url_elem in root.findall("s:url", ns):
    loc = url_elem.find("s:loc", ns).text.strip()
    sitemap_urls.add(loc)
    # Extract path part
    path = loc.replace("https://www.photosepdf.in/", "").replace("https://www.photosepdf.in", "")
    if path == "":
        path = "index"
    sitemap_paths.add(path)

# 2. Get all HTML files
html_files = set()
for f in os.listdir(BASE):
    if f.endswith(".html"):
        html_files.add(f[:-5])  # Remove .html

print("=" * 70)
print("ULTRA-DEEP GSC AUDIT REPORT")
print("=" * 70)

# 3. Files in HTML but NOT in sitemap
print("\n📌 ISSUE: HTML files NOT in sitemap.xml")
missing_from_sitemap = html_files - sitemap_paths - {"404", "index"}
# index is mapped to / in sitemap
if "index" in html_files and "/" not in sitemap_paths:
    pass  # Already accounted for via the homepage URL
for f in sorted(missing_from_sitemap):
    print(f"  ❌ {f}.html → NOT in sitemap")
if not missing_from_sitemap:
    print("  ✅ All HTML files are in sitemap.xml")

# 4. Sitemap URLs with NO matching HTML file  
print("\n📌 ISSUE: Sitemap URLs with NO matching HTML file (POTENTIAL 404s)")
missing_html = sitemap_paths - html_files - {""}
for path in sorted(missing_html):
    filepath = os.path.join(BASE, path + ".html")
    if not os.path.exists(filepath):
        print(f"  ❌ {path} → sitemap has it but {path}.html DOES NOT EXIST → 404!")
    
# 5. Check redirect sources - do they have HTML files?
print("\n📌 ISSUE: Redirect sources in vercel.json")
redirect_sources = [
    "/image-to-pdf",
    "/pdf-compress",
    "/pdf-merge",
    "/photo-resizer",
    "/aadhaar-pdf-maker"
]
redirect_dest = {
    "/image-to-pdf": "/jpg-to-pdf",
    "/pdf-compress": "/compress-pdf",
    "/pdf-merge": "/merge-pdf",
    "/photo-resizer": "/ssc-photo-resizer",
    "/aadhaar-pdf-maker": "/aadhar-card-pdf-maker"
}
for src in redirect_sources:
    slug = src.lstrip("/")
    html_exists = os.path.exists(os.path.join(BASE, slug + ".html"))
    in_sitemap = slug in sitemap_paths
    dest = redirect_dest[src]
    print(f"  Redirect: {src} → {dest}")
    if html_exists:
        print(f"    ⚠️  {slug}.html EXISTS! This causes 'Page with redirect' error.")
        print(f"    FIX: Delete {slug}.html (the redirect will handle it)")
    if in_sitemap:
        print(f"    ⚠️  {slug} is STILL in sitemap.xml! Remove it!")
    print()

# 6. Check canonical tags on ALL HTML files
print("\n📌 ISSUE: Canonical Tag Audit (checking for mismatches)")
canonical_issues = []
for f in sorted(html_files):
    filepath = os.path.join(BASE, f + ".html")
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()
        # Find canonical tag
        canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content)
        if canonical_match:
            canon_url = canonical_match.group(1)
            # Expected canonical
            if f == "index":
                expected = "https://www.photosepdf.in/"
            else:
                expected = f"https://www.photosepdf.in/{f}"
            
            if canon_url != expected:
                canonical_issues.append((f, canon_url, expected))
                print(f"  ❌ {f}.html: canonical='{canon_url}' but expected='{expected}'")
        else:
            print(f"  ⚠️  {f}.html: NO canonical tag found!")
    except Exception as e:
        print(f"  ERROR reading {f}.html: {e}")

if not canonical_issues:
    print("  (No canonical mismatches detected in files that have canonicals)")

# 7. Check for duplicate/near-duplicate titles (thin content signal)
print("\n📌 ISSUE: Duplicate/Similar Titles (thin content signal for 'Crawled not indexed')")
titles = {}
for f in sorted(html_files):
    filepath = os.path.join(BASE, f + ".html")
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read(5000)  # Read first 5KB
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if title_match:
            title = title_match.group(1).strip()
            if title in titles:
                titles[title].append(f)
            else:
                titles[title] = [f]
    except:
        pass

dup_count = 0
for title, files in sorted(titles.items()):
    if len(files) > 1:
        dup_count += 1
        print(f"  ❌ DUPLICATE TITLE: '{title[:80]}...'")
        for ff in files:
            print(f"      → {ff}.html")
if dup_count == 0:
    print("  ✅ No exact duplicate titles found")

# 8. Check for meta description duplicates
print("\n📌 ISSUE: Duplicate Meta Descriptions")
descriptions = {}
for f in sorted(html_files):
    filepath = os.path.join(BASE, f + ".html")
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read(8000)
        desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.IGNORECASE)
        if desc_match:
            desc = desc_match.group(1).strip()
            if desc in descriptions:
                descriptions[desc].append(f)
            else:
                descriptions[desc] = [f]
        else:
            print(f"  ⚠️  {f}.html: NO meta description!")
    except:
        pass

desc_dup = 0
for desc, files in sorted(descriptions.items()):
    if len(files) > 1:
        desc_dup += 1
        print(f"  ❌ DUPLICATE DESC ({len(files)} pages): '{desc[:80]}...'")
        for ff in files:
            print(f"      → {ff}.html")
if desc_dup == 0:
    print("  ✅ No exact duplicate descriptions found")

# 9. Check for redirect source slugs in sitemap
print("\n📌 ISSUE: Redirect URLs that are STILL in sitemap (causes 'Page with redirect')")
redirect_slugs_in_sitemap = []
for src in redirect_sources:
    slug = src.lstrip("/")
    full_url = f"https://www.photosepdf.in/{slug}"
    if full_url in sitemap_urls or slug in sitemap_paths:
        redirect_slugs_in_sitemap.append(slug)
        print(f"  ❌ {full_url} is in sitemap but it REDIRECTS → REMOVE FROM SITEMAP!")
if not redirect_slugs_in_sitemap:
    print("  ✅ No redirect sources found in sitemap")

# 10. Check for embed-widget in sitemap (should it be noindex?)
print("\n📌 ISSUE: Pages that should probably be noindex")
noindex_candidates = ["embed-widget", "404"]
for page in noindex_candidates:
    if page in sitemap_paths:
        print(f"  ⚠️  {page} is in sitemap - consider removing if it's a utility page")

# 11. Check robots.txt  
print("\n📌 robots.txt Audit")
robots_path = os.path.join(BASE, "robots.txt")
if os.path.exists(robots_path):
    with open(robots_path, "r") as f:
        robots_content = f.read()
    print(f"  Content:\n{robots_content}")
else:
    print("  ❌ robots.txt MISSING!")

# 12. Summary
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"  Total HTML files:           {len(html_files)}")
print(f"  Total sitemap URLs:         {len(sitemap_urls)}")
print(f"  Missing from sitemap:       {len(missing_from_sitemap)}")
print(f"  Canonical mismatches:       {len(canonical_issues)}")
print(f"  Duplicate titles:           {dup_count}")
print(f"  Duplicate descriptions:     {desc_dup}")
print(f"  Redirects still in sitemap: {len(redirect_slugs_in_sitemap)}")
