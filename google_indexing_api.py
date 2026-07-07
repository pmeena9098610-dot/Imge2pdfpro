"""
Google Indexing API - Force Index ALL Pages in 24 Hours
=======================================================
This script uses Google's Indexing API to request immediate
crawling and indexing of every page on photosepdf.in.

SETUP (one-time, takes 5 minutes):
1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Search "Indexing API" in the top search bar → Enable it
4. Go to "Credentials" (left sidebar) → "Create Credentials" → "Service Account"
5. Give it any name → Click "Create and Continue" → Skip roles → Done
6. Click on the service account email → "Keys" tab → "Add Key" → "Create new key" → JSON → Download
7. Rename the downloaded file to "service_account.json"
8. Put it in: C:\\Users\\Bappa official\\Desktop\\Imge2pdfpro\\service_account.json
9. Copy the service account email (looks like: name@project-id.iam.gserviceaccount.com)
10. Go to Google Search Console → Settings → Users and Permissions → Add User
11. Paste the service account email → Set permission to "Owner" → Add
12. Run this script: python google_indexing_api.py

The script will submit up to 200 URLs per day for immediate indexing.
Google will typically index them within 24-48 hours.
"""

import json
import os
import sys
import time
import xml.etree.ElementTree as ET

BASE = r"C:\Users\Bappa official\Desktop\Imge2pdfpro"
SERVICE_ACCOUNT_FILE = os.path.join(BASE, "service_account.json")
SITEMAP_FILE = os.path.join(BASE, "sitemap.xml")

# Check if google-auth library is available
try:
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request
except ImportError:
    print("Installing required library: google-auth...")
    os.system("pip install google-auth google-auth-httplib2 requests")
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

try:
    import requests
except ImportError:
    os.system("pip install requests")
    import requests

def get_credentials():
    """Get authenticated credentials from service account."""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print("=" * 60)
        print("ERROR: service_account.json NOT FOUND!")
        print("=" * 60)
        print()
        print("File expected at:")
        print(f"  {SERVICE_ACCOUNT_FILE}")
        print()
        print("Follow these steps to create it:")
        print()
        print("Step 1: Go to https://console.cloud.google.com/")
        print("Step 2: Create a project (or use existing)")
        print("Step 3: Search 'Indexing API' → Enable it")
        print("Step 4: Credentials → Create Credentials → Service Account")
        print("Step 5: Keys tab → Add Key → Create new key → JSON")
        print("Step 6: Save as 'service_account.json' in this folder")
        print("Step 7: Copy the service account email")
        print("Step 8: GSC → Settings → Users → Add as Owner")
        print("Step 9: Run this script again!")
        print()
        sys.exit(1)
    
    SCOPES = ["https://www.googleapis.com/auth/indexing"]
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials

def get_urls_from_sitemap():
    """Extract all URLs from sitemap.xml."""
    tree = ET.parse(SITEMAP_FILE)
    root = tree.getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for url_elem in root.findall("s:url", ns):
        loc = url_elem.find("s:loc", ns)
        if loc is not None:
            urls.append(loc.text.strip())
    return urls

def submit_url(credentials, url, action="URL_UPDATED"):
    """Submit a single URL to Google Indexing API."""
    endpoint = "https://indexing.googleapis.com/v3/urlNotifications:publish"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {credentials.token}"
    }
    body = {
        "url": url,
        "type": action
    }
    
    response = requests.post(endpoint, headers=headers, json=body, timeout=30)
    return response.status_code, response.json()

def main():
    print("=" * 60)
    print("Google Indexing API - Force Index All Pages")
    print("=" * 60)
    print()
    
    # Get credentials
    print("Authenticating with Google...")
    credentials = get_credentials()
    print(f"Authenticated as: {credentials.service_account_email}")
    print()
    
    # Get URLs
    urls = get_urls_from_sitemap()
    print(f"Found {len(urls)} URLs in sitemap.xml")
    print()
    
    # Google allows 200 requests per day
    max_requests = min(len(urls), 200)
    print(f"Submitting {max_requests} URLs (Google daily limit: 200)")
    print("-" * 60)
    
    success = 0
    errors = 0
    
    for i, url in enumerate(urls[:max_requests], 1):
        try:
            # Refresh token if needed
            if credentials.expired:
                credentials.refresh(Request())
            
            status, response = submit_url(credentials, url)
            
            if status == 200:
                success += 1
                print(f"  [{i}/{max_requests}] OK - {url.split('photosepdf.in')[1]}")
            else:
                errors += 1
                error_msg = response.get("error", {}).get("message", "Unknown error")
                print(f"  [{i}/{max_requests}] ERR {status} - {url.split('photosepdf.in')[1]} - {error_msg}")
            
            # Small delay to avoid rate limiting
            if i % 10 == 0:
                time.sleep(1)
                
        except Exception as e:
            errors += 1
            print(f"  [{i}/{max_requests}] EXCEPTION - {url}: {str(e)[:80]}")
    
    print()
    print("=" * 60)
    print(f"DONE! Submitted: {success} OK, {errors} errors")
    print("=" * 60)
    
    if success > 0:
        print()
        print("Google will now crawl and index these pages within 24-48 hours!")
        print("Check progress in Google Search Console → URL Inspection")
    
    if len(urls) > 200:
        remaining = len(urls) - 200
        print()
        print(f"NOTE: {remaining} URLs remaining. Run this script again tomorrow")
        print(f"(Google allows max 200 submissions per day)")

if __name__ == "__main__":
    main()
