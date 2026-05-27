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
                document.getElementById('print-choice-card').style.transform = 'scale(1.05)';
                document.getElementById('pdf-choice-card').style.transform = 'scale(1)';
            } else {
                document.getElementById('pdf-choice-card').style.transform = 'scale(1.05)';
                document.getElementById('print-choice-card').style.transform = 'scale(1)';
            }
        });
    });

    // --- Version Management (Zero Refresh Issue) ---
    const APP_VERSION = '4.1.0'; // Professional Version
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
            if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|gif|bmp)$/i)) {
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
            fileObj.filters = { brightness: 100, contrast: 100 };
        }

        li.innerHTML = `
            <div class="image-item-main">
                <div class="drag-handle"><i class="fa-solid fa-grip-vertical"></i></div>
                <img src="${fileObj.dataUrl}" class="image-thumb" alt="${fileObj.file.name}">
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
            </div>
        `;

        imageList.appendChild(li);
    }

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
    function compressImage(img, targetQuality, colorMode = 'original', passName = '', passDate = '', filters = {brightness: 100, contrast: 100}) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
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

            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            
            // Fill white background for transparent PNGs
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            // Apply Studio Filters (Brightness/Contrast)
            ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%)`;
            ctx.drawImage(img, 0, 0, width, height);
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
                title: 'PDF Generated! 🎉',
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

    // ===== CYBER CAFE PRINT ENGINE (V2 SMART STUDIO) =====
    async function printPhotos() {
        if (files.length === 0) {
            Swal.fire({ icon: 'warning', title: 'No Images', text: 'Select photos first!', background: 'rgba(255,255,255,0.9)' });
            return;
        }

        showProgress('Preparing Studio Layout...');

        const printSizeVal = document.getElementById('print-size').value;
        const layoutMode = document.getElementById('print-layout-mode').value;
        const copiesCount = parseInt(document.getElementById('print-copies-count').value) || 1;
        const loadingTextEl = document.getElementById('progress-status-text');
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        const colorModePref = activeTab === 'print-tab' 
            ? (document.getElementById('print-color-mode')?.value || 'original')
            : (document.getElementById('color-mode')?.value || 'original');

        // Size definitions: width x height in mm
        const sizeMap = {
            passport: { w: 35,  h: 45,  label: 'Passport Size' },
            wallet:   { w: 25,  h: 35,  label: 'Wallet Size' },
            photo4r:  { w: 102, h: 152, label: '4R (4\u00d76) Photo' },
            halfa4:   { w: 148, h: 105, label: 'Half A4' },
            fulla4:   { w: 190, h: 277, label: 'Full A4 Page' }
        };

        let size;
        if (printSizeVal === 'custom') {
            size = {
                w: parseInt(document.getElementById('print-custom-w').value) || 35,
                h: parseInt(document.getElementById('print-custom-h').value) || 45,
                label: 'Custom Size'
            };
        } else {
            size = sizeMap[printSizeVal] || sizeMap.passport;
        }

        const gapMm = 3;
        const usableW = 190;
        const usableH = 277;

        // Process images
        const passName = document.getElementById('passport-name').value;
        const passDate = document.getElementById('passport-date').value;
        const processedImages = [];
        for (let i = 0; i < files.length; i++) {
            if (loadingTextEl) loadingTextEl.innerText = `Studio Processing: Image ${i + 1} of ${files.length}...`;
            const img = await loadImageFromDataUrl(files[i].dataUrl);
            const compressed = await compressImage(img, 'high', colorModePref, passName, passDate, files[i].filters);
            processedImages.push(compressed);
        }

        // Generate total list of photos to render
        let photosToRender = [];
        if (layoutMode === 'fill-page') {
            const cols = Math.max(1, Math.floor((usableW + gapMm) / (size.w + gapMm)));
            const rows = Math.max(1, Math.floor((usableH + gapMm) / (size.h + gapMm)));
            const totalFit = cols * rows;
            const copiesPerImage = Math.max(1, Math.floor(totalFit / processedImages.length));
            for (let imgData of processedImages) {
                for (let c = 0; c < copiesPerImage; c++) {
                    photosToRender.push(imgData);
                }
            }
            while (photosToRender.length < totalFit) {
                photosToRender.push(processedImages[0]);
            }
        } else {
            for (let imgData of processedImages) {
                for (let c = 0; c < copiesCount; c++) {
                    photosToRender.push(imgData);
                }
            }
        }
        let photoCellsHtml = '';
        photosToRender.forEach((src, idx) => {
            photoCellsHtml += `
                <div class="photo-cell">
                    <img src="${src}" alt="Photo ${idx + 1}" />
                </div>`;
        });

        const printHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Smart Print Studio — Img2PDF Pro</title>
    <style>
        @page { margin: 8mm; size: A4 portrait; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f1f5f9; color: #1e293b; }

        /* Toolbar */
        .no-print-zone {
            background: #0f172a;
            color: #fff;
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .logo-area { display: flex; align-items: center; gap: 10px; }
        .logo-area h1 { font-size: 1.1rem; letter-spacing: 1px; }
        .controls { display: flex; gap: 12px; }
        .btn {
            padding: 10px 22px;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            transition: 0.2s;
            font-size: 0.9rem;
        }
        .btn-print { background: #10b981; color: white; }
        .btn-print:hover { background: #059669; transform: scale(1.03); }
        .btn-close { background: rgba(255,255,255,0.1); color: white; }
        .btn-close:hover { background: rgba(255,255,255,0.2); }

        /* Sheet Info */
        .sheet-info {
            background: #fff;
            padding: 10px 30px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            gap: 25px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #64748b;
        }
        .sheet-info b { color: #10b981; }

        /* Print Layout */
        .page-sheet {
            background: #fff;
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 10mm;
            box-shadow: 0 0 40px rgba(0,0,0,0.1);
            position: relative;
        }
        .photo-grid {
            display: flex;
            flex-wrap: wrap;
            gap: ${gapMm}mm;
            justify-content: flex-start;
            align-content: flex-start;
        }
        .photo-cell {
            width: ${size.w}mm;
            height: ${size.h}mm;
            border: 0.2mm solid #ddd;
            position: relative;
            background: #fafafa;
            overflow: hidden;
        }
        .photo-cell img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        /* Smart Cut Marks */
        .photo-cell::before, .photo-cell::after {
            content: '';
            position: absolute;
            width: 4mm; height: 4mm;
            border: 0.4mm solid #999;
            z-index: 5;
            opacity: 0.6;
        }
        .photo-cell::before { top: 0; left: 0; border-right: none; border-bottom: none; }
        .photo-cell::after { bottom: 0; right: 0; border-left: none; border-top: none; }

        @media print {
            body { background: #fff; }
            .no-print-zone, .sheet-info { display: none !important; }
            .page-sheet { margin: 0; box-shadow: none; padding: 0; width: 100%; }
            @page { margin: 8mm; }
        }
    </style>
</head>
<body>
    <div class="no-print-zone">
        <div class="logo-area">
            <h1>\ud83d\udda8\ufe0f SMART PRINT STUDIO</h1>
        </div>
        <div class="controls">
            <button class="btn btn-close" onclick="window.close()">Cancel</button>
            <button class="btn btn-print" onclick="window.print()">START PRINTING</button>
        </div>
    </div>
    <div class="sheet-info">
        <span>Paper: <b>A4 Sheet</b></span>
        <span>Size: <b>${size.label} (${size.w}\u00d7${size.h}mm)</b></span>
        <span>Copies: <b>${photosToRender.length} Photos</b></span>
        <span>Layout: <b>${layoutMode === 'tile-single' ? 'Single Photo Tiled' : 'Multiple Images'}</b></span>
    </div>

    <div class="page-sheet">
        <div class="photo-grid">
            ${photoCellsHtml}
        </div>
    </div>

    <script>
        // Auto-focus print dialog
        window.onload = () => {
            setTimeout(() => {
                // window.print(); // Optional: trigger auto-print
            }, 500);
        };
    </script>
</body>
</html>`;

        hideProgress();

        const printWindow = window.open('', '_blank', 'width=1000,height=900');
        if (!printWindow) {
            Swal.fire({ title: 'Popup Blocked', text: 'Please allow popups.', icon: 'error' });
            return;
        }
        printWindow.document.write(printHTML);
        printWindow.document.close();
    }
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

    console.log("Image2PDF Pro: Professional Engine v4.5 Loaded.");
});
