import os, re

BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"

pairs = [
    ("ai-pdf-summarizer", "ai-summarizer"),
    ("signature-resizer", "ssc-signature-resizer"),
    ("ocr-pdf", "ocr-text-extractor"),
    ("webp-to-pdf", "webp-to-pdf-converter"),
    ("heic-to-pdf", "heic-to-pdf-converter"),
    ("compress-pdf-100kb", "compress-pdf-under-100kb"),
]

for a, b in pairs:
    fa = os.path.join(BASE, a + ".html")
    fb = os.path.join(BASE, b + ".html")
    
    with open(fa, "r", encoding="utf-8", errors="ignore") as f:
        ca = f.read()
    with open(fb, "r", encoding="utf-8", errors="ignore") as f:
        cb = f.read()
    
    ta = re.search(r"<title>(.*?)</title>", ca, re.DOTALL)
    tb = re.search(r"<title>(.*?)</title>", cb, re.DOTALL)
    
    h1a = re.search(r"<h1[^>]*>(.*?)</h1>", ca, re.DOTALL | re.IGNORECASE)
    h1b = re.search(r"<h1[^>]*>(.*?)</h1>", cb, re.DOTALL | re.IGNORECASE)
    
    cana = re.search(r'rel="canonical"\s+href="([^"]+)"', ca)
    canb = re.search(r'rel="canonical"\s+href="([^"]+)"', cb)
    
    print(f"--- {a} vs {b} ---")
    print(f"  Size: {len(ca)} vs {len(cb)} bytes")
    print(f"  Title A: {ta.group(1).strip()[:80] if ta else 'NONE'}")
    print(f"  Title B: {tb.group(1).strip()[:80] if tb else 'NONE'}")
    print(f"  H1 A: {h1a.group(1).strip()[:80] if h1a else 'NONE'}")
    print(f"  H1 B: {h1b.group(1).strip()[:80] if h1b else 'NONE'}")
    print(f"  Canon A: {cana.group(1) if cana else 'NONE'}")
    print(f"  Canon B: {canb.group(1) if canb else 'NONE'}")
    print()
