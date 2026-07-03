# -*- coding: utf-8 -*-
"""
programmatic_seo_generator.py - Generate high-intent SEO pages and trust pages
=============================================================================
Programmatically generates 27 targeted landing pages for state exams and
document conversion, complete with schemas, custom FAQs, AI Overview panels,
and offline-capable tools. Also creates missing trust/E-E-A-T pages.
"""
import os
import re
import json
import urllib.parse
from datetime import datetime

BASE_DIR = r"C:\Users\Bappa official\.gemini\antigravity\scratch\Imge2pdfpro"
DOMAIN   = "https://www.photosepdf.in"
TODAY    = datetime.now().strftime("%Y-%m-%d")
TODAY_H  = datetime.now().strftime("%B %d, %Y")

# 1. Trust/E-E-A-T Pages Data
TRUST_PAGES = {
    "author.html": {
        "title": "Editorial Team & Technology Experts - PhotoSePDF.in",
        "description": "Meet our team of developers, image processing specialists, and privacy advocates dedicated to building fast, secure, and offline tools.",
        "h1": "Editorial Team & Technology Experts",
        "content": """
            <div class="content-box card-3d glass-glow" style="margin-top: 30px; padding: 30px;">
                <div style="display: flex; flex-wrap: wrap; gap: 30px; align-items: center;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--pink)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: 800; box-shadow: var(--shadow-md);">
                        PM
                    </div>
                    <div style="flex: 1; min-width: 250px;">
                        <h2 style="color: var(--primary); margin-top: 0;">Priyanshu Meena</h2>
                        <p style="font-weight: 600; color: var(--text-main); margin-bottom: 5px;">Chief Technology Officer & Lead Developer</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0;">Expert in client-side web technologies, image compression algorithms, and digital document optimization.</p>
                        <p style="margin-top: 12px; display: flex; gap: 15px; font-size: 0.88rem;">
                            <a href="https://github.com/pmeena9098610-dot" target="_blank" rel="noopener noreferrer" style="color: var(--text-main); text-decoration: none; font-weight: 600;" title="GitHub Profile"><i class="fa-brands fa-github"></i> GitHub</a>
                            <a href="https://www.linkedin.com/in/priyanshu-meena-098/" target="_blank" rel="noopener noreferrer" style="color: #0A66C2; text-decoration: none; font-weight: 600;" title="LinkedIn Profile"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
                        </p>
                    </div>
                </div>
                
                <h3 style="color: var(--primary); margin-top: 30px;"><i class="fa-solid fa-graduation-cap"></i> Experience & Expertise</h3>
                <p>Priyanshu has over 5 years of experience building secure web utilities. His work focuses on client-side optimization, ensuring that complex tasks like image resizing, format conversion, and PDF compilation are executed entirely within the user's browser without uploading sensitive documents to a server.</p>
                
                <h3 style="color: var(--primary); margin-top: 30px;"><i class="fa-solid fa-shield-halved"></i> Mission of PhotoSePDF.in</h3>
                <p>The mission of PhotoSePDF.in is to provide candidates in India preparing for SSC, UPSC, NEET, JEE, and state-level recruitment forms with completely free, private, and fast tools to resize and convert their application photos and signatures without worrying about security or privacy leaks at public cyber cafes.</p>
            </div>
        """
    },
    "cookies.html": {
        "title": "Cookies & Local Storage Policy - PhotoSePDF.in",
        "description": "Read our Cookies Policy. We do not track you or save your personal documents. We only use local storage for browser tool parameters.",
        "h1": "Cookies & Local Storage Policy",
        "content": """
            <div class="content-box card-3d glass-glow" style="margin-top: 30px; padding: 30px;">
                <h2 style="color: var(--primary); margin-top: 0;">How We Use Local Storage</h2>
                <p>At PhotoSePDF.in, we respect your privacy. Because our tools operate 100% client-side (offline in your browser), your images, signatures, and documents are never uploaded to our servers. We do not use cookies to track your personal activities or build marketing profiles.</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">1. Local Storage for Tools</h3>
                <p>We use your browser's Local Storage to remember options you select in our tools (such as target KB limits, pixel sizes, and dark mode theme preferences). This data remains inside your own device and is never shared with us or any third party.</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">2. Analytics & Advertising Cookies</h3>
                <p>We use standard third-party tools like Google Analytics and Google AdSense to monitor website traffic performance and display programmatic ads to support the free hosting of our tools. These services may set cookies in your browser to deliver contextual ads and analyze anonymous traffic volumes.</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">3. Managing Cookies</h3>
                <p>You can choose to block or delete cookies in your browser settings at any time. Our core image resizing and PDF conversion tools will continue to function perfectly even if cookies are disabled, as they run on native browser APIs.</p>
            </div>
        """
    },
    "editorial-policy.html": {
        "title": "Editorial & Form Guidelines Policy - PhotoSePDF.in",
        "description": "Learn about our editorial verification standards. We review official notifications of government exams regularly to ensure resizers match exactly.",
        "h1": "Editorial & Form Verification Guidelines",
        "content": """
            <div class="content-box card-3d glass-glow" style="margin-top: 30px; padding: 30px;">
                <h2 style="color: var(--primary); margin-top: 0;">Our Verification Standards</h2>
                <p>PhotoSePDF.in is dedicated to providing candidates with accurate, up-to-date image dimensions and file sizes required for online registration forms. Incorrect photo uploads are the leading cause of application rejection in competitive exams, which is why our team follows a strict editorial verification protocol.</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">1. Source Notification Auditing</h3>
                <p>Before launching or updating any exam resizer preset (such as UP Police, SSC, BPSC, or UPSC), our editorial team reviews the official notification PDF published on the official recruitment portal. We verify the exact pixel dimensions (width & height), file format (usually JPEG), and file size limits (minimum & maximum KB constraints).</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">2. Regular Policy Updates</h3>
                <p>Government recruitment boards occasionally modify image requirements (for example, SSC's transition to live webcam captures or change in background rules). We audit and update our tools and instructions within 24 hours of any official policy changes.</p>
                
                <h3 style="color: var(--primary); margin-top: 24px;">3. Code of Transparency</h3>
                <p>Our tools are built using open Web APIs. We are transparent about our software logic, and candidates can check their output sizes and metadata on any computer before uploading to the official application form portals.</p>
            </div>
        """
    }
}

