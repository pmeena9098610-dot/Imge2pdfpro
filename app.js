document.addEventListener('DOMContentLoaded', () => {
    // Service Worker - Smart Update Engine (No Double Refresh)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered:', registration.scope);
                })
                .catch(err => console.log('SW registration failed:', err));
        });

        // Single reload only when new SW takes over control
        // This fires ONCE after skipWaiting() in sw.js activates the new worker
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }

    // --- Professional Tab System ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Toggle Buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle Content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) content.classList.add('active');
            });

            // Highlight the corresponding choice card
            if (tabId === 'print-tab') {
                if(document.getElementById('print-choice-card')) document.getElementById('print-choice-card').style.transform = 'scale(1.05)';
                if(document.getElementById('pdf-choice-card')) document.getElementById('pdf-choice-card').style.transform = 'scale(1)';
                if(document.getElementById('resize-choice-card')) document.getElementById('resize-choice-card').style.transform = 'scale(1)';
            } else if (tabId === 'resize-tab') {
                if(document.getElementById('resize-choice-card')) document.getElementById('resize-choice-card').style.transform = 'scale(1.05)';
                if(document.getElementById('pdf-choice-card')) document.getElementById('pdf-choice-card').style.transform = 'scale(1)';
                if(document.getElementById('print-choice-card')) document.getElementById('print-choice-card').style.transform = 'scale(1)';
            } else {
                if(document.getElementById('pdf-choice-card')) document.getElementById('pdf-choice-card').style.transform = 'scale(1.05)';
                if(document.getElementById('print-choice-card')) document.getElementById('print-choice-card').style.transform = 'scale(1)';
                if(document.getElementById('resize-choice-card')) document.getElementById('resize-choice-card').style.transform = 'scale(1)';
            }
        });
    });

    // --- Version Management (Zero Refresh Issue) ---
    const APP_VERSION = '5.0.0'; // Professional Version
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.setItem('app_version', APP_VERSION);
        if ('serviceWorker' in navigator) {
            caches.keys().then(names => {
                for (let name of names) caches.delete(name);
            });
            console.log("Professional Update Applied. Refreshing...");
        }
    }

    // PWA Install Prompt Logic (Phase 6.1 Ultra Growth)
    let deferredPrompt;
    const installBanner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67+ from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Check if user already dismissed it recently
        if(localStorage.getItem('pwa_dismissed') !== 'true') {
            installBanner.style.display = 'flex';
        }
    });

    if(installBtn) {
        installBtn.addEventListener('click', async () => {
            installBanner.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                }
                deferredPrompt = null;
            }
        });
    }

    if(dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            installBanner.style.display = 'none';
            localStorage.setItem('pwa_dismissed', 'true');
        });
    }

    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggleIcon) toggleIcon.className = 'fa-solid fa-sun';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                toggleIcon.className = 'fa-solid fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleIcon.className = 'fa-solid fa-sun';
            }
        });
    }

    // Scroll Animations Observer
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                navObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    setTimeout(() => {
        document.querySelectorAll('.fade-up').forEach(el => navObserver.observe(el));
    }, 100);

    // DOM Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const controlsPanel = document.getElementById('controls-panel');
    const imageList = document.getElementById('image-list');
    const imageCount = document.getElementById('image-count');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const generateBtn = document.getElementById('generate-btn');
    const marginSelect = document.getElementById('margin-select');
    const sizeSelect = document.getElementById('size-select');
    const layoutSelect = document.getElementById('layout-select');
    const pageSizeSelect = document.getElementById('page-size');
    const orientationSelect = document.getElementById('orientation');
    const fileNameInput = document.getElementById('file-name');
    const loadingOverlay = document.getElementById('loading-overlay');
    const printBtn = document.getElementById('print-btn');

    // State
    let files = [];
    let sortableInstance = null;

    // ----- Event Listeners -----

    // Browse button click triggers file input
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Make the entire dropzone box clickable
    dropzone.addEventListener('click', (e) => {
        // Prevent clicking twice if they specifically hit the browse button
        if (e.target !== browseBtn && e.target !== fileInput) {
            fileInput.click();
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset for same file selection
    });

    // Dropzone drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false);
    });

    // Drop event
    dropzone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    });

    // Clear All
    clearAllBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Clear all images?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'Yes, clear it!',
            background: 'rgba(255, 255, 255, 0.95)',
            backdrop: 'rgba(15, 23, 42, 0.4)'
        }).then((result) => {
            if (result.isConfirmed) {
                clearAll();
            }
        });
    });

        const printLayoutSelect = document.getElementById('print-layout-mode');
    const copiesCountGroup = document.getElementById('copies-count-group');
    if (printLayoutSelect && copiesCountGroup) {
        printLayoutSelect.addEventListener('change', () => {
            if (printLayoutSelect.value === 'custom-copies') {
                copiesCountGroup.style.display = 'block';
            } else {
                copiesCountGroup.style.display = 'none';
            }
        });
    }

    // Toggle custom print dimensions
    const printSizeSelect = document.getElementById('print-size');
    const customPrintDims = document.getElementById('custom-print-dims');
    if (printSizeSelect && customPrintDims) {
        printSizeSelect.addEventListener('change', () => {
            if (printSizeSelect.value === 'custom') {
                customPrintDims.classList.remove('hidden');
            } else {
                customPrintDims.classList.add('hidden');
            }
        });
    }

    // --- Bulk Filter Buttons ---
    const bulkLightenBtn = document.getElementById('bulk-lighten');
    const bulkContrastBtn = document.getElementById('bulk-contrast');
    if (bulkLightenBtn) {
        bulkLightenBtn.addEventListener('click', () => {
            files.forEach(f => {
                if (!f.filters) f.filters = { brightness: 100, contrast: 100 };
                f.filters.brightness = Math.min(200, (f.filters.brightness || 100) + 20);
                const brEl = document.getElementById('val-br-' + f.id);
                const brSlider = document.querySelector('[oninput*="' + f.id + '"][oninput*="brightness"]');
                if (brEl) brEl.innerText = f.filters.brightness + '%';
                if (brSlider) brSlider.value = f.filters.brightness;
            });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'All photos lightened!', showConfirmButton: false, timer: 1200 });
        });
    }
    if (bulkContrastBtn) {
        bulkContrastBtn.addEventListener('click', () => {
            files.forEach(f => {
                if (!f.filters) f.filters = { brightness: 100, contrast: 100 };
                f.filters.contrast = Math.min(200, (f.filters.contrast || 100) + 20);
                const ctEl = document.getElementById('val-ct-' + f.id);
                const ctSlider = document.querySelector('[oninput*="' + f.id + '"][oninput*="contrast"]');
                if (ctEl) ctEl.innerText = f.filters.contrast + '%';
                if (ctSlider) ctSlider.value = f.filters.contrast;
            });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Contrast boosted for all!', showConfirmButton: false, timer: 1200 });
        });
    }
    // Keyboard Shortcuts (Ctrl+G = Generate PDF, Ctrl+Shift+P = Print)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            generatePDF();
        }
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            printPhotos();
        }
    });

    // Share Button Native API fallback
    const shareBtn = document.getElementById('share-website-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Img2PDF Pro - Free Image to PDF Converter',
                text: 'I just used this amazing, 100% free and secure offline Image to PDF converter!',
                url: window.location.href
            };
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(shareData.url);
                    Swal.fire({
                        title: 'Copied!',
                        text: 'Website link copied to clipboard.',
                        icon: 'success',
                        background: 'rgba(255, 255, 255, 0.95)',
                        confirmButtonColor: '#6366F1'
                    });
                }
            } catch (err) {
                console.warn('Share failed:', err);
            }
        });
    }

    // ----- Functions -----

    // --- Phase 10: Apple Native Interception Engine ---
    async function loadHeicDecoder() {
        return new Promise((resolve, reject) => {
            if (typeof heic2any !== "undefined") return resolve();
            let s = document.createElement('script');
            s.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function handleFiles(selectedFiles) {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif', 'image/bmp'];
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB crash prevention limit

        let rejectedCount = 0;
        let addedCount = 0;

        for (let file of Array.from(selectedFiles)) {
            if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|gif|bmp|svg|tif|tiff|avif|ico)$/i)) {
                rejectedCount++;
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                Swal.fire('File Too Large', `The file ${file.name} exceeds the 50MB safety limit.`, 'error');
                continue;
            }

            let processBlob = file;
            
            // Ultra-Pro Action: Native Apple HEIC Decryption
            if (file.type === 'image/heic' || file.name.match(/\.heic$/i)) {
                showLoading();
                const loadTxt = document.getElementById('loading-text');
                if(loadTxt) loadTxt.innerText = "Decoding Apple HEIC Engine...";
                
                try {
                    await loadHeicDecoder();
                    const conversionResult = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
                    processBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                    // Preserve original name but change extension
                    processBlob.name = file.name.replace(/\.heic$/i, ".jpg");
                } catch (err) {
                    console.error("HEIC Decode Failed", err);
                    Swal.fire('Apple Engine Error', 'Failed to decode HEIC format locally.', 'error');
                }
                hideProgress();
            }

            // Standard Processing Pipeline
            const fileObj = {
                id: 'img_' + Math.random().toString(36).substr(2, 9),
                file: processBlob,
                dataUrl: null
            };
            
            const reader = new FileReader();
            reader.onload = (e) => {
                fileObj.dataUrl = e.target.result;
                renderImageItem(fileObj);
                updateUI();
            };
            reader.readAsDataURL(processBlob);
            
            files.push(fileObj);
            addedCount++;

            // Auto-set filename if it's the first file (No. 1 Convenience)
            if (files.length === 1) {
                const fileNameInput = document.getElementById('file-name');
                if (fileNameInput) {
                    const cleanName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_');
                    fileNameInput.value = `Img2PDF_${cleanName}`;
                }
            }
        }

        if (rejectedCount > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Some files were skipped',
                text: `${rejectedCount} file(s) are not supported images.`,
                background: 'rgba(255, 255, 255, 0.95)'
            });
        }
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function renderImageItem(fileObj) {
        const li = document.createElement('li');
        li.className = 'image-item premium-card';
        li.dataset.id = fileObj.id;

        // Default filters
        if (!fileObj.filters) {
            fileObj.filters = { brightness: 100, contrast: 100, rotation: 0 };
        }
        if (typeof fileObj.filters.rotation === 'undefined') {
            fileObj.filters.rotation = 0;
        }

        li.innerHTML = `
            <div class="image-item-main">
                <div class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></div>
                <div style="width: 42px; height: 42px; overflow: hidden; border-radius: 8px; border: 1px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--bg-soft);">
                    <img src="${fileObj.dataUrl}" id="thumb-${fileObj.id}" style="max-width: 100%; max-height: 100%; object-fit: contain; transform: rotate(${fileObj.filters.rotation}deg); transition: transform 0.2s ease;" alt="${fileObj.file.name}">
                </div>
                <div class="file-info">
                    <span class="file-name">${fileObj.file.name}</span>
                    <span class="file-size">${formatBytes(fileObj.file.size)}</span>
                </div>
                <button class="remove-btn" onclick="removeImage('${fileObj.id}')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="photo-editor-controls">
                <div class="editor-control-group">
                    <label>Brightness: <span id="val-br-${fileObj.id}">${fileObj.filters.brightness}%</span></label>
                    <input type="range" class="editor-slider" value="${fileObj.filters.brightness}" min="50" max="200" 
                        oninput="updateFilter('${fileObj.id}', 'brightness', this.value)">
                </div>
                <div class="editor-control-group">
                    <label>Contrast: <span id="val-ct-${fileObj.id}">${fileObj.filters.contrast}%</span></label>
                    <input type="range" class="editor-slider" value="${fileObj.filters.contrast}" min="50" max="200" 
                        oninput="updateFilter('${fileObj.id}', 'contrast', this.value)">
                </div>
                <div class="editor-control-group" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <label>Rotation: <span id="val-rt-${fileObj.id}">${fileObj.filters.rotation}°</span></label>
                    <button class="btn btn-outline btn-xs" style="padding: 4px 10px; font-size: 0.75rem; background: var(--primary-light); border: 1px solid rgba(108,99,255,0.2); border-radius: 6px; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="rotateImage('${fileObj.id}')">
                        <i class="fa-solid fa-rotate-right"></i> Rotate 90°
                    </button>
                </div>
            </div>
        `;

        imageList.appendChild(li);
    }

    window.rotateImage = (id) => {
        const file = files.find(f => f.id === id);
        if (file) {
            if (typeof file.filters.rotation === 'undefined') {
                file.filters.rotation = 0;
            }
            file.filters.rotation = (file.filters.rotation + 90) % 360;
            
            // Update the display text
            const textEl = document.getElementById(`val-rt-${id}`);
            if (textEl) textEl.innerText = file.filters.rotation + '°';
            
            // Update the thumbnail transform style
            const thumbEl = document.getElementById(`thumb-${id}`);
            if (thumbEl) {
                thumbEl.style.transform = `rotate(${file.filters.rotation}deg)`;
            }
        }
    };

    window.updateFilter = (id, type, val) => {
        const file = files.find(f => f.id === id);
        if (file) {
            file.filters[type] = val;
            document.getElementById(`val-${type === 'brightness' ? 'br' : 'ct'}-${id}`).innerText = val + '%';
        }
    };

    // Make removeImage global for inline onclick
    window.removeImage = (id) => {
        files = files.filter(f => f.id !== id);
        const item = document.querySelector(`.image-item[data-id="${id}"]`);
        if (item) item.remove();
        updateUI();
    };

    function clearAll() {
        files = [];
        imageList.innerHTML = '';
        updateUI();
    }

    function updateUI() {
        imageCount.textContent = files.length;
        const imageListCard = document.querySelector('.image-list-card');
        
        if (files.length > 0) {
            // Show image list card when images are present
            if (imageListCard) imageListCard.classList.remove('hidden');

            // Initialize or update Sortable
            if (!sortableInstance) {
                sortableInstance = new Sortable(imageList, {
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onEnd: (evt) => {
                        // Update internal array based on new DOM order
                        const items = Array.from(imageList.querySelectorAll('.image-item'));
                        const newOrderIds = items.map(item => item.dataset.id);
                        
                        // Sort files array based on newOrderIds
                        files.sort((a, b) => {
                            return newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id);
                        });
                    }
                });
            }
        } else {
            // Hide image list card when no images
            if (imageListCard) imageListCard.classList.add('hidden');
        }
    }

    // Image compression utility
    function compressImage(img, targetQuality, colorMode = 'original', passName = '', passDate = '', filters = {brightness: 100, contrast: 100, rotation: 0}) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const rotation = filters.rotation || 0;
            
            // Scaling logic for compression
            if (targetQuality === 'super' || targetQuality === 'extreme') {
                const MAX_DIM = targetQuality === 'extreme' ? 800 : 1200;
                
                if (width > height) {
                    if (width > MAX_DIM) {
                        height *= MAX_DIM / width;
                        width = MAX_DIM;
                    }
                } else {
                    if (height > MAX_DIM) {
                        width *= MAX_DIM / height;
                        height = MAX_DIM;
                    }
                }
            }

            // Swap dimensions if rotated 90 or 270 degrees
            const is90or270 = (rotation / 90) % 2 !== 0;
            const canvasWidth = is90or270 ? height : width;
            const canvasHeight = is90or270 ? width : height;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            const ctx = canvas.getContext('2d');
            
            // Fill white background for transparent PNGs
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Apply Studio Filters (Brightness/Contrast)
            ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%)`;
            
            // Draw image with rotation
            ctx.save();
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
            
            ctx.filter = 'none'; // Reset

            // Phase 11: Apply B&W Photocopy Filter
            if (colorMode === 'bw') {
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    // Grayscale standard luminosity method
                    const avg = data[i] * 0.3 + data[i+1] * 0.59 + data[i+2] * 0.11;
                    data[i] = avg;     // R
                    data[i+1] = avg;   // G
                    data[i+2] = avg;   // B
                }
                ctx.putImageData(imgData, 0, 0);
            }
            
            // Phase 13: Passport Name and Date Stamp
            if (passName || passDate) {
                // Determine strip height (approx 15% of image height, max 80px)
                const stripHeight = Math.min(height * 0.15, 80);
                
                // Draw white background block at the bottom
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, height - stripHeight, width, stripHeight);
                
                // Draw black border line at the top of the white block
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, height - stripHeight, width, Math.max(1, height*0.005));
                
                // Configure Text
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Calculate font size (dynamically scale to fit)
                const fontSize = Math.min(stripHeight * 0.35, width * 0.08);
                ctx.font = `bold ${fontSize}px sans-serif`;
                
                // If both exist, stack them. If one exists, center it.
                if (passName && passDate) {
                    ctx.fillText(passName, width / 2, height - stripHeight + (stripHeight * 0.35));
                    ctx.fillText(passDate, width / 2, height - stripHeight + (stripHeight * 0.75));
                } else if (passName) {
                    ctx.fillText(passName, width / 2, height - stripHeight / 2);
                } else if (passDate) {
                    ctx.fillText(passDate, width / 2, height - stripHeight / 2);
                }
            }
            
            let quality = 0.9; // Default 'high'
            if (targetQuality === 'medium') quality = 0.6;
            if (targetQuality === 'super') quality = 0.3; // High compression for 100-200kb
            if (targetQuality === 'extreme') quality = 0.15; // Very high compression for 50-100kb
            
            // Always return JPEG for PDF to keep it smaller
            resolve(canvas.toDataURL('image/jpeg', quality));
        });
    }

    function loadImageFromDataUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    function showProgress(text = 'Processing...') {
        const overlay = document.getElementById('global-progress');
        const statusText = document.getElementById('progress-status-text');
        const fill = document.getElementById('progress-bar-fill');
        if (overlay) overlay.classList.remove('hidden');
        if (statusText) statusText.innerText = text;
        if (fill) fill.style.width = '0%';
    }

    function updateProgress(percent, text) {
        const fill = document.getElementById('progress-bar-fill');
        const statusText = document.getElementById('progress-status-text');
        if (fill) fill.style.width = `${percent}%`;
        if (statusText && text) statusText.innerText = text;
    }

    function hideProgress() {
        const overlay = document.getElementById('global-progress');
        if (overlay) overlay.classList.add('hidden');
    }

    async function generatePDF() {
        if (files.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No Images Selected', text: 'Please select photos first!', background: 'rgba(255,255,255,0.9)' });
            return;
        }
        
        showProgress('Initializing Studio Engine...');

        try {
            // Get settings
            const margin = parseInt(marginSelect.value);
            const qualitySetting = sizeSelect.value;
            const layoutMode = parseInt(layoutSelect.value); 
            const pageSizePref = pageSizeSelect.value;
            const orientationPref = orientationSelect.value;
            
            // Phase 11: Get Pro Settings if available
            const colorModeEl = document.getElementById('color-mode');
            const colorModePref = colorModeEl ? colorModeEl.value : 'original';
            const imageFitEl = document.getElementById('image-fit');
            const imageFitPref = imageFitEl ? imageFitEl.value : 'preserve';
            
            // Phase 13: Passport Stamp Engine UI grab
            const passportNameEl = document.getElementById('passport-name');
            const passportName = passportNameEl ? passportNameEl.value.trim() : '';
            const passportDateEl = document.getElementById('passport-date');
            const passportDate = passportDateEl ? passportDateEl.value.trim() : '';
            const passportCopiesEl = document.getElementById('passport-copies');
            const customCopies = passportCopiesEl && passportCopiesEl.value ? parseInt(passportCopiesEl.value) : 0;

            // Sanitize filename to prevent XSS or OS path traversal leaps
            let customFileName = fileNameInput.value.trim() || 'Img2PDFPro_Document';
            customFileName = customFileName.replace(/[^a-zA-Z0-9_\-\s]/g, '');
            
            // Initialize jsPDF
            if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
                throw new Error('PDF Engine (jsPDF) failed to load. Please check your internet connection and try again.');
            }
            const { jsPDF } = window.jspdf;
            
            // Default sizes in px (approx 96dpi)
            let defaultWidth = 794;  // A4
            let defaultHeight = 1123; // A4
            
            if (pageSizePref === 'letter') {
                defaultWidth = 816;
                defaultHeight = 1056;
            }

            // Determine initial orientation for the document shell
            // If "fit", we'll just use portrait as a shell and add custom sizes per page
            let currentOrientation = 'p';
            if (orientationPref !== 'auto') {
                currentOrientation = orientationPref;
                // Swap shell dimensions if forced landscape
                if (currentOrientation === 'l') {
                    const temp = defaultWidth;
                    defaultWidth = defaultHeight;
                    defaultHeight = temp;
                }
            }

            const pdf = new jsPDF({
                orientation: currentOrientation,
                unit: 'px',
                format: pageSizePref === 'fit' ? 'a4' : [defaultWidth, defaultHeight] // Provide shell for 'fit' initially
            });

            let imagesProcessed = 0;
            let pageIndex = 0;

            for (let i = 0; i < files.length; i++) {
                // Yield main thread to unblock UI animations (Phase 7.1)
                await new Promise(resolve => setTimeout(resolve, 0));
                
                // Real-time progress feedback
                updateProgress(Math.round((i / files.length) * 100), `Studio Processing: Photo ${i + 1} of ${files.length}`);

                let imgElement;
                try {
                    imgElement = await loadImageFromDataUrl(files[i].dataUrl);
                } catch (e) {
                    console.error("Corrupt image skipped:", files[i].name);
                    continue; // Skip corrupt files
                }
                const compressedDataUrl = await compressImage(imgElement, qualitySetting, colorModePref, passportName, passportDate, files[i].filters);
                
                // --- Dynamic Layout Calculation ---
                let pdfWidth = defaultWidth;
                let pdfHeight = defaultHeight;
                let imgOrientation = currentOrientation;

                // 1. Calculate 'fit' orientation and page size per image
                if (pageSizePref === 'fit') {
                    // Match the precise image size + margins
                    pdfWidth = imgElement.width + (margin * 2);
                    pdfHeight = imgElement.height + (margin * 2);
                    imgOrientation = pdfWidth > pdfHeight ? 'l' : 'p';
                } else if (orientationPref === 'auto') {
                    // Auto-rotate the fixed page size to match the image
                    const imgIsLandscape = imgElement.width > imgElement.height;
                    const pageIsLandscape = defaultWidth > defaultHeight;
                    
                    if (imgIsLandscape !== pageIsLandscape) {
                         pdfWidth = defaultHeight;
                         pdfHeight = defaultWidth;
                         imgOrientation = pdfWidth > pdfHeight ? 'l' : 'p';
                    } else {
                        imgOrientation = currentOrientation;
                        pdfWidth = defaultWidth;
                        pdfHeight = defaultHeight;
                    }
                }
                
                const contentWidth = pdfWidth - (margin * 2);
                const contentHeight = pdfHeight - (margin * 2);
                let imgX, imgY, targetW, targetH;

                // Handle Fit mode override - always 1 per page
                let effectiveLayoutMode = layoutMode;
                if (pageSizePref === 'fit') {
                    effectiveLayoutMode = 1;
                }

                if (effectiveLayoutMode === 1) {
                    pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                    if (i === 0) pdf.deletePage(1); // Delete shell AFTER new page is added
                    const imgRatio = imgElement.width / imgElement.height;
                    const contentRatio = contentWidth / contentHeight;

                    if (imgRatio > contentRatio) {
                        targetW = contentWidth;
                        targetH = targetW / imgRatio;
                        imgX = margin;
                        imgY = margin + (contentHeight - targetH) / 2;
                    } else {
                        targetH = contentHeight;
                        targetW = targetH * imgRatio;
                        imgY = margin;
                        imgX = margin + (contentWidth - targetW) / 2;
                    }
                    
                    if (imageFitPref === 'stretch') {
                        targetW = contentWidth;
                        targetH = contentHeight;
                        imgX = margin;
                        imgY = margin;
                    }
                    
                    pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
                } 
                else if (effectiveLayoutMode === 2) {
                    const slotHeight = contentHeight / 2 - (margin/2);
                    const imgRatio = imgElement.width / imgElement.height;
                    const slotRatio = contentWidth / slotHeight;

                    if (imgRatio > slotRatio) {
                        targetW = contentWidth;
                        targetH = targetW / imgRatio;
                    } else {
                        targetH = slotHeight;
                        targetW = targetH * imgRatio;
                    }

                    const isEven = i % 2 === 0;
                    if (isEven) {
                        pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                        if (i === 0) pdf.deletePage(1); // Delete shell AFTER new page is added
                        pageIndex++;
                    }

                    imgX = margin + (contentWidth - targetW) / 2;
                    imgY = isEven ? margin + (slotHeight - targetH) / 2 : margin + slotHeight + margin + (slotHeight - targetH) / 2;

                    if (imageFitPref === 'stretch') {
                        targetW = contentWidth;
                        targetH = slotHeight;
                        imgX = margin;
                        imgY = isEven ? margin : margin + slotHeight + margin;
                    }

                    pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
                }
                else if (effectiveLayoutMode === 4) {
                    const slotWidth = contentWidth / 2 - (margin/2);
                    const slotHeight = contentHeight / 2 - (margin/2);
                    const imgRatio = imgElement.width / imgElement.height;
                    const slotRatio = slotWidth / slotHeight;

                    if (imgRatio > slotRatio) {
                        targetW = slotWidth;
                        targetH = targetW / imgRatio;
                    } else {
                        targetH = slotHeight;
                        targetW = targetH * imgRatio;
                    }

                    const indexOnPage = i % 4;
                    if (indexOnPage === 0) {
                        pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                        if (i === 0) pdf.deletePage(1); // Delete shell AFTER new page is added
                    }

                    const col = indexOnPage % 2;
                    const row = Math.floor(indexOnPage / 2);

                    imgX = margin + (col * (slotWidth + margin)) + (slotWidth - targetW) / 2;
                    imgY = margin + (row * (slotHeight + margin)) + (slotHeight - targetH) / 2;

                    if (imageFitPref === 'stretch') {
                        targetW = slotWidth;
                        targetH = slotHeight;
                        imgX = margin + (col * (slotWidth + margin));
                        imgY = margin + (row * (slotHeight + margin));
                    }

                    pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
                }
                else if (effectiveLayoutMode === 30 || effectiveLayoutMode === 8) {
                    // Studio Passport Maker Mode
                    const is30 = effectiveLayoutMode === 30;
                    const cols = is30 ? 5 : 4;
                    const rows = is30 ? 6 : 2;
                    let totalPhotos = cols * rows;

                    // Phase 13: Allow custom copy override
                    if (customCopies > 0) {
                        totalPhotos = customCopies;
                    }

                    // Standard Indian Passport Dimensions (approx 3.5cm x 4.5cm)
                    const passW = 132;
                    const passH = 170;
                    
                    // Fixed safe margins for cut-lines
                    const gapX = is30 ? 25 : 35;
                    const gapY = is30 ? 25 : 35;
                    
                    // Calculate starting offset to center the grid
                    const gridTotalW = (cols * passW) + ((cols - 1) * gapX);
                    const gridTotalH = (rows * passH) + ((rows - 1) * gapY);
                    
                    const startX = (pdfWidth - gridTotalW) / 2;
                    const startY = is30 ? (pdfHeight - gridTotalH) / 2 : 40; // Top-align for 8-pack

                    // Handle massive quantities across multiple pages
                    const photosPerPage = cols * rows;
                    let remainingPhotos = totalPhotos;

                    while (remainingPhotos > 0) {
                        pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                        // Delete shell only on the absolute first page
                        if (i === 0 && remainingPhotos === totalPhotos) pdf.deletePage(1); 
                        pageIndex++;

                        const photosOnThisPage = Math.min(remainingPhotos, photosPerPage);

                        for (let p = 0; p < photosOnThisPage; p++) {
                            const col = p % cols;
                            const row = Math.floor(p / cols);

                            const x = startX + (col * (passW + gapX));
                            const y = startY + (row * (passH + gapY));

                            // Always crop/stretch slightly to fill exactly 3.5x4.5cm without white bars
                            pdf.addImage(compressedDataUrl, 'JPEG', x, y, passW, passH);
                        }
                        remainingPhotos -= photosOnThisPage;
                    }
                }
            } // Close for loop

            // Master Encryption (Password Protection) Protocol
            const pdfPasswordEl = document.getElementById('pdf-password');
            if (pdfPasswordEl && pdfPasswordEl.value.trim() !== '') {
                const pass = pdfPasswordEl.value.trim();
                if (typeof pdf.setEncryption === 'function') {
                    pdf.setEncryption({
                        userPassword: pass,
                        ownerPassword: pass,
                        userPermissions: ["print", "copy"]
                    });
                } else {
                    // PDF will be generated without password — inform user after download
                    console.warn('PDF Encryption: jsPDF free CDN build does not include encryption. PDF generated without password.');
                    // Show a one-time notification after PDF saves
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'info',
                            title: 'Password Not Applied',
                            text: 'Your PDF was created, but password protection could not be applied. This feature requires a Pro build of jsPDF.',
                            confirmButtonColor: '#6366F1',
                            background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1E293B' : 'rgba(255, 255, 255, 0.95)',
                            color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#F1F5F9' : '#334155'
                        });
                    }, 2500);
                }
            }

            // Viral Document Metadata Injection (Phase 6.2)
            pdf.setProperties({
                title: `${customFileName}`,
                subject: 'Generated completely offline without cloud servers.',
                author: 'Img2PDF Pro',
                keywords: 'photosepdf.in, offline converter, privacy',
                creator: 'Img2PDF Pro (https://photosepdf.in)'
            });

            // Save and download with custom name
            pdf.save(`${customFileName}.pdf`);
            
            // Success Feedback
            updateProgress(100, 'Finalizing PDF...');
            pdf.save(`${customFileName}.pdf`);
            hideProgress();
            triggerConfetti();
            
            // Ultra-premium tactile haptic feedback for Mobile
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
            
            const shareMsg = encodeURIComponent("Bhai maine is website se apni photo ko PDF me banaya bina net use kiye! Sabse fast aur secure hai, ek baar try karo: https://photosepdf.in");
            const waUrl = `https://wa.me/?text=${shareMsg}`;

            Swal.fire({
                title: 'PDF Generated! &#x2705;',
                html: `
                    <p style="margin-bottom:20px; font-size:1.1rem;">Your newly created PDF has been saved securely to your device.</p>
                    <div style="background:rgba(37,211,102,0.1); padding:20px; border-radius:15px; border:2px dashed #25D366; margin-top:10px;">
                        <h4 style="margin-bottom:10px; color:#128C7E;">Love this free tool?</h4>
                        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:15px;">Help us keep it 100% free by sharing it with 1 friend!</p>
                        <a href="${waUrl}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; gap:10px; background-color:#25D366; color:white; padding:14px 28px; border-radius:30px; text-decoration:none; font-weight:bold; box-shadow:0 10px 20px -5px rgba(37,211,102,0.4); font-size:1.1rem; width:100%; transition:all 0.3s ease;">
                            <i class="fa-brands fa-whatsapp" style="font-size:1.4rem;"></i> Share on WhatsApp
                        </a>
                    </div>
                `,
                showConfirmButton: false,
                showCloseButton: true,
                background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1E293B' : 'rgba(255, 255, 255, 0.95)',
                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#F1F5F9' : '#334155',
                backdrop: 'rgba(15, 23, 42, 0.4)'
            });
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            hideProgress();
            Swal.fire({
                title: 'Oops...',
                text: 'An error occurred while generating the PDF.',
                icon: 'error',
                background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1E293B' : 'rgba(255, 255, 255, 0.95)',
                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#F1F5F9' : '#334155',
                confirmButtonColor: '#EF4444'
            });
        }
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    function showLoading() {
        loadingOverlay.classList.add('active');
        loadingOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const progressFill = document.getElementById('progress-bar-fill');
        if (progressFill) progressFill.style.width = '0%';
    }

    function hideLoading() {
        // Snap progress to 100% before hiding
        const progressFill = document.getElementById('progress-bar-fill');
        if (progressFill) progressFill.style.width = '100%';
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
            loadingOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (progressFill) progressFill.style.width = '0%';
        }, 350);
    }

    // ===== SMART PRINT STUDIO V3 - INLINE MODAL ENGINE =====
    window.studioProcessedImages = [];
    
    async function printPhotos() {
        if (files.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No Images', text: 'Select photos first!', background: 'rgba(255,255,255,0.9)' });
            return;
        }
        showProgress('Preparing Smart Print Studio...');
        try {
            // Pre-process all images for the studio
            const passName = document.getElementById('s-name') ? document.getElementById('s-name').value : '';
            const passDate = document.getElementById('s-date') ? document.getElementById('s-date').value : '';
            const colorMode = document.getElementById('s-color-mode') ? document.getElementById('s-color-mode').value : 'original';
            
            window.studioProcessedImages = [];
            for (let i = 0; i < files.length; i++) {
                const txt = document.getElementById('progress-status-text');
                if (txt) txt.innerText = `Processing Image ${i + 1} of ${files.length}...`;
                const img = await loadImageFromDataUrl(files[i].dataUrl);
                const compressed = await compressImage(img, 'high', colorMode, passName, passDate, files[i].filters || {brightness:100,contrast:100});
                window.studioProcessedImages.push(compressed);
            }
            hideProgress();
            // Show the inline modal
            const modal = document.getElementById('print-studio-modal');
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                studioUpdate();
            }
        } catch(e) {
            hideProgress();
            console.error('Studio error:', e);
            Swal.fire({ icon: 'error', title: 'Studio Error', text: e.message || 'Failed to open studio.' });
        }
    }

    window.closePrintStudio = function() {
        const modal = document.getElementById('print-studio-modal');
        if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
    };

    window.studioUpdate = function() {
        const sizeMap = {
            passport: { w: 35, h: 45, label: 'Passport (3.5x4.5cm)' },
            wallet:   { w: 25, h: 35, label: 'Wallet (2.5x3.5cm)' },
            stamp:    { w: 20, h: 25, label: 'Stamp (2.0x2.5cm)' },
            photo4r:  { w: 102, h: 152, label: '4R Photo' },
            photo5r:  { w: 127, h: 178, label: '5R Photo' },
            halfa4:   { w: 148, h: 105, label: 'Half A4' },
            fulla4:   { w: 190, h: 277, label: 'Full A4' }
        };

        const sizeVal = document.getElementById('s-print-size').value;
        const layoutVal = document.getElementById('s-layout').value;
        const gapMm = parseFloat(document.getElementById('s-gap').value) || 3;
        const cutmarks = document.getElementById('s-cutmarks').value;
        const border = document.getElementById('s-border').value;
        const nameVal = document.getElementById('s-name').value;
        const dateVal = document.getElementById('s-date').value;
        const copiesVal = parseInt(document.getElementById('s-copies').value) || 8;

        // Show/hide custom dims
        document.getElementById('s-custom-dims').style.display = sizeVal === 'custom' ? 'block' : 'none';
        document.getElementById('s-copies-group').style.display = layoutVal === 'copies' ? 'block' : 'none';

        let size;
        if (sizeVal === 'custom') {
            size = { w: parseFloat(document.getElementById('s-custom-w').value) || 35, h: parseFloat(document.getElementById('s-custom-h').value) || 45, label: 'Custom' };
        } else {
            size = sizeMap[sizeVal] || sizeMap.passport;
        }

        const usableW = 194; // 210 - 2*8mm
        const usableH = 281; // 297 - 2*8mm

        // Calculate grid
        const cols = Math.max(1, Math.floor((usableW + gapMm) / (size.w + gapMm)));
        const rows = Math.max(1, Math.floor((usableH + gapMm) / (size.h + gapMm)));
        const totalFit = cols * rows;
        
        let photosToRender = [];
        const imgs = window.studioProcessedImages || [];
        if (imgs.length === 0) return;

        if (layoutVal === 'fill') {
            const copiesPerImg = Math.max(1, Math.floor(totalFit / imgs.length));
            for (let src of imgs) {
                for (let c = 0; c < copiesPerImg; c++) photosToRender.push(src);
            }
            while (photosToRender.length < totalFit) photosToRender.push(imgs[0]);
        } else {
            for (let src of imgs) {
                for (let c = 0; c < copiesVal; c++) photosToRender.push(src);
            }
        }

        // Update info
        const infoEl = document.getElementById('studio-info');
        if (infoEl) infoEl.innerHTML = `<b style="color:#e2e8f0;">Size:</b> ${size.label}<br><b style="color:#e2e8f0;">Grid:</b> ${cols} cols x ${rows} rows = ${totalFit} slots<br><b style="color:#e2e8f0;">Photos:</b> ${photosToRender.length} on A4`;

        // Render the A4 preview
        const grid = document.getElementById('studio-photo-grid');
        if (!grid) return;
        grid.innerHTML = '';
        grid.style.gap = gapMm + 'mm';

        photosToRender.forEach(src => {
            const cell = document.createElement('div');
            cell.className = 'studio-photo-cell' + (cutmarks === 'on' ? ' with-marks' : '') + (border !== 'none' ? ' border-' + border : '');
            cell.style.width = size.w + 'mm';
            cell.style.height = size.h + 'mm';

            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Photo';
            cell.appendChild(img);

            if (nameVal || dateVal) {
                const strip = document.createElement('div');
                strip.className = 'studio-name-strip';
                const fontSize = Math.max(1.5, size.h * 0.06);
                strip.style.fontSize = fontSize + 'mm';
                const strips = [];
                if (nameVal) strips.push(nameVal);
                if (dateVal) strips.push(dateVal);
                strip.style.height = (fontSize * 1.4 * strips.length + 1) + 'mm';
                strip.innerHTML = strips.map(t => `<div>${t}</div>`).join('');
                cell.appendChild(strip);
            }
            grid.appendChild(cell);
        });
    };

    window.triggerPrint = function() {
        window.print();
    };

    window.saveStudioAsPDF = async function() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            Swal.fire({ icon: 'error', title: 'PDF Engine Error', text: 'Please wait for jsPDF to load.' });
            return;
        }
        const imgs = window.studioProcessedImages || [];
        if (!imgs.length) return;

        showProgress('Generating Studio PDF...');
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            
            const sizeVal = document.getElementById('s-print-size').value;
            const gapMm = parseFloat(document.getElementById('s-gap').value) || 3;
            const layoutVal = document.getElementById('s-layout').value;
            const copiesVal = parseInt(document.getElementById('s-copies').value) || 8;
            const sizeMap = { passport:{w:35,h:45}, wallet:{w:25,h:35}, stamp:{w:20,h:25}, photo4r:{w:102,h:152}, photo5r:{w:127,h:178}, halfa4:{w:148,h:105}, fulla4:{w:190,h:277} };
            let size;
            if (sizeVal === 'custom') { size = { w: parseFloat(document.getElementById('s-custom-w').value) || 35, h: parseFloat(document.getElementById('s-custom-h').value) || 45 }; }
            else { size = sizeMap[sizeVal] || sizeMap.passport; }

            const marginMm = 8;
            const usableW = 210 - 2*marginMm;
            const usableH = 297 - 2*marginMm;
            const cols = Math.max(1, Math.floor((usableW + gapMm) / (size.w + gapMm)));
            const rows = Math.max(1, Math.floor((usableH + gapMm) / (size.h + gapMm)));
            const totalFit = cols * rows;

            let photosToRender = [];
            if (layoutVal === 'fill') {
                const cpi = Math.max(1, Math.floor(totalFit / imgs.length));
                for (let s of imgs) for (let c = 0; c < cpi; c++) photosToRender.push(s);
                while (photosToRender.length < totalFit) photosToRender.push(imgs[0]);
            } else {
                for (let s of imgs) for (let c = 0; c < copiesVal; c++) photosToRender.push(s);
            }

            let pagePhotoIdx = 0;
            for (let i = 0; i < photosToRender.length; i++) {
                if (i > 0 && pagePhotoIdx === 0) pdf.addPage();
                const col = pagePhotoIdx % cols;
                const row = Math.floor(pagePhotoIdx / cols);
                const x = marginMm + col * (size.w + gapMm);
                const y = marginMm + row * (size.h + gapMm);
                pdf.addImage(photosToRender[i], 'JPEG', x, y, size.w, size.h);
                pagePhotoIdx = (pagePhotoIdx + 1) % totalFit;
            }
            hideProgress();
            pdf.save('PrintStudio_Layout.pdf');
            closePrintStudio();
        } catch(e) {
            hideProgress();
            Swal.fire({ icon: 'error', title: 'PDF Error', text: e.message });
        }
    };


    // --- Final Action Bindings (Fixed IDs) ---
    const pdfActionBtn = document.getElementById('pdf-action-btn');
    const printActionBtn = document.getElementById('print-action-btn');
    const clearAllActionBtn = document.getElementById('clear-all-btn');

    if (pdfActionBtn) pdfActionBtn.addEventListener('click', generatePDF);
    if (printActionBtn) printActionBtn.addEventListener('click', printPhotos);
    if (clearAllActionBtn) clearAllActionBtn.addEventListener('click', () => {
        files = [];
        imageList.innerHTML = '';
        updateUI();
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Workspace Cleared',
            showConfirmButton: false,
            timer: 1500
        });
    });

    // Handle Drag/Drop behavior to prevent slider interference
    if (imageList) {
        imageList.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('editor-slider')) {
                // Temporarily disable dragging for sliders
                if (typeof sortableInstance !== 'undefined') {
                    sortableInstance?.option('disabled', true);
                }
            }
        }, true);
        window.addEventListener('mouseup', () => {
            if (typeof sortableInstance !== 'undefined') {
                sortableInstance?.option('disabled', false);
            }
        });
    }
    // --- Legendary Productivity: Ctrl+V Paste Support ---
    window.addEventListener('paste', async (e) => {
        const items = e.clipboardData.items;
        let pastedCount = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const id = 'pasted-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
                const fileObj = {
                    id: id,
                    file: blob,
                    name: 'Pasted_Image_' + (files.length + 1) + '.png',
                    size: blob.size,
                    dataUrl: null,
                    filters: { brightness: 100, contrast: 100 }
                };
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    fileObj.dataUrl = event.target.result;
                    renderImageItem(fileObj);
                    updateUI();
                };
                reader.readAsDataURL(blob);
                files.push(fileObj);
                pastedCount++;
            }
        }
        if (pastedCount > 0) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: pastedCount + ' Image(s) Pasted!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    // --- Smart Theme Engine: Automatic System Detection ---
    const applySystemTheme = () => {
        if (localStorage.getItem('theme')) return; 
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);
    applySystemTheme();



    // ===== RESIZE & CONVERT ENGINE (V1) =====
    // Handle Resize Tab mode switching
    const resizeModeEl = document.getElementById('resize-mode');
    if (resizeModeEl) {
        resizeModeEl.addEventListener('change', function() {
            const mode = this.value;
            const percentGrp = document.getElementById('resize-percent-group');
            const pixelsGrp = document.getElementById('resize-pixels-group');
            const kbGrp = document.getElementById('resize-kb-group');
            
            if (percentGrp) percentGrp.classList.toggle('hidden', mode !== 'by-percent');
            if (pixelsGrp) pixelsGrp.classList.toggle('hidden', !['by-pixels', 'passport-std', 'id-card', 'linkedin', 'facebook', 'instagram', 'whatsapp-dp'].includes(mode));
            if (kbGrp) kbGrp.classList.toggle('hidden', mode !== 'by-kb');

            // Auto-fill preset dimensions
            const presets = {
                'passport-std': [413, 531], 'id-card': [200, 200], 'linkedin': [400, 400],
                'facebook': [820, 312], 'instagram': [1080, 1080], 'whatsapp-dp': [500, 500]
            };
            if (presets[mode]) {
                const widthEl = document.getElementById('resize-width');
                const heightEl = document.getElementById('resize-height');
                if (widthEl) widthEl.value = presets[mode][0];
                if (heightEl) heightEl.value = presets[mode][1];
            }
        });
    }

    // Resize Action Button
    const resizeActionBtn = document.getElementById('resize-action-btn');
    if (resizeActionBtn) {
        resizeActionBtn.addEventListener('click', async () => {
            if (files.length === 0) {
                Swal.fire({ icon: 'warning', title: 'No Images', text: 'Please select images first!', background: 'rgba(255,255,255,0.9)' });
                return;
            }
            await runResizeEngine(false);
        });
    }

    // Resize + Save as PDF
    const resizeToPdfBtn = document.getElementById('resize-to-pdf-btn');
    if (resizeToPdfBtn) {
        resizeToPdfBtn.addEventListener('click', async () => {
            if (files.length === 0) {
                Swal.fire({ icon: 'warning', title: 'No Images', text: 'Please select images first!', background: 'rgba(255,255,255,0.9)' });
                return;
            }
            await runResizeEngine(true);
        });
    }

    async function runResizeEngine(saveAsPdf) {
        showProgress('Resizing Images...');
        try {
            const mode = document.getElementById('resize-mode')?.value || 'by-percent';
            const percent = parseInt(document.getElementById('resize-percent')?.value) || 50;
            const targetW = parseInt(document.getElementById('resize-width')?.value) || 800;
            const targetH = parseInt(document.getElementById('resize-height')?.value) || 600;
            const targetKb = parseInt(document.getElementById('resize-target-kb')?.value) || 100;
            const maintainRatio = document.getElementById('resize-maintain-ratio')?.value !== 'no';
            const outputFmt = document.getElementById('output-format')?.value || 'original';
            const quality = parseFloat(document.getElementById('output-quality')?.value) || 0.85;
            
            const mimeType = outputFmt === 'original' ? '' : 'image/' + (outputFmt === 'jpg' ? 'jpeg' : outputFmt);
            const ext = outputFmt === 'original' ? '' : (outputFmt === 'jpeg' ? 'jpg' : outputFmt);

            const results = [];

            for (let i = 0; i < files.length; i++) {
                updateProgress(Math.round(i / files.length * 100), `Resizing ${i + 1} of ${files.length}...`);
                
                let currentMimeType = mimeType;
                let currentExt = ext;
                
                if (outputFmt === 'original') {
                    const fileObj = files[i].file;
                    const origType = fileObj?.type || '';
                    const origName = fileObj?.name || '';
                    if (origType.includes('png') || origName.toLowerCase().endsWith('.png')) {
                        currentMimeType = 'image/png';
                        currentExt = 'png';
                    } else if (origType.includes('webp') || origName.toLowerCase().endsWith('.webp')) {
                        currentMimeType = 'image/webp';
                        currentExt = 'webp';
                    } else if (origType.includes('gif') || origName.toLowerCase().endsWith('.gif')) {
                        currentMimeType = 'image/gif';
                        currentExt = 'gif';
                    } else {
                        currentMimeType = 'image/jpeg';
                        currentExt = 'jpg';
                    }
                }
                
                const imgEl = await loadImageFromDataUrl(files[i].dataUrl);
                let newW = imgEl.width, newH = imgEl.height;

                let activeMimeType = currentMimeType;
                let activeExt = currentExt;

                if (mode === 'by-percent') {
                    newW = Math.round(imgEl.width * percent / 100);
                    newH = Math.round(imgEl.height * percent / 100);
                } else if (mode === 'by-pixels' || ['passport-std','id-card','linkedin','facebook','instagram','whatsapp-dp'].includes(mode)) {
                    if (maintainRatio) {
                        const ratioW = targetW / imgEl.width;
                        const ratioH = targetH / imgEl.height;
                        const ratio = Math.min(ratioW, ratioH);
                        newW = Math.round(imgEl.width * ratio);
                        newH = Math.round(imgEl.height * ratio);
                    } else {
                        newW = targetW; newH = targetH;
                    }
                } else if (mode === 'by-kb') {
                    // For size-targeting in KB, fallback PNG to JPEG because PNG lossless compression cannot hit specific sizes
                    if (activeMimeType === 'image/png') {
                        activeMimeType = 'image/jpeg';
                        activeExt = 'jpg';
                    }

                    // Bounding limit first to avoid memory overhead
                    const maxB = 1600;
                    if (imgEl.width > maxB || imgEl.height > maxB) {
                        const ratio = Math.min(maxB / imgEl.width, maxB / imgEl.height);
                        newW = Math.round(imgEl.width * ratio);
                        newH = Math.round(imgEl.height * ratio);
                    }

                    // Dynamically scale down dimensions if size at medium quality (0.5) is larger than target KB
                    let scale = 1.0;
                    let attempts = 0;
                    let testCanvas = document.createElement('canvas');
                    let testCtx = testCanvas.getContext('2d');
                    
                    while (attempts < 6) {
                        let curW = Math.round(newW * scale);
                        let curH = Math.round(newH * scale);
                        testCanvas.width = curW;
                        testCanvas.height = curH;
                        
                        testCtx.clearRect(0, 0, curW, curH);
                        if (activeMimeType === 'image/jpeg') {
                            testCtx.fillStyle = '#FFFFFF';
                            testCtx.fillRect(0, 0, curW, curH);
                        }
                        testCtx.drawImage(imgEl, 0, 0, curW, curH);
                        
                        let testUrl = testCanvas.toDataURL(activeMimeType, 0.5);
                        let testKb = Math.round((testUrl.length * 3) / 4 / 1024);
                        
                        if (testKb <= targetKb || scale <= 0.25) {
                            newW = curW;
                            newH = curH;
                            break;
                        }
                        
                        scale -= 0.15;
                        attempts++;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = newW; canvas.height = newH;
                const ctx = canvas.getContext('2d');
                
                // Keep transparent background for PNG/WEBP outputs, fill white only for JPEGs
                if (activeMimeType === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, newW, newH);
                } else {
                    ctx.clearRect(0, 0, newW, newH);
                }
                ctx.drawImage(imgEl, 0, 0, newW, newH);

                let dataUrl;
                if (mode === 'by-kb') {
                    // Fine-tuned binary search for size
                    let lo = 0.1, hi = 0.95;
                    for (let iter = 0; iter < 8; iter++) {
                        const mid = (lo + hi) / 2;
                        dataUrl = canvas.toDataURL(activeMimeType, mid);
                        const kb = Math.round((dataUrl.length * 3) / 4 / 1024);
                        if (kb > targetKb) hi = mid; else lo = mid;
                    }
                } else {
                    dataUrl = canvas.toDataURL(activeMimeType, quality);
                }

                const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
                const baseName = (files[i].file?.name || files[i].name || 'image').replace(/\.[^.]+$/, '');
                results.push({ dataUrl, name: `${baseName}_resized_${newW}x${newH}.${activeExt}`, w: newW, h: newH, sizeKb, original: files[i] });
            }

            hideProgress();

            if (saveAsPdf) {
                // Generate PDF with resized images
                await generateResizedPDF(results);
            } else {
                // Show download modal
                showResizeDownloads(results);
            }
        } catch(e) {
            hideProgress();
            console.error('Resize error:', e);
            Swal.fire({ icon: 'error', title: 'Resize Failed', text: e.message || 'Unknown error.' });
        }
    }

    function showResizeDownloads(results) {
        const modal = document.getElementById('resize-download-modal');
        const list = document.getElementById('resize-download-list');
        if (!modal || !list) return;
        
        list.innerHTML = '';
        results.forEach((r, idx) => {
            const card = document.createElement('div');
            card.className = 'resize-dl-card';
            card.innerHTML = `
                <img src="${r.dataUrl}" alt="Resized">
                <div class="resize-dl-info">
                    <div class="name">${r.name}</div>
                    <div class="meta">${r.w} × ${r.h} px | ${r.sizeKb} KB</div>
                </div>
                <a href="${r.dataUrl}" download="${r.name}" style="background:linear-gradient(135deg,#10B981,#059669); color:white; border:none; padding:10px 18px; border-radius:8px; font-size:0.85rem; font-weight:600; cursor:pointer; text-decoration:none; display:flex; align-items:center; gap:6px; white-space:nowrap;">
                    <i class="fa-solid fa-download"></i> Download
                </a>`;
            list.appendChild(card);
        });

        if (results.length > 1) {
            const dlAll = document.createElement('button');
            dlAll.style.cssText = 'width:100%; background:linear-gradient(135deg,#6366F1,#8b5cf6); color:white; border:none; padding:14px; border-radius:10px; font-weight:700; cursor:pointer; margin-top:10px; font-size:1rem;';
            dlAll.innerHTML = '<i class="fa-solid fa-download"></i> Download All Images';
            dlAll.onclick = () => { results.forEach(r => { const a = document.createElement('a'); a.href = r.dataUrl; a.download = r.name; a.click(); }); };
            list.appendChild(dlAll);
        }

        modal.style.display = 'flex';
    }

    async function generateResizedPDF(results) {
        if (!window.jspdf?.jsPDF) { Swal.fire({ icon: 'error', title: 'PDF Engine Error', text: 'jsPDF not loaded.' }); return; }
        showProgress('Generating PDF from resized images...');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
        for (let i = 0; i < results.length; i++) {
            if (i > 0) pdf.addPage();
            const r = results[i];
            const pdfW = 794, pdfH = 1123;
            const ratio = Math.min(pdfW / r.w, pdfH / r.h);
            const dW = r.w * ratio, dH = r.h * ratio;
            const format = r.name.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
            pdf.addImage(r.dataUrl, format, (pdfW - dW) / 2, (pdfH - dH) / 2, dW, dH);
        }
        hideProgress();
        pdf.save('Resized_Images.pdf');
        Swal.fire({ icon: 'success', title: 'PDF Saved!', text: `${results.length} resized image(s) saved as PDF.`, timer: 2000, showConfirmButton: false });
    }

    // ===== SVG / TIFF / AVIF SUPPORT =====
    async function loadSvgAsImage(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
            img.onerror = reject;
            img.src = url;
        });
    }

    // ===== RESIZE TAB: Update file input accepted types and handling =====
    // Patch the file validation to accept SVG, TIFF, AVIF
    const origHandleFiles = window.__handleFilesOrig;

    // ===== TAB 3 WIRING =====
    // Auto-activate tab based on hash on load or hashchange
    const handleHashRouting = () => {
        const hash = window.location.hash;
        if (hash === '#resize' || hash === '#resize-tab') {
            document.getElementById('tab-resize')?.click();
        } else if (hash === '#print' || hash === '#print-tab') {
            document.getElementById('tab-print')?.click();
        } else if (hash === '#pdf' || hash === '#pdf-tab') {
            document.getElementById('tab-pdf')?.click();
        }
    };
    window.addEventListener('hashchange', handleHashRouting);
    handleHashRouting();

    // Wire up the 3rd tab (resize) through the existing tab system - already handled by the existing tab btn code
    console.log("%cPhotoSePDF.in v5.0 | India #1 Free Image to PDF + Resize Tool", "color:#6366F1; font-size:14px; font-weight:bold;");
});

