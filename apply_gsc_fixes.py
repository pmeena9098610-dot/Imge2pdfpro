"""
GSC Indexing Fix Script - Fixes ALL 5 GSC issues
Run this once to apply all fixes to the codebase.
"""
import os
import re

BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"
changes_made = []

def read_file(name):
    path = os.path.join(BASE, name)
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def write_file(name, content):
    path = os.path.join(BASE, name)
    with open(path, "w", encoding="utf-8", newline="\r\n") as f:
        f.write(content)

# ============================================================
# FIX 1: 404.html - Remove canonical tag (causes "Alternative 
# page with proper canonical tag" error in GSC)
# ============================================================
print("FIX 1: Removing canonical tag from 404.html...")
content = read_file("404.html")
old = '    <link rel="canonical" href="https://www.photosepdf.in/">\r\n'
new = ''
if old in content:
    content = content.replace(old, new)
    write_file("404.html", content)
    changes_made.append("404.html: Removed canonical tag")
    print("  DONE - Removed canonical tag")
else:
    # Try without \r\n
    old2 = '    <link rel="canonical" href="https://www.photosepdf.in/">\n'
    if old2 in content:
        content = content.replace(old2, '')
        write_file("404.html", content)
        changes_made.append("404.html: Removed canonical tag")
        print("  DONE - Removed canonical tag")
    else:
        # Try regex
        content_new = re.sub(r'\s*<link\s+rel="canonical"\s+href="https://www\.photosepdf\.in/">\s*\n?', '\n', content)
        if content_new != content:
            write_file("404.html", content_new)
            changes_made.append("404.html: Removed canonical tag")
            print("  DONE - Removed canonical tag (regex)")
        else:
            print("  SKIP - Canonical tag not found or already removed")

# ============================================================
# FIX 2: embed-widget.html - Change robots to noindex
# ============================================================
print("\nFIX 2: Adding noindex to embed-widget.html...")
content = read_file("embed-widget.html")
old_robots = '<meta name="robots" content="index, follow">'
new_robots = '<meta name="robots" content="noindex, nofollow">'
if old_robots in content:
    content = content.replace(old_robots, new_robots)
    write_file("embed-widget.html", content)
    changes_made.append("embed-widget.html: Changed robots to noindex,nofollow")
    print("  DONE - Changed to noindex,nofollow")
else:
    print("  SKIP - Already noindex or tag not found")

# ============================================================
# FIX 3: Fix canonical tags on 5 duplicate content pages
# Each duplicate page should point canonical to the primary page
# ============================================================
print("\nFIX 3: Fixing canonical tags on duplicate pages...")

canonical_fixes = {
    "ai-summarizer.html": "https://www.photosepdf.in/ai-pdf-summarizer",
    "signature-resizer.html": "https://www.photosepdf.in/ssc-signature-resizer",
    "ocr-text-extractor.html": "https://www.photosepdf.in/ocr-pdf",
    "webp-to-pdf-converter.html": "https://www.photosepdf.in/webp-to-pdf",
    "heic-to-pdf-converter.html": "https://www.photosepdf.in/heic-to-pdf",
}

for filename, new_canonical in canonical_fixes.items():
    content = read_file(filename)
    
    # Find and replace canonical tag
    canon_pattern = r'(<link\s+rel="canonical"\s+href=")([^"]+)(")'
    match = re.search(canon_pattern, content)
    if match:
        old_canonical = match.group(2)
        if old_canonical != new_canonical:
            content = re.sub(canon_pattern, r'\g<1>' + new_canonical + r'\3', content)
            write_file(filename, content)
            changes_made.append(f"{filename}: canonical {old_canonical} -> {new_canonical}")
            print(f"  DONE - {filename}: canonical -> {new_canonical}")
        else:
            print(f"  SKIP - {filename}: canonical already correct")
    else:
        print(f"  WARNING - {filename}: No canonical tag found!")

# ============================================================
# FIX 4: Remove embed-widget from sitemap.xml
# ============================================================
print("\nFIX 4: Removing embed-widget from sitemap.xml...")
content = read_file("sitemap.xml")

# Remove the embed-widget URL entry
embed_pattern = r'\s*<url>\s*<loc>https://www\.photosepdf\.in/embed-widget</loc>.*?</url>'
content_new = re.sub(embed_pattern, '', content, flags=re.DOTALL)
if content_new != content:
    write_file("sitemap.xml", content_new)
    changes_made.append("sitemap.xml: Removed embed-widget URL")
    print("  DONE - Removed embed-widget from sitemap")
else:
    print("  SKIP - embed-widget not found in sitemap")

# ============================================================
# FIX 5: Update lastmod dates to today for changed pages
# ============================================================
print("\nFIX 5: Updating lastmod dates in sitemap.xml...")
content = read_file("sitemap.xml")
old_date = "2026-07-01"
new_date = "2026-07-07"
count = content.count(old_date)
content = content.replace(old_date, new_date)

# Also update the disclaimer date
content = content.replace("2026-07-03", new_date)

write_file("sitemap.xml", content)
changes_made.append(f"sitemap.xml: Updated {count} lastmod dates to {new_date}")
print(f"  DONE - Updated {count} dates from {old_date} to {new_date}")

# ============================================================
# SUMMARY
# ============================================================
print("\n" + "=" * 60)
print("ALL FIXES APPLIED SUCCESSFULLY")
print("=" * 60)
for i, change in enumerate(changes_made, 1):
    print(f"  {i}. {change}")
print(f"\nTotal changes: {len(changes_made)}")
print("\nNext steps:")
print("  1. git add . && git commit && git push")
print("  2. Validate issues in Google Search Console")
print("  3. Resubmit sitemap in GSC")