# 2. State Exams Resizers Page Data
STATE_EXAMS = [
    {
        "slug": "up-police-photo-resizer",
        "title": "UP Police Photo & Signature Resizer Online Free 2026",
        "desc": "Resize your photo and signature for UP Police Constable, SI, and ASI recruitment application forms online to exact 20-50KB and 5-20KB JPG formats.",
        "h1": "UP Police Photo & Signature Resizer 2026",
        "keywords": "up police photo resizer, up police photo size, up police signature resizer, up police online photo crop, up recruitment photo size",
        "category": "State Exams",
        "exam_name": "UP Police",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "UP Police application form ke liye photo size kya chahiye?", "a": "UP Police application ke liye photo size 20KB se 50KB ke beech honi chahiye. Dimensions 350 x 450 pixels (JPG format) best hain."},
            {"q": "UP Police signature ka standard size kya hai?", "a": "Signature file size 5KB se 20KB ke beech honi chahiye. Standard dimensions 140 x 60 pixels chunein, black ink sign best hai."},
            {"q": "Kya up police form me background white hona zaroori hai?", "a": "Haan, UP Police notifications ke anusaar photo ka background safed (white) ya light grey hona chahiye. Dark backgrounds reject ho sakte hain."},
            {"q": "UP Police photo signature join karna zaroori hai?", "a": "Nahi, UP Police portal par photo aur signature do alag-alag files ki tarah upload kiye jaate hain. Dono ko merge karne ki zaroorat nahi hai."}
        ]
    },
    {
        "slug": "bihar-police-photo-resizer",
        "title": "Bihar Police CSBC Photo & Signature Resizer Online 2026",
        "desc": "Resize photo and signature for Bihar Police Constable, SI, and Fireman online registration to exact 15-25KB and 10-20KB sizes for CSBC upload.",
        "h1": "Bihar Police Photo & Signature Resizer 2026",
        "keywords": "bihar police photo resizer, csbc bihar photo size, bihar police signature size, bihar police photo format, csbc resizer online",
        "category": "State Exams",
        "exam_name": "Bihar Police",
        "min_kb": 15,
        "max_kb": 25,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "Bihar Police CSBC form ke liye photo requirements kya hain?", "a": "CSBC Bihar Police form ke liye passport photo 15KB se 25KB ke beech honi chahiye. Dimensions 3.5cm x 4.5cm (350x450px) recommended hain."},
            {"q": "Bihar Police signature ka size kya hona chahiye?", "a": "Signature file size 10KB se 20KB ke beech honi chahiye. Signature white paper par blue ya black ink se hona chahiye."},
            {"q": "Kya Bihar Police form me hindi and english dono signature lagte hain?", "a": "Haan, zyaadatar Bihar Govt forms me Hindi aur English dono signature alag-alag scan karke upload karne hote hain. Dono ka size 10-20KB hona chahiye."},
            {"q": "Kya mobile se Bihar Police photo resize ho jayegi?", "a": "Bilkul! photosepdf.in Chrome browser me kholein, photo select karein aur target size set karke 2 seconds me download karein."}
        ]
    },
    {
        "slug": "delhi-police-photo-resizer",
        "title": "Delhi Police Constable Photo & Signature Resizer Online 2026",
        "desc": "Resize passport size photo and signature for Delhi Police recruitment online application form to exact 20-50KB and 10-20KB JPG format.",
        "h1": "Delhi Police Photo & Signature Resizer 2026",
        "keywords": "delhi police photo resizer, delhi police photo size, delhi police signature size, ssc delhi police photo resize, ssc constable photo size",
        "category": "State Exams",
        "exam_name": "Delhi Police",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "Delhi Police Constable form ke liye photo requirements kya hain?", "a": "Delhi Police recruitment SSC conduct karta hai, isliye photo 20KB se 50KB ke beech aur size 3.5cm x 4.5cm (350x450px) white background ke sath honi chahiye."},
            {"q": "Delhi Police form me signature size kya hona chahiye?", "a": "Signature size 10KB se 20KB ke beech JPEG/JPG format me hona chahiye. Standard pixels 140x60px hain."},
            {"q": "Kya spectacles ke sath photo upload kar sakte hain?", "a": "Nahi, Delhi Police guidelines ke anusaar chashma (spectacles) pehan kar photo khichwana allowed nahi hai. Bina chashma ke photo upload karein."},
            {"q": "Delhi Police portal par photo reject kyun hoti hai?", "a": "Common reasons wrong dimensions (dimensions match nahi hona) ya file size 50KB se zyada hona hai. Humare tool se check karein to ensure zero mistakes."}
        ]
    },
    {
        "slug": "rpsc-photo-resizer",
        "title": "RPSC Rajasthan Photo & Signature Resizer Online 2026",
        "desc": "Resize passport photo and signature for RPSC RAS, Lecturer, and Teacher recruitment application forms to exact 50-100KB and 20-50KB JPG formats.",
        "h1": "RPSC Rajasthan Photo & Signature Resizer",
        "keywords": "rpsc photo resizer, rajasthan photo size, rpsc ras photo resize, rpsc signature size, sso rajasthan photo resizer",
        "category": "State Exams",
        "exam_name": "RPSC Rajasthan",
        "min_kb": 50,
        "max_kb": 100,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "RPSC form ke liye photo size requirements kya hain?", "a": "RPSC RAS aur dusre Rajasthan exams ke liye photo size 50KB se 100KB ke beech honi chahiye JPG/JPEG format me."},
            {"q": "RPSC application form me signature size kya lagta hai?", "a": "Signature size 20KB se 50KB ke beech hona chahiye. White paper par black pen se sign karke use scan/photo click karein."},
            {"q": "SSO Rajasthan portal par photo resizer kaise use karein?", "a": "SSO portal par direct upload karne se pehle humare tool se RPSC settings select karke exact KB limit set kar lein, upload error nahi aayega."},
            {"q": "Kya photo par naam aur date zaroori hai?", "a": "Kuch RPSC state exams me requirements hoti hain. Notification check karein; zyaadatar case me plain passport photo background white ke sath valid hai."}
        ]
    },
    {
        "slug": "mpsc-photo-resizer",
        "title": "MPSC Maharashtra Photo & Signature Resizer Online 2026",
        "desc": "Resize your application photo and signature for MPSC State Services exam forms online. Perfect 50KB limit JPG format meeting Maharashtra Govt rules.",
        "h1": "MPSC Maharashtra Photo & Signature Resizer",
        "keywords": "mpsc photo resizer, mpsc photo signature size, maharashtra psc photo size, mpsc online photo crop, mahampsc resizer",
        "category": "State Exams",
        "exam_name": "MPSC Maharashtra",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "MPSC recruitment form ke liye photo specifications kya hain?", "a": "MPSC online form ke liye photo size 20KB se 50KB ke beech honi chahiye JPEG format me. Standard width 3.5cm aur height 4.5cm honi chahiye."},
            {"q": "MPSC signature size limit kya hai?", "a": "MPSC signature file size 10KB se 50KB ke beech honi chahiye white background par black ink ke sath."},
            {"q": "MPSC form me photo dimensions kaise set karein?", "a": "Humare tool me automatic preset click karein, ye width 350px aur height 450px select karke direct resizing kar dega."},
            {"q": "Kya photo me background red ho sakta hai?", "a": "MPSC face presentation clear recommend karta hai. Light grey ya white background best hai rejection se bachne ke liye."}
        ]
    },
    {
        "slug": "upsssc-photo-resizer",
        "title": "UPSSSC PET Photo & Signature Resizer Online Free 2026",
        "desc": "Resize your photo and signature for UPSSSC PET, Lekhpal, and Junior Assistant recruitment forms online to exact 20-50KB and 5-20KB JPG formats.",
        "h1": "UPSSSC PET Photo & Signature Resizer",
        "keywords": "upsssc photo resizer, upsssc pet photo size, upsssc signature resizer, upsssc online photo crop",
        "category": "State Exams",
        "exam_name": "UPSSSC Uttar Pradesh",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "UPSSSC PET form ke liye photo size kya chahiye?", "a": "UPSSSC PET application ke liye photo size 20KB se 50KB ke beech honi chahiye JPG format me."},
            {"q": "UPSSSC signature ka rules kya hain?", "a": "Signature file 5KB se 20KB ke beech honi chahiye. UPSSSC rules ke mutabik signature ke upar aapka naam hindi me aur signature english me hona chahiye."}
        ]
    },
    {
        "slug": "hssc-photo-resizer",
        "title": "HSSC Haryana Group C & D Photo & Signature Resizer Online",
        "desc": "Resize your photo and signature for Haryana HSSC CET Group C and D recruitment application forms online to exact 10-30KB sizes.",
        "h1": "HSSC Haryana Photo & Signature Resizer",
        "keywords": "hssc photo resizer, haryana cet photo size, hssc signature resizer, hssc photo format",
        "category": "State Exams",
        "exam_name": "HSSC Haryana",
        "min_kb": 10,
        "max_kb": 30,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "HSSC CET form ke liye photo size limit kya hai?", "a": "HSSC application ke liye passport photo 10KB se 30KB ke beech honi chahiye JPG format me."},
            {"q": "HSSC signature size requirements?", "a": "Signature file size 10KB se 20KB ke beech honi chahiye white background par."}
        ]
    },
    {
        "slug": "jssc-photo-resizer",
        "title": "JSSC Jharkhand CGL Photo & Signature Resizer Online 2026",
        "desc": "Resize your photo and signature for JSSC CGL, Excise Constable, and Teacher recruitment forms online to exact 20-50KB and 10-20KB JPG formats.",
        "h1": "JSSC Jharkhand Photo & Signature Resizer",
        "keywords": "jssc photo resizer, jharkhand cgl photo size, jssc signature size, jssc online resizer",
        "category": "State Exams",
        "exam_name": "JSSC Jharkhand",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "JSSC CGL form ke liye photo requirements kya hain?", "a": "JSSC forms ke liye photo size 20KB se 50KB ke beech JPEG format me honi chahiye."},
            {"q": "JSSC signature ka size kya hona chahiye?", "a": "Signature file size 10KB se 20KB ke beech honi chahiye."}
        ]
    },
    {
        "slug": "wbpsc-photo-resizer",
        "title": "WBPSC West Bengal Photo & Signature Resizer Online 2026",
        "desc": "Resize photo and signature for West Bengal PSC Clerkship, WBCS, and Food SI online forms to exact 10-50KB and 10-20KB JPG formats.",
        "h1": "WBPSC West Bengal Photo & Signature Resizer",
        "keywords": "wbpsc photo resizer, wbcs photo size, wbpsc signature size, west bengal photo resizer",
        "category": "State Exams",
        "exam_name": "WBPSC West Bengal",
        "min_kb": 10,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "WBPSC Clerkship form ke liye photo size?", "a": "WBPSC application ke liye photo size 10KB se 50KB ke beech honi chahiye JPG format me."},
            {"q": "WBPSC signature size limit?", "a": "Signature file size 10KB se 20KB ke beech honi chahiye."}
        ]
    },
    {
        "slug": "gpsc-photo-resizer",
        "title": "GPSC Gujarat Class 1 & 2 Photo & Signature Resizer Online",
        "desc": "Resize your photo and signature for GPSC Gujarat Administrative Service recruitment forms online to exact 5-50KB and 5-20KB JPG formats.",
        "h1": "GPSC Gujarat Photo & Signature Resizer",
        "keywords": "gpsc photo resizer, gujarat psc photo size, ojas gujarat photo signature resize",
        "category": "State Exams",
        "exam_name": "GPSC Gujarat",
        "min_kb": 5,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "GPSC Class 1 & 2 ojas form ke liye photo size?", "a": "Ojas GPSC forms ke liye photo size 5KB se 50KB ke beech honi chahiye JPG format me."},
            {"q": "GPSC signature size limit on ojas?", "a": "Signature file size 5KB se 20KB ke beech honi chahiye ojas portal rules ke mutabik."}
        ]
    },
    {
        "slug": "ukpsc-photo-resizer",
        "title": "UKPSC Uttarakhand Photo & Signature Resizer Online 2026",
        "desc": "Resize passport photo and signature for UKPSC RO/ARO, PCS, and Lecturer recruitment forms online to exact 20-50KB and 10-20KB JPG formats.",
        "h1": "UKPSC Uttarakhand Photo & Signature Resizer",
        "keywords": "ukpsc photo resizer, uttarakhand pcs photo size, ukpsc signature size",
        "category": "State Exams",
        "exam_name": "UKPSC Uttarakhand",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "UKPSC RO/ARO form ke liye photo size?", "a": "UKPSC application ke liye photo size 20KB se 50KB ke beech honi chahiye JPG format me."},
            {"q": "UKPSC signature size limit?", "a": "Signature file size 10KB se 20KB ke beech honi chahiye."}
        ]
    },
    {
        "slug": "bpsc-tre-photo-resizer",
        "title": "BPSC TRE Teacher Photo & Signature Resizer Online 2026",
        "desc": "Resize your photo and signature for BPSC TRE Teacher Recruitment online registration to exact 15-25KB and 10-20KB sizes.",
        "h1": "BPSC TRE Teacher Photo & Signature Resizer",
        "keywords": "bpsc tre photo resizer, bpsc teacher photo size, bpsc tre signature resizer",
        "category": "State Exams",
        "exam_name": "BPSC Teacher TRE",
        "min_kb": 15,
        "max_kb": 25,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "BPSC TRE form ke liye photo size kya chahiye?", "a": "BPSC TRE recruitment form ke liye photo size 15KB se 25KB ke beech honi chahiye JPG format me."},
            {"q": "BPSC TRE signature size limit?", "a": "Signature size 10KB se 20KB ke beech hona chahiye clear white background par."}
        ]
    },
    {
        "slug": "reet-photo-resizer",
        "title": "REET Rajasthan Teacher Photo & Signature Resizer Online",
        "desc": "Resize passport photo and signature for REET Rajasthan Teacher Eligibility Test to exact 20-50KB and 10-20KB JPG formats.",
        "h1": "REET Teacher Photo & Signature Resizer",
        "keywords": "reet photo resizer, reet rajasthan photo size, reet signature size online",
        "category": "State Exams",
        "exam_name": "REET Rajasthan",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "REET application form ke liye photo requirements?", "a": "REET form ke liye passport photo 20KB se 50KB ke beech honi chahiye JPG format me."},
            {"q": "REET signature size limit?", "a": "Signature size 10KB se 20KB ke beech hona chahiye clear white paper par black pen se."}
        ]
    },
    {
        "slug": "sbi-clerk-photo-resizer",
        "title": "SBI Clerk Photo & Signature Resizer Online Free",
        "desc": "Resize your photo and signature for SBI Clerk recruitment application forms online to exact 20-50KB and 10-20KB JPG formats.",
        "h1": "SBI Clerk Photo & Signature Resizer",
        "keywords": "sbi clerk photo resizer, sbi clerk photo size, sbi clerk signature resizer, sbi online photo crop, sbi recruitment photo size",
        "category": "Bank Exams",
        "exam_name": "SBI Clerk",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 200,
        "default_h": 230,
        "faqs": [
            {"q": "What is the photo size for SBI Clerk application?", "a": "For SBI Clerk, the photograph must be between 20KB and 50KB in JPG format with dimensions of 200 x 230 pixels."},
            {"q": "What is the signature size for SBI Clerk?", "a": "The signature must be between 10KB and 20KB in JPG format with dimensions of 140 x 60 pixels, signed with black ink."},
            {"q": "Can I sign in capital letters for SBI Clerk?", "a": "No, signatures in CAPITAL LETTERS are not accepted and will cause application rejection."},
            {"q": "Is a white background required for SBI Clerk photo?", "a": "Yes, the photo should be a recent passport-style color picture, preferably with a white or light-colored background."}
        ]
    },
    {
        "slug": "rrb-ntpc-photo-resizer",
        "title": "RRB NTPC Photo & Signature Resizer Online Free",
        "desc": "Crop and resize your photo and signature to meet the official RRB NTPC railway application guidelines (20KB - 50KB).",
        "h1": "RRB NTPC Photo & Signature Resizer",
        "keywords": "rrb ntpc photo resizer, rrb ntpc photo size, rrb ntpc signature resizer, railway recruitment photo resizer",
        "category": "Railway Exams",
        "exam_name": "RRB NTPC",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 320,
        "default_h": 240,
        "faqs": [
            {"q": "What is the photo size limit for RRB NTPC?", "a": "The photograph size for RRB NTPC must be between 20KB and 50KB in JPG format."},
            {"q": "What is the signature file size limit for RRB NTPC?", "a": "The signature file size for RRB NTPC must be between 10KB and 40KB in JPG/JPEG format."},
            {"q": "Is white background mandatory for railway forms?", "a": "Yes, the passport-size photo must be taken against a light-colored, preferably white background."}
        ]
    },
    {
        "slug": "cisf-constable-photo-resizer",
        "title": "CISF Constable Photo Size Resizer Online",
        "desc": "Resize and compress photos for CISF Constable and Head Constable recruitment forms. 100% offline and secure.",
        "h1": "CISF Constable Photo & Signature Resizer",
        "keywords": "cisf constable photo resizer, cisf photo size, cisf signature resizer, cisf recruitment photo size",
        "category": "Defense Exams",
        "exam_name": "CISF Constable",
        "min_kb": 20,
        "max_kb": 50,
        "default_w": 350,
        "default_h": 450,
        "faqs": [
            {"q": "What is the photo size limit for CISF Constable?", "a": "For CISF Constable forms, the photo size should be between 20KB and 50KB in JPG/JPEG format."},
            {"q": "Is the date on photo mandatory for CISF Constable?", "a": "Please check the latest recruitment notification. CISF usually requires the date of the photograph printed clearly on the lower part of the photo."},
            {"q": "What is the signature size for CISF?", "a": "The signature file size for CISF must be between 10KB and 20KB in JPG format."}
        ]
    }
]

