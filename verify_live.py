import urllib.request, re

urls = {
    "404 page": "https://www.photosepdf.in/404",
    "embed-widget": "https://www.photosepdf.in/embed-widget",
    "ai-summarizer": "https://www.photosepdf.in/ai-summarizer",
    "signature-resizer": "https://www.photosepdf.in/signature-resizer",
    "ocr-text-extractor": "https://www.photosepdf.in/ocr-text-extractor",
}

for desc, url in urls.items():
    try:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0")
        resp = urllib.request.urlopen(req, timeout=10)
        html = resp.read().decode("utf-8", errors="ignore")
        
        canon = re.search(r'rel="canonical"\s+href="([^"]+)"', html)
        robots = re.search(r'name="robots"\s+content="([^"]+)"', html)
        
        print(f"[{desc}]")
        print(f"  canonical: {canon.group(1) if canon else 'NONE'}")
        print(f"  robots: {robots.group(1) if robots else 'NONE'}")
        print()
    except Exception as e:
        print(f"[{desc}] ERROR: {e}")
        print()
