(function() {
    // 1. Create and inject style tag
    const style = document.createElement('style');
    style.textContent = `
        .trending-section {
            margin: 30px 0;
            padding: 20px;
            background: rgba(108, 99, 255, 0.02);
            border: 1px dashed rgba(108, 99, 255, 0.15);
            border-radius: 16px;
            font-family: inherit;
            animation: fadeIn 0.8s ease-out;
        }
        [data-theme="dark"] .trending-section {
            background: rgba(108, 99, 255, 0.04);
            border-color: rgba(108, 99, 255, 0.2);
        }
        .trending-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .trending-title-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .trending-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--dark, #1A1A2E);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        [data-theme="dark"] .trending-title {
            color: #F7F7FF;
        }
        .trending-dot {
            width: 8px;
            height: 8px;
            background: var(--secondary, #00C896);
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px var(--secondary, #00C896);
            animation: trending-pulse 1.8s infinite ease-in-out;
        }
        .trending-subtitle {
            font-size: 0.8rem;
            color: var(--text-muted, #718096);
            margin: 0;
        }
        .trending-badge-live {
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: linear-gradient(135deg, var(--primary, #6C63FF), var(--pink, #EC4899));
            color: white;
            padding: 3px 8px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(108, 99, 255, 0.2);
        }
        .trending-list {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding: 6px 2px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
        }
        .trending-list::-webkit-scrollbar {
            display: none;
        }
        .trending-card {
            flex: 0 0 250px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: var(--bg-card, #FFFFFF);
            border: 1.5px solid var(--border, #E2E8F0);
            border-radius: 12px;
            text-decoration: none;
            color: var(--text-main, #2D3748);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
        }
        [data-theme="dark"] .trending-card {
            background: #1E1E2F;
            border-color: #2D2D44;
            color: #E2E8F0;
        }
        .trending-card:hover {
            transform: translateY(-3px);
            border-color: var(--primary, #6C63FF);
            box-shadow: 0 8px 20px rgba(108, 99, 255, 0.12);
        }
        [data-theme="dark"] .trending-card:hover {
            box-shadow: 0 8px 20px rgba(108, 99, 255, 0.2);
        }
        .trending-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: linear-gradient(to bottom, var(--primary, #6C63FF), var(--pink, #EC4899));
            opacity: 0.8;
        }
        .trending-icon-box {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(108, 99, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary, #6C63FF);
            font-size: 1.1rem;
            flex-shrink: 0;
            transition: transform 0.2s ease;
        }
        .trending-card:hover .trending-icon-box {
            transform: scale(1.1) rotate(-5deg);
            background: var(--primary, #6C63FF);
            color: white;
        }
        .trending-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            width: 100%;
        }
        .trending-card-title {
            font-weight: 600;
            font-size: 0.82rem;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .trending-card-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            font-size: 0.72rem;
        }
        .trending-card-traffic {
            color: var(--secondary, #00C896);
            font-weight: 600;
        }
        .trending-card-status {
            color: var(--text-muted, #718096);
            background: rgba(0,0,0,0.03);
            padding: 1px 5px;
            border-radius: 4px;
        }
        [data-theme="dark"] .trending-card-status {
            background: rgba(255,255,255,0.05);
            color: #A0AEC0;
        }

        @media (min-width: 768px) {
            .trending-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                overflow-x: visible;
                gap: 16px;
            }
            .trending-card {
                flex: none;
            }
        }

        @keyframes trending-pulse {
            0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(0, 200, 150, 0.4); }
            50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 0 6px rgba(0, 200, 150, 0); }
            100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(0, 200, 150, 0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Main initialization
    function init() {
        // Find injection container
        let container = document.getElementById('trending-container');
        if (!container) {
            // Find a target to insert after/before
            const features = document.getElementById('features') || document.querySelector('.features-section');
            if (features) {
                container = document.createElement('div');
                container.id = 'trending-container';
                features.parentNode.insertBefore(container, features);
            } else {
                const tool = document.getElementById('tool') || document.querySelector('.converter-section');
                if (tool) {
                    container = document.createElement('div');
                    container.id = 'trending-container';
                    tool.parentNode.insertBefore(container, tool.nextSibling);
                } else {
                    // Fallback to appending in body/main
                    const main = document.querySelector('main') || document.body;
                    container = document.createElement('div');
                    container.id = 'trending-container';
                    main.appendChild(container);
                }
            }
        }

        if (!container) return;

        // Fetch trending data
        fetch('/api/trending')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && data.trends) {
                    renderTrends(container, data.trends);
                }
            })
            .catch(err => {
                console.error("Failed to load trending items:", err);
            });
    }

    function renderTrends(container, trends) {
        if (!trends || trends.length === 0) return;

        let cardsHtml = '';
        trends.forEach(item => {
            // Clean up query text so it fits beautifully
            let queryClean = item.query
                .replace(item.toolName, '')
                .replace('Online Photo & Sign Resizer', '')
                .replace('Photo & Signature Resizer', '')
                .trim();
            
            if (!queryClean) queryClean = item.query;

            cardsHtml += `
                <a href="${item.url}" class="trending-card" aria-label="${item.query}">
                    <div class="trending-icon-box">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="trending-info">
                        <div class="trending-card-title">${item.toolName}</div>
                        <div class="trending-subtitle" style="font-size:0.7rem; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${queryClean}">
                            ${queryClean}
                        </div>
                        <div class="trending-card-meta">
                            <span class="trending-card-traffic">${item.traffic}</span>
                            <span class="trending-card-status">${item.status}</span>
                        </div>
                    </div>
                </a>
            `;
        });

        container.innerHTML = `
            <section class="trending-section" aria-label="Live Search Trends India">
                <div class="trending-header">
                    <div class="trending-title-wrap">
                        <span class="trending-dot"></span>
                        <h3 class="trending-title">⚡ Trending India Exams & Resizers</h3>
                    </div>
                    <span class="trending-badge-live">Live Updates</span>
                </div>
                <div class="trending-list">
                    ${cardsHtml}
                </div>
            </section>
        `;
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