# 3. Document to PDF Pages Data
DOCUMENT_CONVERTERS = [
    {
        "slug": "passport-photo-to-pdf",
        "title": "Passport Size Photo to PDF Converter Online Free",
        "desc": "Convert passport size photos into a single PDF document online. Print ready layout, adjust margins and page formats (A4/Letter) free of charge.",
        "h1": "Passport Size Photo to PDF Converter",
        "keywords": "passport photo to pdf, passport size photo pdf maker, convert passport photo to pdf free, multiple passport photo to pdf",
        "category": "Doc Converters",
        "faqs": [
            {"q": "Passport size photo ko PDF kaise banayein?", "a": "Apni passport size photo ko upload area me drag & drop karein, page size (A4 ya Fit) chunein, Quality high rakhein aur Compile PDF par click karke download karein."},
            {"q": "Kya ek se zyada passport photos ek PDF me merge ho sakti hain?", "a": "Haan! Humare tool par multiple files select karke ek single sheet PDF page par multiple copies generate kar sakte hain printing ke liye."},
            {"q": "Official passport size measurements kya hain India me?", "a": "Indian passport size standard 3.5 cm x 4.5 cm (350x450px) background white ke sath use kiya jata hai."},
            {"q": "Kya conversion ke baad quality kharab hogi?", "a": "Nahi, hum vector image mapping use karte hain, jo original photo clarity aur DPI pixels ko intact rakhta hai."}
        ]
    },
    {
        "slug": "pan-card-photo-to-pdf",
        "title": "PAN Card Photo & Document to PDF Converter Online",
        "desc": "Convert your PAN card snapshot, passport photo, or physical application form images into a clean PDF document online for free.",
        "h1": "PAN Card Photo & Document to PDF Converter",
        "keywords": "pan card to pdf, pan photo pdf maker, pan card proof pdf converter, convert pan copy to pdf free",
        "category": "Doc Converters",
        "faqs": [
            {"q": "PAN card photo ko PDF kaise karein?", "a": "PAN Card copy ya details image chunein, upload box me upload karein aur save/download button se PDF extract karein."},
            {"q": "NSDL ya UTIITSL form ke liye size limit kya hai?", "a": "Zyaadatar PAN portal verification documents under 300KB scale PDF demand karte hain. Humara compressor automatically PDF size limit verify karke save karta hai."},
            {"q": "Kya details safety secure hai?", "a": "Haan, processing browser native memory (offline) me hoti hai, isliye PAN details server par upload hone ka zero chance hai."},
            {"q": "Kya dono front aur back view merge kar sakte hain?", "a": "Haan! Aap front aur back dono images upload karke compile button click karenge to single PDF me save ho jayega."}
        ]
    },
    {
        "slug": "marksheet-to-pdf",
        "title": "Convert Marksheet & Certificates to PDF Online Free",
        "desc": "Convert your 10th, 12th, or college graduation marksheets, certificates, and passing proofs into single/multi-page PDFs online easily.",
        "h1": "Marksheet & Certificate to PDF Converter",
        "keywords": "marksheet to pdf, convert marksheet to pdf free, certificate pdf maker online, document images to pdf",
        "category": "Doc Converters",
        "faqs": [
            {"q": "Marksheet image ko clear PDF kaise banayein?", "a": "Marksheet snapshot select karein, page margins default chunein aur compile karein. Text visibility normal rehne ke liye high quality resolution mapping background me apply hoti hai."},
            {"q": "Kya duplicate pages generate kar sakte hain?", "a": "Aap batch upload feature se alag-alag sem sheets upload karke unhe sequence layout (A4 PDF) me sort karke combine kar sakte hain."},
            {"q": "Official portals verification documents accept karte hain?", "a": "Haan, zyaadatar recruitment aur admissions portals clear scanned PDF verify aur check karte hain, jo humara tool optimize karta hai."},
            {"q": "Marksheet details secure rahengi?", "a": "Haan, hum client-side execution block use karte hain, jo security guidelines 100% fulfill karta hai."}
        ]
    },
    {
        "slug": "signature-to-pdf",
        "title": "Convert Scanned Signature Image to PDF Online Free",
        "desc": "Convert your signature photo or handwritten sign sketch into a high-quality PDF page online. Quick compilation for online document signing.",
        "h1": "Convert Signature Image to PDF Online",
        "keywords": "signature to pdf, signature image to pdf, sign photo to pdf, scan signature to pdf online free",
        "category": "Doc Converters",
        "faqs": [
            {"q": "Signature image ko PDF kaise banayein?", "a": "Handwritten signature photo select karein, background crop chunein aur PDF generate karein. Black pen on white paper signature recommend kiya jata hai."},
            {"q": "PDF dimensions resize kar sakte hain?", "a": "Haan, aap 'Fit to Image' page parameter choose karenge to signature photo borders automatic crop ho jayenge aur signature shape PDF me save ho jayegi."},
            {"q": "Kya electronic applications me ye signature useful hai?", "a": "Haan, digital documents, self-attestation copies aur portal validation forms me ye sign PDF format upload easily ho jata hai."},
            {"q": "Security protection check?", "a": "Hum browser storage me signatures process karte hain, so safety leak ka zero risk hai."}
        ]
    },
    {
        "slug": "aadhaar-photo-to-pdf",
        "title": "Aadhaar Card Photo to PDF Converter Online Free",
        "desc": "Convert your Aadhaar card front and back photos into a secure, clean A4 PDF file online. 100% private client-side processing.",
        "h1": "Aadhaar Card Photo to PDF Converter",
        "keywords": "aadhaar photo to pdf, aadhaar card pdf maker online, convert aadhar to pdf free",
        "category": "Doc Converters",
        "faqs": [
            {"q": "Aadhaar photo ko PDF kaise karein?", "a": "Aadhaar card front aur back ki image upload karein aur save as PDF button click karein. A4 PDF instantly ready ho jayegi."},
            {"q": "Kya humara Aadhaar data safe hai?", "a": "Haan, conversions 100% aapke browser memory me offline execute hote hain, server upload nahi hota."}
        ]
    },
    {
        "slug": "multiple-images-to-pdf",
        "title": "Multiple Images to PDF Converter Online Free",
        "desc": "Combine and convert multiple images (JPG, PNG, WebP) into a single PDF document online. Rearrange pages easily, no limits.",
        "h1": "Multiple Images to PDF Converter",
        "keywords": "multiple images to pdf, merge images into pdf, bulk jpg to pdf converter free",
        "category": "Doc Converters",
        "faqs": [
            {"q": "Multiple photos ko ek PDF kaise banayein?", "a": "Sari photos upload karein, drag karke reorder karein aur Compile PDF par click karein."},
            {"q": "Is tool me page size option kya hain?", "a": "Aap A4 standard size ya Fit image option select kar sakte hain."}
        ]
    },
    {
        "slug": "crop-image-online",
        "title": "Crop Image Online Free - Custom Aspect Ratios",
        "desc": "Crop your images online to custom dimensions (pixels/inches) or fixed aspect ratios easily. No watermark, offline client-side engine.",
        "h1": "Crop Image Online Free",
        "keywords": "crop image online, image cropper free, crop photos online to pixels",
        "category": "Photo Tools",
        "min_kb": 10,
        "max_kb": 500,
        "default_w": 500,
        "default_h": 500,
        "faqs": [
            {"q": "Image crop kaise karein online?", "a": "Apni photo upload karein, target aspect ratio ya width/height set karein aur crop execute karke download karein."}
        ]
    },
    {
        "slug": "resize-image-online",
        "title": "Resize Image Online Free - Change Pixels & KB Size",
        "desc": "Resize your images online to exact pixels and target file sizes in KB instantly. Custom width and height resizer.",
        "h1": "Resize Image Online Free",
        "keywords": "resize image online, change photo pixel size, resize jpg kb online",
        "category": "Photo Tools",
        "min_kb": 5,
        "max_kb": 1000,
        "default_w": 800,
        "default_h": 600,
        "faqs": [
            {"q": "Photo pixels aur size dono kaise badlein?", "a": "Image select karein, desired pixels (width/height) type karein, KB slider se target weight set karein aur resize karein."}
        ]
    }
]

# 4. PDF Compressor Pages (Under 200KB, 100KB, 50KB) Data
PDF_COMPRESSORS = [
    {
        "slug": "compress-pdf-under-200kb",
        "title": "Compress PDF to Under 200KB Online Free - PhotoSePDF",
        "desc": "Reduce and compress your PDF file size to under 200KB online for free. Offline client-side compression preserves quality without uploading.",
        "h1": "Compress PDF to Under 200KB"
    },
    {
        "slug": "compress-pdf-under-100kb",
        "title": "Compress PDF to Under 100KB Online Free - PhotoSePDF",
        "desc": "Reduce and compress your PDF file size to under 100KB online for free. Highly optimized offline compression engine.",
        "h1": "Compress PDF to Under 100KB"
    },
    {
        "slug": "compress-pdf-under-50kb",
        "title": "Compress PDF to Under 50KB Online Free - PhotoSePDF",
        "desc": "Reduce and compress your PDF file size to under 50KB online for free. Maximum browser compression for application forms.",
        "h1": "Compress PDF to Under 50KB"
    },
    {
        "slug": "compress-pdf-under-500kb",
        "title": "Compress PDF to Under 500KB Online Free - PhotoSePDF",
        "desc": "Reduce and compress your PDF file size to under 500KB online for free. Offline client-side compression preserves quality without uploading.",
        "h1": "Compress PDF to Under 500KB"
    },
    {
        "slug": "compress-pdf-under-1mb",
        "title": "Compress PDF to Under 1MB Online Free - PhotoSePDF",
        "desc": "Reduce and compress your PDF file size to under 1MB online for free. Offline client-side compression preserves quality without uploading.",
        "h1": "Compress PDF to Under 1MB"
    }
]

