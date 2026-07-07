import os, re
BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"
dups = ["ai-summarizer", "signature-resizer", "ocr-text-extractor", "webp-to-pdf-converter", "heic-to-pdf-converter"]
for d in dups:
    with open(os.path.join(BASE, d + ".html"), "r", encoding="utf-8", errors="ignore") as f:
        content = f.read(3000)
    m = re.search(r'rel="canonical"\s+href="([^"]+)"', content)
    r2 = re.search(r'name="robots"\s+content="([^"]+)"', content)
    print(f"{d}.html:")
    print(f"  canonical: {m.group(1) if m else 'NONE'}")
    print(f"  robots: {r2.group(1) if r2 else 'NONE'}")
