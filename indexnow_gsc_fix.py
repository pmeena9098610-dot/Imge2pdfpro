"""
IndexNow submission for GSC-fixed pages
Notifies Bing/Yandex about updated pages so they recrawl quickly.
"""
import urllib.request
import json

KEY = "e1a052738a604f9181beaa376a60a5c1"
HOST = "www.photosepdf.in"

# Only submit the pages we actually changed
changed_urls = [
    "https://www.photosepdf.in/",  # homepage (404 canonical pointed here)
    "https://www.photosepdf.in/ai-summarizer",
    "https://www.photosepdf.in/ai-pdf-summarizer",
    "https://www.photosepdf.in/signature-resizer",
    "https://www.photosepdf.in/ssc-signature-resizer",
    "https://www.photosepdf.in/ocr-text-extractor",
    "https://www.photosepdf.in/ocr-pdf",
    "https://www.photosepdf.in/webp-to-pdf-converter",
    "https://www.photosepdf.in/webp-to-pdf",
    "https://www.photosepdf.in/heic-to-pdf-converter",
    "https://www.photosepdf.in/heic-to-pdf",
    "https://www.photosepdf.in/embed-widget",
    "https://www.photosepdf.in/sitemap.xml",
]

payload = {
    "host": HOST,
    "key": KEY,
    "keyLocation": f"https://{HOST}/{KEY}.txt",
    "urlList": changed_urls
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    "https://api.indexnow.org/indexnow",
    data=data,
    headers={"Content-Type": "application/json; charset=utf-8"},
    method="POST"
)

try:
    resp = urllib.request.urlopen(req, timeout=15)
    print(f"IndexNow Response: {resp.status} {resp.reason}")
    print(f"Submitted {len(changed_urls)} URLs successfully!")
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.reason}")
    body = e.read().decode("utf-8", errors="ignore")
    if body:
        print(body[:500])
except Exception as e:
    print(f"Error: {e}")