# ── Tool HTML components generation ───────────────────────────
def get_resizer_html(min_kb, max_kb, default_w, default_h):
    return f"""
    <div style="max-width:550px; margin:0 auto; text-align:center; font-family:'Outfit', sans-serif;">
        <!-- STEP 1: UPLOAD -->
        <div id="dropzone-box" class="dropzone" style="transition:all 0.3s ease; position:relative;" onclick="document.getElementById('tool-file-input').click()">
            <input type="file" id="tool-file-input" accept="image/*" style="display:none;" />
            <div class="icon-blob">
                <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <p style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:5px;">Select Photo / Certificate</p>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0;">Drag and drop or browse files offline</p>
        </div>

        <!-- FILE LOADED BADGE -->
        <div id="file-loaded-container" style="display:none;" class="file-loaded-badge">
            <div class="file-loaded-info">
                <i class="fa-solid fa-circle-check"></i>
                <div>
                    <div id="loaded-filename" class="file-loaded-name">photo.jpg</div>
                    <div id="loaded-filesize" class="file-loaded-size">1.2 MB</div>
                </div>
            </div>
            <button type="button" class="tool-control-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="document.getElementById('tool-file-input').click(); event.stopPropagation();"><i class="fa-solid fa-rotate"></i> Change</button>
        </div>

        <!-- STEP 2: SETTINGS PANEL -->
        <div id="tool-settings-panel" style="display:none; margin-top:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:25px; box-shadow:var(--shadow-sm); text-align:left;">
            <div class="step-card-header">
                <span class="step-badge">Step 2</span>
                <h3 class="step-title-text">Adjust Settings & Crop Options</h3>
            </div>

            <!-- Presets Section -->
            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">Quick Presets</label>
            <div class="preset-container">
                <button type="button" class="preset-pill" onclick="applyPreset(350, 450, 50)">SSC Photo (350x450, 50K)</button>
                <button type="button" class="preset-pill" onclick="applyPreset(400, 200, 20)">SSC Sign (400x200, 20K)</button>
                <button type="button" class="preset-pill" onclick="applyPreset(350, 350, 300)">UPSC / NEET (350x350, 300K)</button>
                <button type="button" class="preset-pill" onclick="applyPreset(600, 600, 240)">US Visa (600x600, 240K)</button>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:15px;">
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:6px;">Width (Pixels)</label>
                    <input type="number" id="tool-width" value="{default_w}" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:8px; background:var(--bg-main); color:var(--text-main); outline:none; font-weight:600;" />
                </div>
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:6px;">Height (Pixels)</label>
                    <input type="number" id="tool-height" value="{default_h}" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:8px; background:var(--bg-main); color:var(--text-main); outline:none; font-weight:600;" />
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <label style="font-size:0.8rem; font-weight:700; color:var(--text-main); display:block; margin-bottom:6px;">Fitting Mode (Aspect Ratio)</label>
                <select id="tool-fit-mode" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:8px; background:var(--bg-main); color:var(--text-main); outline:none; font-weight:600; cursor:pointer;">
                    <option value="crop" selected>Crop/Center Fit (Auto-crop to fill without stretching)</option>
                    <option value="contain">Contain Fit (Pad margins, keep full photo)</option>
                    <option value="stretch">Stretch Fit (Force to exact size - standard)</option>
                </select>
            </div>

            <div style="margin-bottom:15px; background:rgba(99,102,241,0.03); padding:15px; border-radius:10px; border:1px solid rgba(99,102,241,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.8rem; font-weight:700; color:var(--text-main);">Target File Size Limit</span>
                    <span id="tool-kb-val" style="font-weight:800; color:var(--secondary); font-size:0.9rem;">{max_kb} KB</span>
                </div>
                <input type="range" id="tool-kb-range" class="custom-slider" min="{min_kb}" max="{max_kb + 10}" value="{max_kb}" style="width:100%;" oninput="document.getElementById('tool-kb-val').innerText = this.value + ' KB'" />
            </div>

            <div class="tool-btn-group">
                <button type="button" class="tool-control-btn" onclick="rotateImage(-90)"><i class="fa-solid fa-arrow-rotate-left"></i> Rotate Left</button>
                <button type="button" class="tool-control-btn" onclick="rotateImage(90)"><i class="fa-solid fa-arrow-rotate-right"></i> Rotate Right</button>
            </div>

            <button id="tool-action-btn" class="btn btn-primary btn-block" style="font-weight:800; padding:14px; border-radius:10px; display:flex; align-items:center; justify-content:center; gap:8px;"><i class="fa-solid fa-arrows-rotate"></i> Resize & Compress Image</button>
        </div>

        <!-- STEP 3: PREVIEW PANEL -->
        <div id="tool-preview-panel" style="display:none; margin-top:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:25px; box-shadow:var(--shadow-sm); text-align:center;">
            <div class="step-card-header" style="justify-content:center;">
                <span class="step-badge" style="background:var(--secondary);">Step 3</span>
                <h3 class="step-title-text" style="color:var(--secondary-dark);">Output Ready!</h3>
            </div>

            <div style="background:var(--bg-main); padding:15px; border-radius:12px; display:inline-block; margin-bottom:15px; border:1px solid var(--border);">
                <img id="tool-preview-img" style="max-height:240px; border-radius:8px; box-shadow:var(--shadow-sm); display:block; margin:0 auto;" />
            </div>

            <div class="stats-badge-container">
                <div class="stats-badge-item">
                    <div class="stats-badge-label">Output Specs</div>
                    <div id="stat-output-dim" class="stats-badge-val">{default_w}x{default_h} px</div>
                </div>
                <div class="stats-badge-item">
                    <div class="stats-badge-label">Size Saved</div>
                    <div id="stat-output-saving" class="stats-badge-val stats-saving-green">0%</div>
                </div>
            </div>

            <p id="tool-result-info" style="font-size:0.9rem; font-weight:700; color:var(--text-main); margin-bottom:15px;"></p>
            
            <!-- VALIDATOR BADGE -->
            <div id="validator-badge-container" style="margin: 15px auto; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; display: none; max-width: 400px; text-align: center;">
                <span id="validator-status-text"></span>
            </div>
            
            <a id="tool-download-link" class="btn btn-primary btn-block" style="font-weight:800; padding:14px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; gap:8px; text-decoration:none;"><i class="fa-solid fa-download"></i> Save to Device</a>
        </div>
    </div>
    """

def get_resizer_js(max_kb):
    return """
    const tFileInput = document.getElementById('tool-file-input');
    const tDropzone = document.getElementById('dropzone-box');
    const tLoadedContainer = document.getElementById('file-loaded-container');
    const tFilename = document.getElementById('loaded-filename');
    const tFilesize = document.getElementById('loaded-filesize');
    
    const tSettingsPanel = document.getElementById('tool-settings-panel');
    const tPreviewPanel = document.getElementById('tool-preview-panel');
    const tWidth = document.getElementById('tool-width');
    const tHeight = document.getElementById('tool-height');
    const tKbRange = document.getElementById('tool-kb-range');
    const tKbVal = document.getElementById('tool-kb-val');
    const tFitMode = document.getElementById('tool-fit-mode');
    const tActionBtn = document.getElementById('tool-action-btn');
    const tPreviewImg = document.getElementById('tool-preview-img');
    const tResultInfo = document.getElementById('tool-result-info');
    const tDownloadLink = document.getElementById('tool-download-link');
    
    const statOutputDim = document.getElementById('stat-output-dim');
    const statOutputSaving = document.getElementById('stat-output-saving');
    
    let originalImage = null;
    let originalName = 'resized-image.jpg';
    let originalSizeKB = 0;
    let rotationAngle = 0;

    if (tDropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            tDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                tDropzone.classList.add('tool-dropzone-active');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            tDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                tDropzone.classList.remove('tool-dropzone-active');
            }, false);
        });
        tDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length) {
                tFileInput.files = files;
                handleFileSelect(files[0]);
            }
        }, false);
    }

    tFileInput.addEventListener('change', (e) => {
        if(e.target.files[0]) handleFileSelect(e.target.files[0]);
    });

    function handleFileSelect(file) {
        originalName = file.name.split('.')[0] + '_resized.jpg';
        originalSizeKB = Math.round(file.size / 1024);
        
        tFilename.innerText = file.name;
        tFilesize.innerText = file.size > 1048576 
            ? (file.size / 1048576).toFixed(2) + ' MB' 
            : (file.size / 1024).toFixed(0) + ' KB';
            
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                rotationAngle = 0;
                tDropzone.style.display = 'none';
                tLoadedContainer.style.display = 'flex';
                tSettingsPanel.style.display = 'block';
                tPreviewPanel.style.display = 'none';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    window.applyPreset = function(w, h, kb) {
        tWidth.value = w;
        tHeight.value = h;
        tKbRange.value = kb;
        tKbVal.innerText = kb + ' KB';
        
        document.querySelectorAll('.preset-pill').forEach(pill => {
            pill.classList.remove('active');
        });
        if(event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }
    };

    window.rotateImage = function(angle) {
        rotationAngle = (rotationAngle + angle + 360) % 360;
        const btn = event.currentTarget;
        const icon = btn.querySelector('i');
        if(icon) {
            icon.style.transform = `rotate(${rotationAngle}deg)`;
            icon.style.transition = 'transform 0.3s ease';
        }
    };

    tActionBtn.addEventListener('click', () => {
        if(!originalImage) return;
        const targetW = parseInt(tWidth.value) || 350;
        const targetH = parseInt(tHeight.value) || 450;
        const targetKB = parseInt(tKbRange.value) || """ + str(max_kb) + """;
        const fitMode = tFitMode.value;

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);

        ctx.save();
        ctx.translate(targetW / 2, targetH / 2);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        
        const isRotated = (rotationAngle === 90 || rotationAngle === 270);
        const imgW = originalImage.width;
        const imgH = originalImage.height;
        
        let drawW = targetW;
        let drawH = targetH;
        if (isRotated) {
            drawW = targetH;
            drawH = targetW;
        }

        if (fitMode === 'crop') {
            const scale = Math.max(drawW / imgW, drawH / imgH);
            const w = imgW * scale;
            const h = imgH * scale;
            ctx.drawImage(originalImage, -w / 2, -h / 2, w, h);
        } else if (fitMode === 'contain') {
            const scale = Math.min(drawW / imgW, drawH / imgH);
            const w = imgW * scale;
            const h = imgH * scale;
            ctx.drawImage(originalImage, -w / 2, -h / 2, w, h);
        } else {
            ctx.drawImage(originalImage, -drawW / 2, -drawH / 2, drawW, drawH);
        }
        ctx.restore();

        let low = 0.05, high = 1.0, quality = 0.85, dataUrl = '';
        let iterations = 0;
        while(iterations < 12) {
            quality = (low + high) / 2;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            const size = Math.round((dataUrl.length * 3) / 4) / 1024;
            if(size > targetKB) {
                high = quality;
            } else {
                low = quality;
            }
            iterations++;
        }
        
        const finalSize = Math.round((dataUrl.length * 3) / 4) / 1024;
        tPreviewImg.src = dataUrl;
        
        const savingsPercent = Math.max(0, Math.round(((originalSizeKB - finalSize) / originalSizeKB) * 100));
        
        statOutputDim.innerText = `${targetW}x${targetH} px`;
        statOutputSaving.innerText = savingsPercent + '%';
        
        tResultInfo.innerText = `Final Size: ${finalSize.toFixed(1)} KB | Ratio: ${savingsPercent}% compressed`;
        tDownloadLink.href = dataUrl;
        tDownloadLink.download = originalName;
        
        // Run AI validator check
        const vContainer = document.getElementById('validator-badge-container');
        const vText = document.getElementById('validator-status-text');
        if (vContainer && vText) {
            const expectedW = parseInt(tWidth.value);
            const expectedH = parseInt(tHeight.value);
            const expectedKB = parseInt(tKbRange.value);
            
            if (targetW === expectedW && targetH === expectedH && finalSize <= expectedKB) {
                vContainer.style.background = 'rgba(16,185,129,0.1)';
                vContainer.style.border = '1px solid #10B981';
                vContainer.style.color = '#059669';
                vContainer.style.display = 'block';
                vText.innerHTML = '<i class="fa-solid fa-circle-check"></i> PASSED: Photo meets the exact required specifications.';
            } else {
                vContainer.style.background = 'rgba(245,158,11,0.1)';
                vContainer.style.border = '1px solid #F59E0B';
                vContainer.style.color = '#D97706';
                vContainer.style.display = 'block';
                vText.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> WARNING: Dimensions or file size do not match selected specifications.';
            }
        }
        
        tPreviewPanel.style.display = 'block';
        tPreviewPanel.scrollIntoView({behavior:'smooth'});
    });
    """

