/* ═══════════════════════════════════════════════════════════════
   PhotoSePDF.in — NEXUS Interactive Engine v10.0
   200 IQ Level: Holographic 3D Tilt + Aurora Particles + Magnetic Buttons
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
        // 1. QUANTUM 3D CARD TILT SYSTEM
        // ═══════════════════════════════════════════════
        if (!isMobile && !prefersReduced) {
            let rafId = null;
            let mouseX = 0, mouseY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!rafId) {
                    rafId = requestAnimationFrame(updateCards);
                }
            });

            function updateCards() {
                rafId = null;
                const cards = document.querySelectorAll('.card-3d');
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dist = Math.hypot(mouseX - cx, mouseY - cy);

                    if (dist < 500) {
                        const x = mouseX - rect.left;
                        const y = mouseY - rect.top;
                        const dx = x - rect.width / 2;
                        const dy = y - rect.height / 2;

                        // Smooth physics-based tilt — max 9°
                        const rx = -(dy / (rect.height / 2)) * 9;
                        const ry =  (dx / (rect.width  / 2)) * 9;

                        // Proximity scale: closer = more intense tilt
                        const proximity = Math.max(0, 1 - dist / 500);
                        const intensity = 0.3 + proximity * 0.7;

                        card.style.transform = `perspective(1100px) rotateX(${(rx * intensity).toFixed(2)}deg) rotateY(${(ry * intensity).toFixed(2)}deg) translateY(${(-6 * proximity).toFixed(1)}px) scale(${(1 + proximity * 0.012).toFixed(3)})`;

                        // Holographic spotlight
                        card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
                        card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);

                        // Layered depth for child elements
                        const icon = card.querySelector('.float-depth-icon');
                        const text = card.querySelector('.float-depth-text');
                        if (icon) icon.style.transform = `translateZ(${40 + proximity * 20}px) scale(0.95)`;
                        if (text) text.style.transform = `translateZ(${18 + proximity * 10}px)`;
                    } else {
                        resetCard(card);
                    }
                });
            }

            document.addEventListener('mouseleave', () => {
                document.querySelectorAll('.card-3d').forEach(resetCard);
            });
        }

        function resetCard(card) {
            card.style.transform = '';
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
            const icon = card.querySelector('.float-depth-icon');
            const text = card.querySelector('.float-depth-text');
            if (icon) icon.style.transform = '';
            if (text) text.style.transform = '';
        }

        // ═══════════════════════════════════════════════
        // 2. MAGNETIC BUTTON SYSTEM
        // ═══════════════════════════════════════════════
        if (!isMobile && !prefersReduced) {
            document.querySelectorAll('.btn-primary, .btn-3d').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    const px = (x / rect.width)  * 12;
                    const py = (y / rect.height) * 8;
                    btn.style.setProperty('--btn-tx', `${px}px`);
                    btn.style.setProperty('--btn-ty', `${py}px`);
                    btn.style.transform = `translate(${px}px, ${py}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        }

        // ═══════════════════════════════════════════════
        // 3. NEXUS PARTICLE GALAXY — Aurora Background
        // ═══════════════════════════════════════════════
        // Only run particle system on desktop and if prefers-reduced-motion is false to save CPU/Battery
        if (prefersReduced || isMobile) {
            // Skip to section 4 (scroll animations etc.) which are fine for reduced-motion/mobile
        } else {

        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                W = canvas.width = window.innerWidth;
                H = canvas.height = window.innerHeight;
                initParticles();
            }, 200);
        });

        // Particle configuration
        const MAX_P  = isMobile ? 30 : 65;
        const LINK_D = isMobile ? 90 : 130;

        let particles = [];
        let mx = -999, my = -999;
        let mouseActive = false;

        function initParticles() {
            const count = Math.min(MAX_P, Math.floor((W * H) / 28000));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(createParticle());
            }
        }

        function createParticle(x, y) {
            const speed = isMobile ? 0.25 : 0.35;
            return {
                x: x ?? Math.random() * W,
                y: y ?? Math.random() * H,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                r: Math.random() * 2.2 + 0.8,
                // Random aurora hue shift
                hue: Math.random() * 60 - 30,   // -30 to +30 from base color
                alpha: Math.random() * 0.4 + 0.15,
                life: 1,
            };
        }

        window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; mouseActive = true; });
        window.addEventListener('mouseleave', () => { mouseActive = false; mx = -999; my = -999; });

        // Touch support for mobile attraction
        window.addEventListener('touchmove', (e) => {
            mx = e.touches[0].clientX;
            my = e.touches[0].clientY;
            mouseActive = true;
        }, { passive: true });
        window.addEventListener('touchend', () => { mouseActive = false; });

        initParticles();

        function getTheme() {
            return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        }

        // Colors per theme
        const COLORS = {
            light: {
                particle: (hue) => `hsla(${240 + hue}, 75%, 60%, `,
                link: 'rgba(99, 102, 241, ',
                mouse: 'rgba(168, 85, 247, ',
            },
            dark: {
                particle: (hue) => `hsla(${238 + hue}, 80%, 72%, `,
                link: 'rgba(129, 140, 248, ',
                mouse: 'rgba(196, 132, 252, ',
            }
        };

        let frameCount = 0;
        function animate() {
            requestAnimationFrame(animate);
            // Skip rendering when tab is hidden (save battery)
            if (document.hidden) return;
            frameCount++;

            ctx.clearRect(0, 0, W, H);
            const theme = getTheme();
            const C = COLORS[theme];

            // ── Update & draw particles ──
            particles.forEach((p, i) => {
                // Movement
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges (smooth)
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;

                // Mouse gravity / attraction
                if (mouseActive) {
                    const dx = mx - p.x;
                    const dy = my - p.y;
                    const d  = Math.hypot(dx, dy);
                    if (d < 220) {
                        const force = (1 - d / 220) * 0.15;
                        p.vx += (dx / d) * force;
                        p.vy += (dy / d) * force;
                    }
                }

                // Velocity damping
                p.vx *= 0.995;
                p.vy *= 0.995;

                // Max speed clamp
                const spd = Math.hypot(p.vx, p.vy);
                const maxSpd = isMobile ? 0.5 : 0.7;
                if (spd > maxSpd) {
                    p.vx = (p.vx / spd) * maxSpd;
                    p.vy = (p.vy / spd) * maxSpd;
                }

                // Draw particle — glowing dot
                const pAlpha = theme === 'dark' ? p.alpha * 1.6 : p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
                grad.addColorStop(0, C.particle(p.hue) + (pAlpha * 1.2).toFixed(2) + ')');
                grad.addColorStop(1, C.particle(p.hue) + '0)');
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // ── Draw network connections ──
            ctx.save();
            for (let i = 0; i < particles.length; i++) {
                const pi = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const pj = particles[j];
                    const d = Math.hypot(pi.x - pj.x, pi.y - pj.y);
                    if (d < LINK_D) {
                        const a = (1 - d / LINK_D) * (theme === 'dark' ? 0.18 : 0.08);
                        ctx.beginPath();
                        ctx.strokeStyle = C.link + a.toFixed(3) + ')';
                        ctx.lineWidth = (1 - d / LINK_D) * 1.2;
                        ctx.moveTo(pi.x, pi.y);
                        ctx.lineTo(pj.x, pj.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();

            // ── Mouse trail glow ──
            if (mouseActive && mx > 0) {
                const mgr = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
                mgr.addColorStop(0,   C.mouse + (theme === 'dark' ? '0.06' : '0.04') + ')');
                mgr.addColorStop(0.5, C.mouse + (theme === 'dark' ? '0.02' : '0.01') + ')');
                mgr.addColorStop(1,   C.mouse + '0)');
                ctx.beginPath();
                ctx.arc(mx, my, 120, 0, Math.PI * 2);
                ctx.fillStyle = mgr;
                ctx.fill();
            }
        }

        animate();

        } // End of particle system block (if !prefersReduced)

        // ═══════════════════════════════════════════════
        // 4. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
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
                el.style.transition = 'opacity 0.5s ease, transform 0.5s var(--ease-spring)';
                cardObserver.observe(el);
            });
        }

        // ═══════════════════════════════════════════════
        // 5. RIPPLE EFFECT ON BUTTONS
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
        // 6. NAVBAR SCROLL DYNAMICS
        // ═══════════════════════════════════════════════
        const navbar = document.querySelector('.navbar, .glass-nav');
        if (navbar) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                if (scrollY > 20) {
                    navbar.style.boxShadow = '0 4px 40px rgba(99, 102, 241, 0.1), 0 1px 0 rgba(255,255,255,0.5)';
                } else {
                    navbar.style.boxShadow = '';
                }
                lastScroll = scrollY;
            }, { passive: true });
        }

        // ═══════════════════════════════════════════════
        // 7. GLITCH EFFECT ON LOGO (Subtle)
        // ═══════════════════════════════════════════════
        const logo = document.querySelector('.logo');
        if (logo && !isMobile) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transition = 'transform 0.1s ease';
                const glitch = () => {
                    const offX = (Math.random() - 0.5) * 3;
                    const offY = (Math.random() - 0.5) * 2;
                    logo.style.transform = `translate(${offX}px, ${offY}px)`;
                };
                let count = 0;
                const interval = setInterval(() => {
                    glitch();
                    count++;
                    if (count > 5) {
                        clearInterval(interval);
                        logo.style.transform = '';
                    }
                }, 50);
            });
        }

    }); // end DOMContentLoaded

})();
