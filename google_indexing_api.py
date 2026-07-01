# -*- coding: utf-8 -*-
"""
google_indexing_api.py - Submit all sitemap URLs directly to Google Indexing API
=============================================================================
Requires:
1. pip install google-auth requests
2. service_account.json key file in the same directory
3. Service Account email added as Owner in Google Search Console
"""
import os
import xml.etree.ElementTree as ET
import json
import time

# Install dependencies if missing
try:
    from google.oauth2 import service_account
    import google.auth.transport.requests
    import requests
except ImportError:
    print("Installing required library packages: google-auth, requests...")
    import subprocess
    subprocess.run(["pip", "install", "google-auth", "requests"], check=True)
    from google.oauth2 import service_account
    import google.auth.transport.requests
    import requests

KEY_FILE = "service_account.json"
SITEMAP_PATH = "sitemap.xml"

if not os.path.exists(KEY_FILE):
    print(f"\n[!] Error: '{KEY_FILE}' not found in the directory!")
    print("Please download the service account JSON key file and save it here.")
    exit(1)

if not os.path.exists(SITEMAP_PATH):
    print(f"[!] Error: '{SITEMAP_PATH}' not found!")
    exit(1)

# 1. Load URLs from sitemap.xml
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

print(f"Loaded {len(urls)} URLs from sitemap.xml for indexing submission.")

# 2. Authenticate using Service Account Credentials
SCOPES = ["https://www.googleapis.com/auth/indexing"]
try:
    credentials = service_account.Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
    session = requests.Session()
    # Create request object to refresh token
    req = google.auth.transport.requests.Request()
    credentials.refresh(req)
    token = credentials.token
except Exception as e:
    print(f"[!] Authentication failed: {e}")
    print("Please verify that your service_account.json is valid.")
    exit(1)

print("[+] Google API Authentication Successful!")

# 3. Submit URLs to Google Indexing API
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}
endpoint = "https://indexing.googleapis.com/v3/urlNotifications:publish"

success_count = 0
fail_count = 0

for i, url in enumerate(urls, 1):
    payload = {
        "url": url,
        "type": "URL_UPDATED"
    }
    
    print(f"[{i}/{len(urls)}] Submitting: {url} ...", end="", flush=True)
    try:
        response = session.post(endpoint, data=json.dumps(payload), headers=headers, timeout=10)
        if response.status_code == 200:
            print(" [OK]")
            success_count += 1
        else:
            print(f" [FAIL] (Status {response.status_code}: {response.text.strip()[:100]})")
            fail_count += 1
    except Exception as e:
        print(f" [ERROR] ({e})")
        fail_count += 1
        
    # Rate limit compliance: Google Indexing API allows up to 200 requests/day
    time.sleep(0.5)

print(f"\nGoogle Indexing Submission Results:")
print(f"  - Successfully submitted: {success_count} URLs")
print(f"  - Failed: {fail_count} URLs")
if fail_count > 0:
    print("[Note] If submissions failed with 403 Permission Denied, ensure the Service Account email is added as an OWNER in your Google Search Console settings.")