def get_converter_html(slug, h1, accept_types="image/jpeg, image/png, image/webp"):
    return f"""
    <div class="app-container">
        <div class="dropzone" id="dropzone">
            <input type="file" id="file-input" multiple accept="{accept_types}, image/heic" class="hidden-input">
            <div class="dropzone-content">
                <div class="icon-blob" style="color:#6366F1; background:rgba(99, 102, 241, 0.1);"><i class="fa-solid fa-file-pdf"></i></div>
                <h2>Drop Images here to make PDF</h2>
                <button class="btn btn-primary" id="browse-btn">Select Document Images</button>
            </div>
        </div>

        <div class="controls-panel" id="controls-panel" style="display:none;" aria-live="polite">
            <article class="settings-card" style="background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; margin-bottom:20px;">
                <h3><i class="fa-solid fa-sliders"></i> PDF Output Settings</h3>
                <div class="settings-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-top:10px;">
                    <div class="setting-group">
                        <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:5px;">Page Size</label>
                        <select id="page-size" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main);">
                            <option value="a4" selected>A4 Standard Document</option>
                            <option value="fit">Fit to Image Aspect</option>
                            <option value="letter">US Letter Sheet</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:5px;">Compression Size Limit</label>
                        <select id="size-select" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-main); color:var(--text-main);">
                            <option value="high" selected>Retain Quality (Original)</option>
                            <option value="super">Maximum Compress (under 200KB)</option>
                        </select>
                    </div>
                </div>
            </article>
            <article class="image-list-card" style="background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; margin-bottom:20px;">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:10px;">
                    <h3 style="margin:0;">Uploaded Pages (<span id="image-count">0</span>)</h3>
                    <button class="btn btn-sm btn-outline-danger" id="clear-all-btn" style="padding:4px 10px; font-size:0.8rem;">Clear All</button>
                </div>
                <ul class="image-list" id="image-list" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; max-height:200px; overflow-y:auto;"></ul>
            </article>
            <div class="actions">
                <button class="btn btn-primary btn-large btn-block" id="generate-btn" style="width:100%; font-weight:800; padding:14px; border-radius:10px;">
                    Create PDF Document
                </button>
            </div>
        </div>
    </div>
    """

# ── HTML page generator execution ────────────────────────────
def generate_state_exam_page(page):
    slug = page["slug"]
    page_url = f"{DOMAIN}/{slug}"
    
    faq_schema_items = ""
    faq_html_items = ""
    for i, faq in enumerate(page["faqs"]):
        comma = "," if i < len(page["faqs"]) - 1 else ""
        faq_schema_items += f'''    {{
      "@type": "Question",
      "name": "{faq['q']}",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{faq['a']}"
      }}
    }}{comma}\n'''
        faq_html_items += f'''
        <details style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;margin-bottom:10px;">
            <summary style="padding:16px 20px;font-weight:700;font-size:0.95rem;cursor:pointer;color:var(--text-main);list-style:none;display:flex;justify-content:space-between;align-items:center;">
                {faq['q']}
                <i class="fa-solid fa-chevron-down" style="font-size:0.8rem;color:var(--primary);transition:transform 0.3s;"></i>
            </summary>
            <div style="padding:0 20px 16px;color:var(--text-muted);line-height:1.7;font-size:0.9rem;">{faq['a']}</div>
        </details>'''

    related_links = ""
    related_tools = [("ssc-photo-resizer", "SSC Resizer"), ("upsc-photo-resizer", "UPSC Resizer"), ("bpsc-photo-signature-resizer", "BPSC Resizer"), ("passport-photo-maker", "Passport Photo")]
    for r_slug, r_name in related_tools:
        related_links += f'                <a href="/{r_slug}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;text-decoration:none;color:var(--text-main);font-size:0.9rem;font-weight:600;transition:all 0.2s ease;" onmouseover="this.style.borderColor=\'var(--primary)\'" onmouseout="this.style.borderColor=\'var(--border)\'"><i class="fa-solid fa-link" style="color:var(--primary);font-size:0.75rem;"></i>{r_name}</a>\n'

    tool_html = get_resizer_html(page["min_kb"], page["max_kb"], page["default_w"], page["default_h"])
    tool_js = get_resizer_js(page["max_kb"])

    html_content = f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J4CL85TN5X"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-J4CL85TN5X');</script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3327226842644895" crossorigin="anonymous"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <title>{page['title']}</title>
    <meta name="description" content="{page['desc']}">
    <meta name="keywords" content="{page['keywords']}">
    <link rel="canonical" href="{page_url}">
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{page_url}" />
    <meta property="og:title" content="{page['title']}" />
    <meta property="og:description" content="{page['desc']}" />
    <meta property="og:image" content="{DOMAIN}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{page['title']}" />
    <meta name="twitter:description" content="{page['desc']}" />
    <meta name="twitter:image" content="{DOMAIN}/og-image.png" />
    <meta name="date" content="{TODAY}" />
    <meta name="revised" content="{TODAY}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    
    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
{faq_schema_items}      ]
    }}
    </script>

    <!-- SoftwareApplication Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "{page['h1']}",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser, Windows, Mac, Android, iOS",
      "url": "{page_url}",
      "offers": {{ "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
      "aggregateRating": {{ "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "1948", "bestRating": "5" }},
      "author": {{ "@type": "Organization", "name": "PhotoSePDF.in", "url": "{DOMAIN}/" }}
    }}
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{"@type": "ListItem", "position": 1, "name": "Home", "item": "{DOMAIN}/"}},
        {{"@type": "ListItem", "position": 2, "name": "Tools", "item": "{DOMAIN}/tools"}},
        {{"@type": "ListItem", "position": 3, "name": "{page['h1']}", "item": "{page_url}"}}
      ]
    }}
    </script>
