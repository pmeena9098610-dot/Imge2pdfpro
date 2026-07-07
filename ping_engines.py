import urllib.request

# Method 1: Ping Google and Bing sitemap endpoints
ping_urls = [
    "https://www.google.com/ping?sitemap=https://www.photosepdf.in/sitemap.xml",
    "https://www.bing.com/ping?sitemap=https://www.photosepdf.in/sitemap.xml",
]

for url in ping_urls:
    try:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0")
        resp = urllib.request.urlopen(req, timeout=15)
        engine = "Google" if "google" in url else "Bing"
        print(f"{resp.status} OK - {engine} sitemap ping sent!")
    except Exception as e:
        engine = "Google" if "google" in url else "Bing"
        print(f"ERROR - {engine}: {e}")

print("\nSitemap ping complete!")
