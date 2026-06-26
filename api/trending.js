const https = require('https');

function decodeHtml(str) {
    if (!str) return '';
    return str.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&#039;/g, "'")
              .replace(/&apos;/g, "'");
}

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // High-conversion evergreen fallback list for exams and image resizing in India
    const fallbackTrends = [
        { query: "SSC MTS 2026 Photo & Signature Resizer", toolName: "SSC Photo Resizer", url: "/ssc-photo-resizer", icon: "fa-id-card", traffic: "200K+ queries", status: "Active Now" },
        { query: "NEET UG 2026 Postcard Photo Size", toolName: "NEET Photo Resizer", url: "/neet-photo-resizer", icon: "fa-user-md", traffic: "150K+ queries", status: "Trending" },
        { query: "UPSC Civil Services Application Photo Resize", toolName: "UPSC Photo Resizer", url: "/upsc-photo-resizer", icon: "fa-graduation-cap", traffic: "120K+ queries", status: "Popular" },
        { query: "Sarkari Result Image to PDF & Resizer Online", toolName: "Sarkari Result Tool", url: "/sarkari-result-photo-resizer", icon: "fa-square-poll-horizontal", traffic: "180K+ queries", status: "Active Now" },
        { query: "Aadhar Card Front & Back Join & PDF Maker", toolName: "Aadhar Merger", url: "/aadhar-card-front-back-merger", icon: "fa-address-card", traffic: "100K+ queries", status: "Most Used" },
        { query: "Passport Size Photo Maker Online (India Size)", toolName: "Passport Photo Maker", url: "/passport-photo-maker", icon: "fa-camera", traffic: "250K+ queries", status: "Trending #1" },
        { query: "Compress PDF under 100KB/200KB for Upload", toolName: "Compress PDF", url: "/compress-pdf", icon: "fa-file-pdf", traffic: "300K+ queries", status: "Popular" }
    ];

    // Tool mapping keywords for matching Google India search trends
    const toolMapping = [
        { keywords: ['ssc', 'cgl', 'mts', 'chsl', 'gd', 'cpo', 'stenographer', 'je'], name: 'SSC Photo Resizer', url: '/ssc-photo-resizer', icon: 'fa-id-card' },
        { keywords: ['neet', 'postcard size', 'nta neet'], name: 'NEET Photo Resizer', url: '/neet-photo-resizer', icon: 'fa-user-md' },
        { keywords: ['upsc', 'ias', 'ifs', 'nda', 'cds', 'civil services'], name: 'UPSC Photo Resizer', url: '/upsc-photo-resizer', icon: 'fa-graduation-cap' },
        { keywords: ['bpsc', 'bihar public service'], name: 'BPSC Photo & Signature Resizer', url: '/bpsc-photo-signature-resizer', icon: 'fa-file-signature' },
        { keywords: ['aadhar', 'adhaar', 'uidai', 'front back join'], name: 'Aadhar Card PDF Tools', url: '/aadhar-card-pdf-maker', icon: 'fa-address-card' },
        { keywords: ['passport', 'visa photo', '2x2 photo'], name: 'Passport Photo Maker', url: '/passport-photo-maker', icon: 'fa-camera' },
        { keywords: ['signature', 'sign resize', 'compress signature'], name: 'Signature Resizer', url: '/signature-resizer', icon: 'fa-signature' },
        { keywords: ['license', 'driving license', 'dl photo'], name: 'Driving License Resizer', url: '/driving-license-photo-resize', icon: 'fa-car' },
        { keywords: ['agniveer', 'army rally', 'indian navy', 'ssr', 'mr', 'airforce', 'iaf xy'], name: 'Defense Exams Resizer', url: '/army-agniveer-photo-resizer', icon: 'fa-shield-halved' },
        { keywords: ['railway', 'rrb', 'alp', 'ntpc', 'group d'], name: 'Railway Photo Resizer', url: '/rrb-railway-photo-signature-resizer', icon: 'fa-train' },
        { keywords: ['gate', 'gate exam', 'iit gate'], name: 'GATE Photo Resizer', url: '/gate-photo-resizer', icon: 'fa-door-open' },
        { keywords: ['jee', 'iit jee', 'jee main', 'jee advanced'], name: 'JEE Photo Resizer', url: '/jee-photo-resizer', icon: 'fa-pen-clip' },
        { keywords: ['ibps', 'sbi', 'bank po', 'bank clerk', 'rbi'], name: 'Bank Exams Resizer', url: '/ibps-photo-signature-resizer', icon: 'fa-building-columns' },
        { keywords: ['ctet', 'teacher eligibility'], name: 'CTET Photo Resizer', url: '/ctet-photo-resizer', icon: 'fa-chalkboard-user' },
        { keywords: ['cuet', 'cuet ug', 'cuet pg'], name: 'CUET Photo Resizer', url: '/cuet-photo-resizer', icon: 'fa-book-open' },
        { keywords: ['sarkari', 'sarkari result', 'sarkari exam'], name: 'Sarkari Result Resizer', url: '/sarkari-result-photo-resizer', icon: 'fa-square-poll-horizontal' },
        { keywords: ['scholarship', 'up scholarship', 'nsp'], name: 'Scholarship Photo Resizer', url: '/up-scholarship-photo-resizer', icon: 'fa-award' },
        { keywords: ['pdf', 'compress', 'merge', 'split', 'watermark', 'unlock'], name: 'PDF Compress & Merge', url: '/compress-pdf', icon: 'fa-file-pdf' }
    ];

    try {
        // Set Cache-Control header: Cache in browser for 1 hour, Edge CDN cache for 2 hours, and allow stale-while-revalidate background update
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400');

        // Fetch RSS feed from Google Trends daily searches for India (geo=IN)
        const feedUrl = 'https://trends.google.com/trending/rss?geo=IN';
        
        const xml = await new Promise((resolve, reject) => {
            const reqGet = https.get(feedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }, (response) => {
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(new Error(`Failed to fetch trends: HTTP ${response.statusCode}`));
                    return;
                }
                let body = '';
                response.on('data', (chunk) => { body += chunk; });
                response.on('end', () => resolve(body));
            });
            reqGet.on('error', (e) => reject(e));
            reqGet.setTimeout(8000, () => {
                reqGet.destroy();
                reject(new Error('Request Timeout fetching Google Trends'));
            });
        });

        // Parse XML using standard regex (dependency-free)
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const trendMatches = [];
        let match;

        while ((match = itemRegex.exec(xml)) !== null) {
            const itemContent = match[1];
            const titleMatch = itemContent.match(/<title>([^<]+)<\/title>/);
            const trafficMatch = itemContent.match(/<(?:[a-zA-Z0-9_-]+:)?approx_traffic>([^<]+)<\/(?:[a-zA-Z0-9_-]+:)?approx_traffic>/);
            
            if (titleMatch) {
                const query = decodeHtml(titleMatch[1].trim());
                const traffic = trafficMatch ? decodeHtml(trafficMatch[1].trim()) : '10K+';
                trendMatches.push({ query, traffic });
            }
        }

        // Map live trend queries to our tools
        const liveTrends = [];
        const seenTools = new Set();

        for (const trend of trendMatches) {
            const queryLower = trend.query.toLowerCase();
            
            // Check if trend query matches any tool
            for (const tool of toolMapping) {
                // Skip if we already mapped this tool in our dynamic list (to avoid duplicates)
                if (seenTools.has(tool.name)) continue;

                const hasKeyword = tool.keywords.some(keyword => queryLower.includes(keyword));
                if (hasKeyword) {
                    seenTools.add(tool.name);
                    
                    // Format the trending query nicely for user engagement (e.g. Title case search query + Tool Name)
                    let queryTitle = trend.query;
                    if (!queryTitle.toLowerCase().includes('photo') && !queryTitle.toLowerCase().includes('resizer') && !queryTitle.toLowerCase().includes('pdf')) {
                        queryTitle = `${queryTitle} Online Photo & Sign Resizer`;
                    }

                    liveTrends.push({
                        query: queryTitle,
                        toolName: tool.name,
                        url: `${tool.url}?ref=trend_${encodeURIComponent(trend.query.replace(/\s+/g, '_').toLowerCase())}`,
                        icon: tool.icon,
                        traffic: `${trend.traffic} queries today`,
                        status: 'Live Trend'
                    });
                    
                    // Stop checking other tools for this query
                    break;
                }
            }
        }

        // Combine live trends and fallback trends
        // We want a list of 6-8 premium items. If liveTrends has fewer than 6 items, we fill the rest using fallbackTrends.
        let finalTrends = [...liveTrends];
        for (const fb of fallbackTrends) {
            if (finalTrends.length >= 7) break;
            // Avoid adding fallback if the same tool is already present in finalTrends
            const isToolUsed = finalTrends.some(t => t.toolName === fb.toolName);
            if (!isToolUsed) {
                finalTrends.push(fb);
            }
        }

        // Return JSON response
        return res.status(200).json({
            success: true,
            source: liveTrends.length > 0 ? 'google_trends_live' : 'evergreen_fallbacks',
            trendsCount: finalTrends.length,
            trends: finalTrends
        });

    } catch (error) {
        console.error("Error in trending API handler:", error);
        // Clean error handler: fallback gracefully to static list so website never throws an error
        return res.status(200).json({
            success: true,
            source: 'evergreen_fallbacks_error_catch',
            trendsCount: fallbackTrends.length,
            trends: fallbackTrends,
            debugError: error.message
        });
    }
};