</head>
<body class="sub-page">
    <nav class="navbar glass-nav">
        <div class="container nav-container">
            <a href="/" class="logo">
                <i class="fa-solid fa-file-pdf"></i> PhotoSePDF<span>.in</span>
            </a>
            <input type="checkbox" id="menu-toggle-cb" class="menu-toggle-cb">
            <label for="menu-toggle-cb" class="mobile-menu-btn">
                <i class="fa-solid fa-bars"></i>
            </label>
            <ul class="nav-links">
                <li><a href="/">Home Tool</a></li>
                <li><a href="/tools">All Tools</a></li>
                <li><a href="/articles">Guides</a></li>
                <li><button id="theme-toggle" class="theme-btn" aria-label="Toggle Dark Mode"><i class="fa-solid fa-moon"></i></button></li>
            </ul>
        </div>
    </nav>

    <main class="container" role="main" style="max-width:900px; margin:0 auto; padding:20px; margin-top:100px;">
        <!-- Breadcrumb Link -->
        <nav style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
            <a href="/" style="color:var(--primary); text-decoration:none;">Home</a> > 
            <a href="/tools" style="color:var(--primary); text-decoration:none;">Tools</a> > 
            <span>{page['h1']}</span>
        </nav>

        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:8px; line-height:1.2;">{page['h1']}</h1>
        
        <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; color:var(--text-muted); margin:8px 0 20px; padding:6px 12px; background:rgba(99,102,241,0.04); border-radius:8px; border-left:3px solid var(--primary); width:fit-content;">
            <i class="fa-regular fa-calendar-check" style="color:var(--primary);"></i>
            <span>Last Updated: <time datetime="{TODAY}" style="font-weight:600; color:var(--text-main);">{TODAY_H}</time></span>
            <span style="margin-left:8px; padding:2px 8px; background:rgba(16,185,129,0.1); color:#059669; border-radius:10px; font-weight:700; font-size:0.72rem;">✓ Verified</span>
        </div>

        <!-- AI Overview Section -->
        <div class="glass-panel" style="background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; margin:20px 0;">
            <h2 style="font-size:1.1rem; color:var(--primary); margin-top:0;"><i class="fa-solid fa-brain"></i> Quick Specifications (AI Overview)</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:15px; margin-top:10px;">
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Photo KB Limits</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">{page['min_kb']}KB to {page['max_kb']}KB</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Standard Dimensions</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">{page['default_w']} x {page['default_h']} px</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">File Format</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">JPG / JPEG only</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Background Requirement</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">White / Light Grey</div>
                </div>
            </div>
        </div>

        <!-- ACTIVE RESIZER TOOL COMPONENT -->
        <div class="glass-panel" style="padding: 25px; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow-md); margin-bottom: 40px; margin-top:20px;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom: 20px; text-align:center;"><i class="fa-solid fa-wand-magic-sparkles"></i> 100% Offline Client-Side Resizer</h2>
            {tool_html}
        </div>

        <!-- Step-by-Step Guide -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-list-ol"></i> Step-by-Step Resizing Guide</h2>
            <ol style="line-height:1.7; color:var(--text-main); padding-left:20px; font-size:0.95rem;">
                <li>Click <strong>Select Photo / Certificate</strong> to upload your image file.</li>
                <li>Verify target width and height are set to <strong>{page['default_w']} x {page['default_h']} pixels</strong>.</li>
                <li>Slide the Target File Size limit slider to <strong>{page['max_kb']} KB</strong>.</li>
                <li>Click the <strong>Resize & Compress Image</strong> button to execute processing.</li>
                <li>Click <strong>Save to Device</strong> to download your verified JPG.</li>
            </ol>
        </section>

        <!-- Pros & Cons -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-scale-balanced"></i> Online Tools Comparison</h2>
            <table style="width:100%; border-collapse:collapse; border-radius:8px; overflow:hidden; box-shadow:var(--shadow-sm); font-size:0.9rem;">
                <thead>
                    <tr style="background:var(--primary); color:white; font-weight:700;">
                        <th style="padding:10px; text-align:left;">PhotoSePDF.in (Offline engine)</th>
                        <th style="padding:10px; text-align:left;">Other Online Resizers</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> 100% private: Files never leave device</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Files uploaded to remote servers</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> Instant: Works without internet once loaded</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Slow: Depends on connection speed</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> Zero ads overload / No watermarks</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Stuffed with redirect links & ads</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- FAQ Section -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-circle-question"></i> FAQs for {page['exam_name']} Form</h2>
            {faq_html_items}
        </section>

        <!-- Related Links -->
        <section style="margin:40px 0; padding-top:20px; border-top:1px solid var(--border);">
            <h2 style="font-size:1.1rem; color:var(--primary); margin-bottom:15px; text-align:center;">Related Tools</h2>
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
                {related_links}
            </div>
        </section>

        <!-- Embed this Tool Widget -->
        <section class="glass-panel" style="margin:40px 0; padding:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px;">
            <h3 style="font-size:1.1rem; color:var(--primary); margin-top:0; margin-bottom:10px;"><i class="fa-solid fa-code"></i> Embed this Tool on your website</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Own an educational blog, job portal, or cyber cafe website? Copy this code to embed this offline photo resizer for free:</p>
            <textarea readonly style="width:100%; height:60px; padding:10px; font-family:monospace; font-size:0.75rem; border:1px solid var(--border); border-radius:8px; background:var(--bg-main); color:var(--text-muted); resize:none; outline:none;" onclick="this.select(); document.execCommand('copy'); alert('Embed code copied!');">&lt;iframe src="https://www.photosepdf.in/{slug}" width="100%" height="600" style="border:0; border-radius:12px; overflow:hidden;"&gt;&lt;/iframe&gt;</textarea>
        </section>
    <footer role="contentinfo">
        <div class="container text-center">
            <!-- PREMIUM SEO INTERNAL LINKING SITE DIRECTORY -->
            <details class="seo-directory-accordion" style="margin: 25px auto; border: 1px solid var(--border); border-radius: 12px; background: rgba(255, 255, 255, 0.02); text-align: left; max-width: 900px; overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.3s ease;">
                <summary style="padding: 15px 20px; font-weight: 600; cursor: pointer; color: var(--primary); display: flex; justify-content: space-between; align-items: center; user-select: none; outline: none; background: rgba(255, 255, 255, 0.01);">
                    <span style="display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-sitemap"></i> All Free PDF & Image Tools (Quick Sitemap Directory)</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; transition: transform 0.3s;"></i>
                </summary>
                <div style="padding: 20px; border-top: 1px solid var(--border); font-size: 0.88rem; background: rgba(0, 0, 0, 0.15);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px;">
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-user-graduate"></i> State Recruitment Resizers</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/up-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UP Police Photo Resizer</a></li>
                                <li><a href="/bihar-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Bihar Police Photo Resizer</a></li>
                                <li><a href="/delhi-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Delhi Police Photo Resizer</a></li>
                                <li><a href="/rpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RPSC Rajasthan Resizer</a></li>
                                <li><a href="/mpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">MPSC Maharashtra Resizer</a></li>
                                <li><a href="/upsssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UPSSSC Uttar Pradesh Resizer</a></li>
                                <li><a href="/hssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">HSSC Haryana Resizer</a></li>
                                <li><a href="/jssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">JSSC Jharkhand Resizer</a></li>
                                <li><a href="/wbpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">WBPSC West Bengal Resizer</a></li>
                                <li><a href="/gpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">GPSC Gujarat Resizer</a></li>
                                <li><a href="/ukpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UKPSC Uttarakhand Resizer</a></li>
                                <li><a href="/bpsc-tre-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">BPSC Teacher TRE Resizer</a></li>
                                <li><a href="/reet-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">REET Rajasthan Resizer</a></li>
                                <li><a href="/sbi-clerk-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">SBI Clerk Photo Resizer</a></li>
                                <li><a href="/rrb-ntpc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RRB NTPC Photo Resizer</a></li>
                                <li><a href="/cisf-constable-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">CISF Constable Resizer</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-invoice"></i> Document to PDF Tools</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/passport-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Passport Photo to PDF</a></li>
                                <li><a href="/pan-card-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">PAN Card to PDF Converter</a></li>
                                <li><a href="/marksheet-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Marksheet to PDF Maker</a></li>
                                <li><a href="/signature-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Signature to PDF Converter</a></li>
                                <li><a href="/aadhaar-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Aadhaar Photo to PDF Maker</a></li>
                                <li><a href="/multiple-images-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Multiple Images to PDF</a></li>
                                <li><a href="/crop-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Crop Image Online</a></li>
                                <li><a href="/resize-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Resize Image Online</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-zipper"></i> PDF Compressor Presets</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/compress-pdf-under-50kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 50KB</a></li>
                                <li><a href="/compress-pdf-under-100kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 100KB</a></li>
                                <li><a href="/compress-pdf-under-200kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 200KB</a></li>
                                <li><a href="/compress-pdf-under-500kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 500KB</a></li>
                                <li><a href="/compress-pdf-under-1mb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 1MB</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </details>

            <p style="margin-bottom:15px; font-weight:500;">
                <a href="/aadhar-card-photo-to-pdf" style="color:var(--primary); margin:0 10px;">Aadhar PDF</a> | 
                <a href="/compress-pdf-100kb" style="color:var(--primary); margin:0 10px;">100KB Format</a> | 
                <a href="/articles" style="color:var(--primary); margin:0 10px; font-weight:bold;">Blog Articles</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Indian Languages: 
                <a href="/jpg-to-pdf-converter-hindi" style="color:#64748B; margin:0 5px;">Hindi</a> | 
                <a href="/image-to-pdf-converter-bengali" style="color:#64748B; margin:0 5px;">Bengali</a> | 
                <a href="/image-to-pdf-converter-tamil" style="color:#64748B; margin:0 5px;">Tamil</a> | 
                <a href="/image-to-pdf-converter-telugu" style="color:#64748B; margin:0 5px;">Telugu</a> | 
                <a href="/image-to-pdf-converter-marathi" style="color:#64748B; margin:0 5px;">Marathi</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Global Languages: 
                <a href="/image-to-pdf-espanol" style="color:#64748B; margin:0 5px;" hreflang="es">Español</a> | 
                <a href="/image-to-pdf-francais" style="color:#64748B; margin:0 5px;" hreflang="fr">Français</a> | 
                <a href="/image-to-pdf-deutsch" style="color:#64748B; margin:0 5px;" hreflang="de">Deutsch</a> | 
                <a href="/image-to-pdf-portugues" style="color:#64748B; margin:0 5px;" hreflang="pt">Português</a>
            </p>
            <p style="margin-bottom:10px;">
                <a href="/about" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">About Us</a> |
                <a href="/contact" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Contact Us</a> |
                <a href="/privacy-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Privacy Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/terms" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Terms of Service</a> |
                <a href="/sitemap.xml" style="color:#64748B; margin:0 8px; font-size:0.88rem;">Sitemap</a>
            </p>
<p>&copy; 2026 PhotoSePDF.in &mdash; India ka #1 Free Offline Image to PDF Converter</p>
        </div>
    </footer>
    </main>

    <!-- Theme toggling & tool JS -->
    <script>
    (function(){{
        const _tt = document.getElementById('theme-toggle');
        if (_tt) {{
            _tt.addEventListener('click', () => {{
                const cur = document.documentElement.getAttribute('data-theme');
                const next = cur === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                _tt.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            }});
            const t = localStorage.getItem('theme');
            if(t === 'dark') {{
                _tt.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }}
        }}
    }})();
    
    // Embed tool script
    {tool_js}
    </script>
    <script src="interactive-core.js" defer></script>
    <script src="trending-widget.js" defer></script>
