document.addEventListener('DOMContentLoaded', () => {
    // Service Worker for Premium PWA Offline Mode
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW registration failed:', err));
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

    // Generate PDF
    generateBtn.addEventListener('click', generatePDF);

    // Share Button Native API fallback
    document.getElementById('share-website-btn').addEventListener('click', async () => {
        const shareData = {
            title: 'Img2PDF Pro - Free Image to PDF Converter',
            text: 'I just used this amazing, 100% free and secure offline Image to PDF converter!',
            url: window.location.href
        }
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.url);
                Swal.fire({
                    title: 'Copied!',
                    text: 'Website link copied to clipboard.',
                    icon: 'success',
                    background: 'rgba(255, 255, 255, 0.95)',
                    confirmButtonColor: '#6366F1'
                });
            }
        } catch(err) {
            console.error('Share failed', err);
        }
    });

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
                hideLoading();
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
        li.className = 'image-item';
        li.dataset.id = fileObj.id;

        li.innerHTML = `
            <div class="image-thumb-container">
                <img src="${fileObj.dataUrl}" class="image-thumb" alt="${fileObj.file.name}">
            </div>
            <div class="image-name" title="${fileObj.file.name}">${fileObj.file.name}</div>
            <div class="image-size">${formatBytes(fileObj.file.size)}</div>
            <button class="remove-btn" title="Remove image" onclick="removeImage('${fileObj.id}')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        imageList.appendChild(li);
    }

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
        
        if (files.length > 0) {
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
        }
    }

    // Image compression utility
    function compressImage(img, targetQuality) {
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
            
            ctx.drawImage(img, 0, 0, width, height);
            
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

    async function generatePDF() {
        if (files.length === 0) return;
        
        showLoading();

        try {
            // Get settings
            const margin = parseInt(marginSelect.value);
            const qualitySetting = sizeSelect.value;
            const layoutMode = parseInt(layoutSelect.value); // 1, 2, or 4
            const pageSizePref = pageSizeSelect.value;
            const orientationPref = orientationSelect.value;
            // Sanitize filename to prevent XSS or OS path traversal leaps
            let customFileName = fileNameInput.value.trim() || 'Img2PDFPro_Document';
            customFileName = customFileName.replace(/[^a-zA-Z0-9_\-\s]/g, '');
            
            // Initialize jsPDF
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
                
                // Real-time processing progress
                const loadingTextEl = document.getElementById('loading-text');
                if (loadingTextEl) {
                    loadingTextEl.innerText = `Processing Image ${i + 1} of ${files.length}...`;
                }

                const imgElement = await loadImageFromDataUrl(files[i].dataUrl);
                const compressedDataUrl = await compressImage(imgElement, qualitySetting);
                
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

                    pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
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
                    console.warn("Encryption module not active in this jsPDF build. PDF will be generated without password.");
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
            hideLoading();
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
            hideLoading();
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
        document.body.style.overflow = 'hidden';
    }

    function hideLoading() {
        loadingOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});
