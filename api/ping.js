const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = async function handler(req, res) {
    try {
        let sitemapContent = '';
        const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
        
        if (fs.existsSync(sitemapPath)) {
            sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
        } else {
            // Fallback: Fetch from the live domain
            sitemapContent = await new Promise((resolve, reject) => {
                https.get('https://www.photosepdf.in/sitemap.xml', (response) => {
                    let body = '';
                    response.on('data', (chunk) => { body += chunk; });
                    response.on('end', () => resolve(body));
                }).on('error', (e) => reject(e));
            });
        }

        // Extract <loc> URLs
        const urls = [];
        const locRegex = /<loc>(https:\/\/www\.photosepdf\.in[^<]*)<\/loc>/g;
        let match;
        while ((match = locRegex.exec(sitemapContent)) !== null) {
            urls.push(match[1].trim());
        }

        if (urls.length === 0) {
            return res.status(400).json({ success: false, error: 'No URLs parsed from sitemap.xml' });
        }

        const host = "www.photosepdf.in";
        const key = "a9f3b2e1d4c7f8a2b5e3d6c9f1a4b7e2";

        const payload = {
            host: host,
            key: key,
            keyLocation: `https://${host}/${key}.txt`,
            urlList: urls
        };

        const postData = JSON.stringify(payload);
        const endpoints = [
            'api.indexnow.org',
            'www.bing.com'
        ];

        const pingPromises = [];

        // Ping IndexNow APIs
        for (const endpoint of endpoints) {
            pingPromises.push(new Promise((resolve) => {
                const options = {
                    hostname: endpoint,
                    port: 443,
                    path: '/indexnow',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const request = https.request(options, (response) => {
                    resolve({ endpoint, status: response.statusCode });
                });

                request.on('error', (e) => {
                    resolve({ endpoint, error: e.message });
                });

                request.write(postData);
                request.end();
            }));
        }

        // Ping Google Sitemap
        pingPromises.push(new Promise((resolve) => {
            https.get(`https://www.google.com/ping?sitemap=https://${host}/sitemap.xml`, (response) => {
                resolve({ endpoint: 'google.com', status: response.statusCode });
            }).on('error', (e) => {
                resolve({ endpoint: 'google.com', error: e.message });
            });
        }));

        const results = await Promise.all(pingPromises);

        return res.status(200).json({
            success: true,
            urlsSubmitted: urls.length,
            results: results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