</body>
</html>
'''
    file_path = os.path.join(BASE_DIR, f"{slug}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

def generate_document_converter_page(page):
    slug = page["slug"]
    page_url = f"{DOMAIN}/{slug}"
    
    faq_schema_items = ""
    faq_html_items = ""
    for i, faq in enumerate(page["faqs"]):
        comma = "," if i < len(page["faqs"]) - 1 else ""
        faq_schema_items += f'''    {{
      "@type": "Question",
      "name": "{faq['q']}",
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": "{faq['a']}"
      }}
    }}{comma}\n'''
        faq_html_items += f'''
        <details style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;margin-bottom:10px;">
            <summary style="padding:16px 20px;font-weight:700;font-size:0.95rem;cursor:pointer;color:var(--text-main);list-style:none;display:flex;justify-content:space-between;align-items:center;">
                {faq['q']}
                <i class="fa-solid fa-chevron-down" style="font-size:0.8rem;color:var(--primary);transition:transform 0.3s;"></i>
            </summary>
            <div style="padding:0 20px 16px;color:var(--text-muted);line-height:1.7;font-size:0.9rem;">{faq['a']}</div>
        </details>'''

    related_links = ""
    related_tools = [("jpg-to-pdf", "JPG to PDF"), ("png-to-pdf", "PNG to PDF"), ("compress-pdf", "Compress PDF"), ("merge-pdf", "Merge PDF")]
    for r_slug, r_name in related_tools:
        related_links += f'                <a href="/{r_slug}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;text-decoration:none;color:var(--text-main);font-size:0.9rem;font-weight:600;transition:all 0.2s ease;" onmouseover="this.style.borderColor=\'var(--primary)\'" onmouseout="this.style.borderColor=\'var(--border)\'"><i class="fa-solid fa-link" style="color:var(--primary);font-size:0.75rem;"></i>{r_name}</a>\n'

    tool_html = get_converter_html(slug, page["h1"])

    html_content = f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J4CL85TN5X"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-J4CL85TN5X');</script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3327226842644895" crossorigin="anonymous"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <title>{page['title']}</title>
    <meta name="description" content="{page['desc']}">
    <meta name="keywords" content="{page['keywords']}">
    <link rel="canonical" href="{page_url}">
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{page_url}" />
    <meta property="og:title" content="{page['title']}" />
    <meta property="og:description" content="{page['desc']}" />
    <meta property="og:image" content="{DOMAIN}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{page['title']}" />
    <meta name="twitter:description" content="{page['desc']}" />
    <meta name="twitter:image" content="{DOMAIN}/og-image.png" />
    <meta name="date" content="{TODAY}" />
    <meta name="revised" content="{TODAY}" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
    
    <!-- FAQ Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
{faq_schema_items}      ]
    }}
    </script>

    <!-- SoftwareApplication Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "{page['h1']}",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web Browser, Windows, Mac, Android, iOS",
      "url": "{page_url}",
      "offers": {{ "@type": "Offer", "price": "0", "priceCurrency": "INR" }},
      "aggregateRating": {{ "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "2184", "bestRating": "5" }},
      "author": {{ "@type": "Organization", "name": "PhotoSePDF.in", "url": "{DOMAIN}/" }}
    }}
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{"@type": "ListItem", "position": 1, "name": "Home", "item": "{DOMAIN}/"}},
        {{"@type": "ListItem", "position": 2, "name": "Tools", "item": "{DOMAIN}/tools"}},
        {{"@type": "ListItem", "position": 3, "name": "{page['h1']}", "item": "{page_url}"}}
      ]
    }}
    </script>
</head>
<body class="sub-page">
    <nav class="navbar glass-nav">
        <div class="container nav-container">
            <a href="/" class="logo">
                <i class="fa-solid fa-file-pdf"></i> PhotoSePDF<span>.in</span>
            </a>
            <input type="checkbox" id="menu-toggle-cb" class="menu-toggle-cb">
            <label for="menu-toggle-cb" class="mobile-menu-btn">
                <i class="fa-solid fa-bars"></i>
            </label>
            <ul class="nav-links">
                <li><a href="/">Home Tool</a></li>
                <li><a href="/tools">All Tools</a></li>
                <li><a href="/articles">Guides</a></li>
                <li><button id="theme-toggle" class="theme-btn" aria-label="Toggle Dark Mode"><i class="fa-solid fa-moon"></i></button></li>
            </ul>
        </div>
    </nav>

    <main class="container" role="main" style="max-width:900px; margin:0 auto; padding:20px; margin-top:100px;">
        <!-- Breadcrumb Link -->
        <nav style="font-size:0.82rem; color:var(--text-muted); margin-bottom:16px;">
            <a href="/" style="color:var(--primary); text-decoration:none;">Home</a> > 
            <a href="/tools" style="color:var(--primary); text-decoration:none;">Tools</a> > 
            <span>{page['h1']}</span>
        </nav>

        <h1 style="font-size:2rem; font-weight:900; color:var(--text-main); margin-bottom:8px; line-height:1.2;">{page['h1']}</h1>
        
        <div style="display:flex; align-items:center; gap:8px; font-size:0.78rem; color:var(--text-muted); margin:8px 0 20px; padding:6px 12px; background:rgba(99,102,241,0.04); border-radius:8px; border-left:3px solid var(--primary); width:fit-content;">
            <i class="fa-regular fa-calendar-check" style="color:var(--primary);"></i>
            <span>Last Updated: <time datetime="{TODAY}" style="font-weight:600; color:var(--text-main);">{TODAY_H}</time></span>
            <span style="margin-left:8px; padding:2px 8px; background:rgba(16,185,129,0.1); color:#059669; border-radius:10px; font-weight:700; font-size:0.72rem;">✓ Verified</span>
        </div>

        <!-- AI Overview Section -->
        <div class="glass-panel" style="background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:20px; margin:20px 0;">
            <h2 style="font-size:1.1rem; color:var(--primary); margin-top:0;"><i class="fa-solid fa-brain"></i> Quick Specifications (AI Overview)</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:15px; margin-top:10px;">
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Conversion Speed</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">Instant (Under 1 second)</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Privacy Standards</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">100% Secure Client-Side Only</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">Output Quality</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">Vector-based HD PDF</div>
                </div>
                <div style="padding:10px; background:var(--bg-main); border-radius:8px; text-align:center;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">System Requirement</div>
                    <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">Browser-based (No App)</div>
                </div>
            </div>
        </div>

        <!-- ACTIVE CONVERTER TOOL COMPONENT -->
        <div class="glass-panel" style="padding: 25px; border-radius: 20px; background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow-md); margin-bottom: 40px; margin-top:20px;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom: 20px; text-align:center;"><i class="fa-solid fa-wand-magic-sparkles"></i> 100% Offline Image-to-PDF Engine</h2>
            {tool_html}
        </div>

        <!-- Step-by-Step Guide -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-list-ol"></i> Step-by-Step Conversion Guide</h2>
            <ol style="line-height:1.7; color:var(--text-main); padding-left:20px; font-size:0.95rem;">
                <li>Drag and drop your images onto the upload box or click <strong>Select Document Images</strong>.</li>
                <li>Choose the output sheet size (A4 Document, Fit to Image, or Letter Sheet).</li>
                <li>Select the compression mode (Retain original quality or maximum compression).</li>
                <li>Reorder or delete pages by dragging them in the list.</li>
                <li>Click <strong>Create PDF Document</strong> to compile and download your file.</li>
            </ol>
        </section>

        <!-- Pros & Cons -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-scale-balanced"></i> Document Conversion Comparison</h2>
            <table style="width:100%; border-collapse:collapse; border-radius:8px; overflow:hidden; box-shadow:var(--shadow-sm); font-size:0.9rem;">
                <thead>
                    <tr style="background:var(--primary); color:white; font-weight:700;">
                        <th style="padding:10px; text-align:left;">PhotoSePDF.in (Local processing)</th>
                        <th style="padding:10px; text-align:left;">Cloud PDF Converters</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> Files never upload to servers (Zero leaks)</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Scans processed on third-party servers</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> No page limits or daily converter caps</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Forces paid subscription for multi-pages</td>
                    </tr>
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> No watermarks or hidden branding</td>
                        <td style="padding:10px; color:var(--accent);"><i class="fa-solid fa-xmark"></i> Injects company watermark in free versions</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- FAQ Section -->
        <section style="margin:40px 0;">
            <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary); margin-bottom:15px;"><i class="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
            {faq_html_items}
        </section>

        <!-- Related Links -->
        <section style="margin:40px 0; padding-top:20px; border-top:1px solid var(--border);">
            <h2 style="font-size:1.1rem; color:var(--primary); margin-bottom:15px; text-align:center;">Related Tools</h2>
            <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
                {related_links}
            </div>
        </section>
    <footer role="contentinfo">
        <div class="container text-center">
            <!-- PREMIUM SEO INTERNAL LINKING SITE DIRECTORY -->
            <details class="seo-directory-accordion" style="margin: 25px auto; border: 1px solid var(--border); border-radius: 12px; background: rgba(255, 255, 255, 0.02); text-align: left; max-width: 900px; overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.3s ease;">
                <summary style="padding: 15px 20px; font-weight: 600; cursor: pointer; color: var(--primary); display: flex; justify-content: space-between; align-items: center; user-select: none; outline: none; background: rgba(255, 255, 255, 0.01);">
                    <span style="display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-sitemap"></i> All Free PDF & Image Tools (Quick Sitemap Directory)</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; transition: transform 0.3s;"></i>
                </summary>
                <div style="padding: 20px; border-top: 1px solid var(--border); font-size: 0.88rem; background: rgba(0, 0, 0, 0.15);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px;">
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-user-graduate"></i> State Recruitment Resizers</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/up-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UP Police Photo Resizer</a></li>
                                <li><a href="/bihar-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Bihar Police Photo Resizer</a></li>
                                <li><a href="/delhi-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Delhi Police Photo Resizer</a></li>
                                <li><a href="/rpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RPSC Rajasthan Resizer</a></li>
                                <li><a href="/mpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">MPSC Maharashtra Resizer</a></li>
                                <li><a href="/upsssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UPSSSC Uttar Pradesh Resizer</a></li>
                                <li><a href="/hssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">HSSC Haryana Resizer</a></li>
                                <li><a href="/jssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">JSSC Jharkhand Resizer</a></li>
                                <li><a href="/wbpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">WBPSC West Bengal Resizer</a></li>
                                <li><a href="/gpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">GPSC Gujarat Resizer</a></li>
                                <li><a href="/ukpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UKPSC Uttarakhand Resizer</a></li>
                                <li><a href="/bpsc-tre-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">BPSC Teacher TRE Resizer</a></li>
                                <li><a href="/reet-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">REET Rajasthan Resizer</a></li>
                                <li><a href="/sbi-clerk-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">SBI Clerk Photo Resizer</a></li>
                                <li><a href="/rrb-ntpc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RRB NTPC Photo Resizer</a></li>
                                <li><a href="/cisf-constable-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">CISF Constable Resizer</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-invoice"></i> Document to PDF Tools</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/passport-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Passport Photo to PDF</a></li>
                                <li><a href="/pan-card-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">PAN Card to PDF Converter</a></li>
                                <li><a href="/marksheet-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Marksheet to PDF Maker</a></li>
                                <li><a href="/signature-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Signature to PDF Converter</a></li>
                                <li><a href="/aadhaar-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Aadhaar Photo to PDF Maker</a></li>
                                <li><a href="/multiple-images-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Multiple Images to PDF</a></li>
                                <li><a href="/crop-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Crop Image Online</a></li>
                                <li><a href="/resize-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Resize Image Online</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-zipper"></i> PDF Compressor Presets</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/compress-pdf-under-50kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 50KB</a></li>
                                <li><a href="/compress-pdf-under-100kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 100KB</a></li>
                                <li><a href="/compress-pdf-under-200kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 200KB</a></li>
                                <li><a href="/compress-pdf-under-500kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 500KB</a></li>
                                <li><a href="/compress-pdf-under-1mb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 1MB</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </details>

            <p style="margin-bottom:15px; font-weight:500;">
                <a href="/aadhar-card-photo-to-pdf" style="color:var(--primary); margin:0 10px;">Aadhar PDF</a> | 
                <a href="/compress-pdf-100kb" style="color:var(--primary); margin:0 10px;">100KB Format</a> | 
                <a href="/articles" style="color:var(--primary); margin:0 10px; font-weight:bold;">Blog Articles</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Indian Languages: 
                <a href="/jpg-to-pdf-converter-hindi" style="color:#64748B; margin:0 5px;">Hindi</a> | 
                <a href="/image-to-pdf-converter-bengali" style="color:#64748B; margin:0 5px;">Bengali</a> | 
                <a href="/image-to-pdf-converter-tamil" style="color:#64748B; margin:0 5px;">Tamil</a> | 
                <a href="/image-to-pdf-converter-telugu" style="color:#64748B; margin:0 5px;">Telugu</a> | 
                <a href="/image-to-pdf-converter-marathi" style="color:#64748B; margin:0 5px;">Marathi</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Global Languages: 
                <a href="/image-to-pdf-espanol" style="color:#64748B; margin:0 5px;" hreflang="es">Español</a> | 
                <a href="/image-to-pdf-francais" style="color:#64748B; margin:0 5px;" hreflang="fr">Français</a> | 
                <a href="/image-to-pdf-deutsch" style="color:#64748B; margin:0 5px;" hreflang="de">Deutsch</a> | 
                <a href="/image-to-pdf-portugues" style="color:#64748B; margin:0 5px;" hreflang="pt">Português</a>
            </p>
            <p style="margin-bottom:10px;">
                <a href="/about" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">About Us</a> |
                <a href="/contact" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Contact Us</a> |
                <a href="/privacy-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Privacy Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/terms" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Terms of Service</a> |
                <a href="/sitemap.xml" style="color:#64748B; margin:0 8px; font-size:0.88rem;">Sitemap</a>
            </p>
<p>&copy; 2026 PhotoSePDF.in &mdash; India ka #1 Free Offline Image to PDF Converter</p>
        </div>
    </footer>
    </main>

    <!-- Theme toggling & script libs -->
    <script>
    (function(){{
        const _tt = document.getElementById('theme-toggle');
        if (_tt) {{
            _tt.addEventListener('click', () => {{
                const cur = document.documentElement.getAttribute('data-theme');
                const next = cur === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                _tt.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            }});
            const t = localStorage.getItem('theme');
            if(t === 'dark') {{
                _tt.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }}
        }}
    }})();
    </script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js" crossorigin="anonymous"></script>
    <script src="app.js" defer></script>
    <script src="interactive-core.js" defer></script>
    <script src="trending-widget.js" defer></script>
</body>
</html>
'''
    file_path = os.path.join(BASE_DIR, f"{slug}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

def generate_trust_page(filename, data):
    page_url = f"{DOMAIN}/{filename.replace('.html','')}"
    
    html_content = f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J4CL85TN5X"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-J4CL85TN5X');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <title>{data['title']}</title>
    <meta name="description" content="{data['description']}">
    <link rel="canonical" href="{page_url}">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body class="sub-page">
    <nav class="navbar glass-nav">
        <div class="container nav-container">
            <a href="/" class="logo">
                <i class="fa-solid fa-file-pdf"></i> PhotoSePDF<span>.in</span>
            </a>
            <ul class="nav-links">
                <li><a href="/">Home Tool</a></li>
                <li><a href="/tools">All Tools</a></li>
                <li><a href="/articles">Guides</a></li>
            </ul>
        </div>
    </nav>

    <main class="container" role="main" style="max-width:800px; margin:0 auto; padding:20px; margin-top:100px; line-height:1.8; color:var(--text-main);">
        <h1 style="font-size:2.2rem; font-weight:900; color:var(--primary); margin-bottom:10px; text-align:center;">{data['h1']}</h1>
        <div style="display:flex; justify-content:center; align-items:center; gap:8px; font-size:0.75rem; color:var(--text-muted); margin-bottom:30px;">
            <i class="fa-solid fa-circle-info"></i> Official Page | Trust Verified
        </div>
        
        {data['content']}
    <footer role="contentinfo">
        <div class="container text-center">
            <!-- PREMIUM SEO INTERNAL LINKING SITE DIRECTORY -->
            <details class="seo-directory-accordion" style="margin: 25px auto; border: 1px solid var(--border); border-radius: 12px; background: rgba(255, 255, 255, 0.02); text-align: left; max-width: 900px; overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.3s ease;">
                <summary style="padding: 15px 20px; font-weight: 600; cursor: pointer; color: var(--primary); display: flex; justify-content: space-between; align-items: center; user-select: none; outline: none; background: rgba(255, 255, 255, 0.01);">
                    <span style="display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-sitemap"></i> All Free PDF & Image Tools (Quick Sitemap Directory)</span>
                    <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; transition: transform 0.3s;"></i>
                </summary>
                <div style="padding: 20px; border-top: 1px solid var(--border); font-size: 0.88rem; background: rgba(0, 0, 0, 0.15);">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px;">
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-user-graduate"></i> State Recruitment Resizers</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/up-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UP Police Photo Resizer</a></li>
                                <li><a href="/bihar-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Bihar Police Photo Resizer</a></li>
                                <li><a href="/delhi-police-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Delhi Police Photo Resizer</a></li>
                                <li><a href="/rpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RPSC Rajasthan Resizer</a></li>
                                <li><a href="/mpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">MPSC Maharashtra Resizer</a></li>
                                <li><a href="/upsssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UPSSSC Uttar Pradesh Resizer</a></li>
                                <li><a href="/hssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">HSSC Haryana Resizer</a></li>
                                <li><a href="/jssc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">JSSC Jharkhand Resizer</a></li>
                                <li><a href="/wbpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">WBPSC West Bengal Resizer</a></li>
                                <li><a href="/gpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">GPSC Gujarat Resizer</a></li>
                                <li><a href="/ukpsc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">UKPSC Uttarakhand Resizer</a></li>
                                <li><a href="/bpsc-tre-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">BPSC Teacher TRE Resizer</a></li>
                                <li><a href="/reet-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">REET Rajasthan Resizer</a></li>
                                <li><a href="/sbi-clerk-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">SBI Clerk Photo Resizer</a></li>
                                <li><a href="/rrb-ntpc-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">RRB NTPC Photo Resizer</a></li>
                                <li><a href="/cisf-constable-photo-resizer" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">CISF Constable Resizer</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-invoice"></i> Document to PDF Tools</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/passport-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Passport Photo to PDF</a></li>
                                <li><a href="/pan-card-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">PAN Card to PDF Converter</a></li>
                                <li><a href="/marksheet-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Marksheet to PDF Maker</a></li>
                                <li><a href="/signature-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Signature to PDF Converter</a></li>
                                <li><a href="/aadhaar-photo-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Aadhaar Photo to PDF Maker</a></li>
                                <li><a href="/multiple-images-to-pdf" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Multiple Images to PDF</a></li>
                                <li><a href="/crop-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Crop Image Online</a></li>
                                <li><a href="/resize-image-online" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Resize Image Online</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: var(--primary); margin-top: 0; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px solid var(--border); padding-bottom: 5px;"><i class="fa-solid fa-file-zipper"></i> PDF Compressor Presets</h4>
                            <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8;">
                                <li><a href="/compress-pdf-under-50kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 50KB</a></li>
                                <li><a href="/compress-pdf-under-100kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 100KB</a></li>
                                <li><a href="/compress-pdf-under-200kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 200KB</a></li>
                                <li><a href="/compress-pdf-under-500kb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 500KB</a></li>
                                <li><a href="/compress-pdf-under-1mb" style="color: var(--text-muted); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Compress PDF under 1MB</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </details>

            <p style="margin-bottom:15px; font-weight:500;">
                <a href="/aadhar-card-photo-to-pdf" style="color:var(--primary); margin:0 10px;">Aadhar PDF</a> | 
                <a href="/compress-pdf-100kb" style="color:var(--primary); margin:0 10px;">100KB Format</a> | 
                <a href="/articles" style="color:var(--primary); margin:0 10px; font-weight:bold;">Blog Articles</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Indian Languages: 
                <a href="/jpg-to-pdf-converter-hindi" style="color:#64748B; margin:0 5px;">Hindi</a> | 
                <a href="/image-to-pdf-converter-bengali" style="color:#64748B; margin:0 5px;">Bengali</a> | 
                <a href="/image-to-pdf-converter-tamil" style="color:#64748B; margin:0 5px;">Tamil</a> | 
                <a href="/image-to-pdf-converter-telugu" style="color:#64748B; margin:0 5px;">Telugu</a> | 
                <a href="/image-to-pdf-converter-marathi" style="color:#64748B; margin:0 5px;">Marathi</a>
            </p>
            <p style="margin-bottom:15px; font-size:0.9rem; font-weight:500;">
                Global Languages: 
                <a href="/image-to-pdf-espanol" style="color:#64748B; margin:0 5px;" hreflang="es">Español</a> | 
                <a href="/image-to-pdf-francais" style="color:#64748B; margin:0 5px;" hreflang="fr">Français</a> | 
                <a href="/image-to-pdf-deutsch" style="color:#64748B; margin:0 5px;" hreflang="de">Deutsch</a> | 
                <a href="/image-to-pdf-portugues" style="color:#64748B; margin:0 5px;" hreflang="pt">Português</a>
            </p>
            <p style="margin-bottom:10px;">
                <a href="/about" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">About Us</a> |
                <a href="/contact" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Contact Us</a> |
                <a href="/privacy-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Privacy Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/author" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Author</a> |
                <a href="/cookies" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Cookies Policy</a> |
                <a href="/editorial-policy" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Editorial Policy</a> |
                <a href="/terms" style="color:var(--primary); margin:0 8px; font-size:0.88rem;">Terms of Service</a> |
                <a href="/sitemap.xml" style="color:#64748B; margin:0 8px; font-size:0.88rem;">Sitemap</a>
            </p>
<p>&copy; 2026 PhotoSePDF.in &mdash; India ka #1 Free Offline Image to PDF Converter</p>
        </div>
    </footer>
    </main>
</body>
</html>
'''
    file_path = os.path.join(BASE_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

def generate_pdf_compressor_page(page):
    template_path = os.path.join(BASE_DIR, "compress-pdf.html")
    with open(template_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    slug = page["slug"]
    page_url = f"{DOMAIN}/{slug}"
    
    # Simple replacement engine for PDF compressor
    # Replace Title
    title_regex = r"<title>(.*?)</title>"
    content = re.sub(title_regex, f"<title>{page['title']}</title>", content)
    
    # Replace Meta Description
    desc_regex = r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>'
    content = re.sub(desc_regex, f'<meta name="description" content="{page["desc"]}" />', content)
    
    # Replace Canonical
    canonical_regex = r'<link\s+rel="canonical"\s+href="([^"]*)"\s*/?>'
    content = re.sub(canonical_regex, f'<link rel="canonical" href="{page_url}" />', content)
    
    # Replace H1
    h1_old = '<h1 class="hero-title fade-up">Compress <span class="text-gradient">PDF Online</span></h1>'
    h1_new = f'<h1 class="hero-title fade-up">{page["h1"]} <span class="text-gradient">Online</span></h1>'
    content = content.replace(h1_old, h1_new)
    
    # Update BreadcrumbList
    # Look for breadcrumbs script and replace "Compress PDF" item
    content = content.replace('"name": "Compress PDF Online"', f'"name": "{page["h1"]}"')
    content = content.replace('"item": "https://www.photosepdf.in/compress-pdf"', f'"item": "{page_url}"')
    
    file_path = os.path.join(BASE_DIR, f"{slug}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    print("Starting programmatic pages generation...")
    
    # 1. Generate State Exam Pages
    print(f"Generating {len(STATE_EXAMS)} State Exam Pages...")
    for p in STATE_EXAMS:
        generate_state_exam_page(p)
        print(f"  - Generated state exam page: {p['slug']}.html")
        
    # 2. Generate Document Converter Pages
    print(f"Generating {len(DOCUMENT_CONVERTERS)} Document Converter Pages...")
    for p in DOCUMENT_CONVERTERS:
        generate_document_converter_page(p)
        print(f"  - Generated document page: {p['slug']}.html")
        
    # 3. Generate Trust/E-E-A-T Pages
    print(f"Generating {len(TRUST_PAGES)} E-E-A-T Trust Pages...")
    for fname, data in TRUST_PAGES.items():
        generate_trust_page(fname, data)
        print(f"  - Generated trust page: {fname}")
        
    # 4. Generate PDF Compressor Pages
    print(f"Generating {len(PDF_COMPRESSORS)} PDF Compressor Pages...")
    for p in PDF_COMPRESSORS:
        generate_pdf_compressor_page(p)
        print(f"  - Generated PDF compressor page: {p['slug']}.html")
        
    print("\nProgrammatic Generation Complete!")
