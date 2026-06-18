/* ═══════════════════════════════════════════════════════════════
   PhotoSePDF.in — Lightweight Interactive Engine (Clean & Fast)
   Removed: Particles, 3D Tilt, Magnetic Buttons, Canvas, Blobs
   Kept: Theme sync, Scroll animations, Navbar shadow, Ripple
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Dark Mode: Sync theme icon with localStorage ───
    // NOTE: Theme toggle click handler is in app.js — do NOT add another here
    function syncThemeIcons() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
            document.querySelectorAll('#theme-toggle i').forEach(i => {
                i.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            });
        }
    }
    syncThemeIcons();

    // Wait for DOM
    window.addEventListener('DOMContentLoaded', () => {

        // ═══════════════════════════════════════════════
        // 1. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
        // ═══════════════════════════════════════════════
        if ('IntersectionObserver' in window) {
            const animObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        animObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            document.querySelectorAll('.animate-up, .animate-up-2, .animate-up-3, .animate-scale').forEach(el => {
                el.style.animationPlayState = 'paused';
                animObserver.observe(el);
            });

            // Staggered card reveals
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                        }, i * 60);
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

            document.querySelectorAll('.tool-card, .step-card, .review-card, .premium-card:not(.app-container)').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(22px) scale(0.97)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cardObserver.observe(el);
            });
        }

        // ═══════════════════════════════════════════════
        // 2. RIPPLE EFFECT ON BUTTONS
        // ═══════════════════════════════════════════════
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top  - size / 2;

            ripple.style.cssText = `
                position:absolute; width:${size}px; height:${size}px;
                left:${x}px; top:${y}px;
                border-radius:50%;
                background:rgba(255,255,255,0.25);
                transform:scale(0);
                animation:ripple-anim 0.55s ease-out forwards;
                pointer-events:none; z-index:999;
            `;

            if (!document.querySelector('#ripple-style')) {
                const st = document.createElement('style');
                st.id = 'ripple-style';
                st.textContent = '@keyframes ripple-anim{to{transform:scale(1);opacity:0}}';
                document.head.appendChild(st);
            }

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 580);
        });

        // ═══════════════════════════════════════════════
        // 3. NAVBAR SCROLL SHADOW
        // ═══════════════════════════════════════════════
        const navbar = document.querySelector('.navbar, .glass-nav');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
                } else {
                    navbar.style.boxShadow = '';
                }
            }, { passive: true });
        }

    }); // end DOMContentLoaded

})();
