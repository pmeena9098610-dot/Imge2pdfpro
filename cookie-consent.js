(function() {
    'use strict';
    if (localStorage.getItem('cookieConsent')) return;
    var style = document.createElement('style');
    style.textContent = '.cc-banner{position:fixed;bottom:0;left:0;right:0;background:rgba(15,23,42,0.97);color:#e2e8f0;padding:16px 20px;z-index:99999;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;font-family:Outfit,sans-serif;font-size:0.9rem;box-shadow:0 -4px 20px rgba(0,0,0,0.3);backdrop-filter:blur(10px);animation:ccSlideUp 0.4s ease}@keyframes ccSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}.cc-banner a{color:#818CF8;text-decoration:underline}.cc-banner-btns{display:flex;gap:10px;flex-shrink:0}.cc-btn{padding:10px 20px;border:none;border-radius:10px;font-weight:700;font-size:0.88rem;cursor:pointer;font-family:inherit;transition:all 0.2s}.cc-btn-accept{background:linear-gradient(135deg,#6366F1,#4F46E5);color:#fff}.cc-btn-accept:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.4)}.cc-btn-necessary{background:transparent;color:#94A3B8;border:1px solid #334155}.cc-btn-necessary:hover{background:#1E293B;color:#e2e8f0}@media(max-width:600px){.cc-banner{flex-direction:column;text-align:center;padding:14px 16px;font-size:0.82rem}.cc-banner-btns{width:100%;justify-content:center}}';
    document.head.appendChild(style);
    var banner = document.createElement('div');
    banner.className = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = '<div>We use cookies for analytics and ads via Google AdSense. Your files are never uploaded. <a href="/privacy-policy">Privacy Policy</a> | <a href="/cookies">Cookie Policy</a></div><div class="cc-banner-btns"><button class="cc-btn cc-btn-accept" id="cc-accept">Accept All</button><button class="cc-btn cc-btn-necessary" id="cc-necessary">Necessary Only</button></div>';
    document.body.appendChild(banner);
    document.getElementById('cc-accept').onclick = function() {
        localStorage.setItem('cookieConsent', 'all');
        banner.style.animation = 'ccSlideUp 0.3s ease reverse';
        setTimeout(function() { banner.remove(); }, 300);
    };
    document.getElementById('cc-necessary').onclick = function() {
        localStorage.setItem('cookieConsent', 'necessary');
        banner.style.animation = 'ccSlideUp 0.3s ease reverse';
        setTimeout(function() { banner.remove(); }, 300);
    };
})();
