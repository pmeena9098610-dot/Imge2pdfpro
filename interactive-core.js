// PhotoSePDF.in — Shared 3D Quantum Glass & Interactive Background System
// 100% Client-side client interactivity

window.addEventListener('DOMContentLoaded', () => {
    // === 1. Dynamic Mouse-Tracking 3D perspective Tilt & Spotlight Glow ===
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.card-3d');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                // Check distance to center of card to prevent excessive computation
                const xc = rect.left + rect.width / 2;
                const yc = rect.top + rect.height / 2;
                const dist = Math.hypot(e.clientX - xc, e.clientY - yc);
                
                if (dist < 400) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dx = x - rect.width / 2;
                    const dy = y - rect.height / 2;
                    
                    // Max rotation of 7 degrees for natural feel
                    const rx = -(dy / (rect.height / 2)) * 7;
                    const ry = (dx / (rect.width / 2)) * 7;
                    
                    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-8px)`;
                    
                    // Update mouse position CSS variables for custom spotlight gradient reflections
                    card.style.setProperty('--mouse-x', `${(x / rect.width * 100).toFixed(2)}%`);
                    card.style.setProperty('--mouse-y', `${(y / rect.height * 100).toFixed(2)}%`);
                    
                    // Layered parallax offsets for child components
                    const icon = card.querySelector('.float-depth-icon');
                    const text = card.querySelector('.float-depth-text');
                    if (icon) {
                        icon.style.transform = `translateZ(45px) rotateX(${(rx * 0.5).toFixed(2)}deg) rotateY(${(ry * 0.5).toFixed(2)}deg) scale(0.95)`;
                    }
                    if (text) {
                        text.style.transform = `translateZ(25px)`;
                    }
                } else {
                    resetCardTransform(card);
                }
            });
        });

        // Reset transforms when mouse leaves document entirely
        document.addEventListener('mouseleave', () => {
            document.querySelectorAll('.card-3d').forEach(resetCardTransform);
        });
    }

    function resetCardTransform(card) {
        card.style.transform = '';
        const icon = card.querySelector('.float-depth-icon');
        const text = card.querySelector('.float-depth-text');
        if (icon) icon.style.transform = '';
        if (text) text.style.transform = '';
    }

    // === 2. Interactive Background Galaxy Network ===
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const maxParticles = isMobile ? 25 : 55;
    const particleCount = Math.min(maxParticles, Math.floor((w * h) / 32000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2 + 1
        });
    }
    
    let mx = null, my = null;
    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mx = null;
        my = null;
    });
    
    function animate() {
        ctx.clearRect(0, 0, w, h);
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Boundary checks
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            
            // Mouse gravity attraction
            if (mx !== null && my !== null) {
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 180) {
                    p.x += (dx / dist) * 0.12;
                    p.y += (dy / dist) * 0.12;
                }
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = theme === 'dark' ? 'rgba(129, 140, 248, 0.22)' : 'rgba(99, 102, 241, 0.08)';
            ctx.fill();
        });
        
        // Render network connections
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                const limit = isMobile ? 95 : 120;
                if (dist < limit) {
                    const alpha = (1 - dist / limit) * (theme === 'dark' ? 0.12 : 0.05);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                }
            }
        }
        ctx.stroke();
        
        requestAnimationFrame(animate);
    }
    animate();
});
