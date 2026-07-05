# -*- coding: utf-8 -*-
"""
indexnow_submit.py - Automatically submit all sitemap URLs to IndexNow API for instant indexing on Bing, Yandex, Seznam, etc.
=============================================================================
Author: Pradeep Meena
Website: https://www.photosepdf.in
"""
import os
import xml.etree.ElementTree as ET
import json
import requests

SITEMAP_PATH = "sitemap.xml"
KEY = "e1a052738a604f9181beaa376a60a5c1"
HOST = "www.photosepdf.in"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

if not os.path.exists(SITEMAP_PATH):
    print(f"[!] Error: '{SITEMAP_PATH}' not found!")
    exit(1)

# 1. Parse sitemap.xml to extract URLs
urls = []
try:
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    for url_node in root.findall('ns:url', ns):
        loc_node = url_node.find('ns:loc', ns)
        if loc_node is not None:
            urls.append(loc_node.text.strip())
except Exception as e:
    print(f"Error parsing sitemap.xml: {e}")
    exit(1)

print(f"Loaded {len(urls)} URLs from sitemap.xml")

if not urls:
    print("[!] No URLs found to submit.")
    exit(0)

# 2. Submit to IndexNow API
# Endpoints for IndexNow
endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow"
]

payload = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": urls
}

headers = {
    "Content-Type": "application/json; charset=utf-8"
}

print(f"\nSubmitting {len(urls)} URLs to IndexNow...")

success = False
for endpoint in endpoints:
    try:
        print(f"Sending request to: {endpoint}...", end="")
        response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
        if response.status_code == 200:
            print(" [OK]")
            success = True
        elif response.status_code == 202:
            print(" [ACCEPTED] (Queued for verification)")
            success = True
        else:
            print(f" [FAIL] (Status {response.status_code}: {response.text.strip()[:100]})")
    except Exception as e:
        print(f" [ERROR] ({e})")

if success:
    print("\n[+] Success! URLs successfully submitted to IndexNow for instant indexing.")
else:
    print("\n[!] IndexNow submission failed. Please verify your domain configuration and key validation.")
