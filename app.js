document.addEventListener('DOMContentLoaded', () => {
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
            confirmButtonText: 'Yes, clear it!'
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
                Swal.fire('Copied!', 'Website link copied to clipboard.', 'success');
            }
        } catch(err) {
            console.error('Share failed', err);
        }
    });

    // ----- Functions -----

    function handleFiles(selectedFiles) {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif', 'image/bmp'];
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB crash prevention limit

        let addedCount = 0;
        let rejectedCount = 0;

        Array.from(selectedFiles).forEach(file => {
            if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|gif|bmp)$/i)) {
                rejectedCount++;
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                Swal.fire('File Too Large', `The file ${file.name} exceeds the 50MB safety limit.`, 'error');
                return;
            }
            
            // Add unique ID
            const fileObj = {
                    id: 'img_' + Math.random().toString(36).substr(2, 9),
                    file: file,
                    dataUrl: null
                };
                
                // Read file to get data URL for thumbnail
                const reader = new FileReader();
                reader.onload = (e) => {
                    fileObj.dataUrl = e.target.result;
                    renderImageItem(fileObj);
                };
                reader.readAsDataURL(file);

                files.push(fileObj);
                addedCount++;
        });

        if (rejectedCount > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Some files were skipped',
                text: `${rejectedCount} file(s) are not supported images.`
            });
        }

        if (addedCount > 0) {
            updateUI();
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
            const customFileName = fileNameInput.value.trim() || 'Img2PDFPro_Document';
            
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

                // Delete the shell page on the first loop if we are dynamically sizing
                if (i === 0) {
                    pdf.deletePage(1);
                }
                
                // Add the configured page
                pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
            
                const contentWidth = pdfWidth - (margin * 2);
                const contentHeight = pdfHeight - (margin * 2);
                
                // Calculate dimensions based on layout mode
                let imgX, imgY, targetW, targetH;

                if (layoutMode === 1) {
                    // 1 per page: Scale to fit content area while maintaining aspect ratio
                    const imgRatio = imgElement.width / imgElement.height;
                    const contentRatio = contentWidth / contentHeight;

                    if (imgRatio > contentRatio) {
                        targetW = contentWidth;
                        targetH = targetW / imgRatio;
                        imgX = margin;
                        imgY = margin + (contentHeight - targetH) / 2; // Center vertically
                    } else {
                        targetH = contentHeight;
                        targetW = targetH * imgRatio;
                        imgY = margin;
                        imgX = margin + (contentWidth - targetW) / 2; // Center horizontally
                    }

                    // Note: Multiple images per page (Layout 2 & 4) doesn't make sense if "Fit to Window" 
                    // is selected. We default back to behavior 1 if so, otherwise continue.
                    if (pageSizePref === 'fit') {
                       // Skip layout logic and use Layout 1 fallback below
                    } else {
                        // 2 per page: Horizontal split (one top, one bottom)
                        const slotHeight = contentHeight / 2 - (margin/2); // Gap between images
                        
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
                        if (!isEven && i > 0 && pageIndex !== Math.floor(i / 2)) {
                             // handled
                        }
                        if (isEven && i > 0) {
                            pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                            pageIndex++;
                        }

                        imgX = margin + (contentWidth - targetW) / 2;
                        imgY = isEven ? margin + (slotHeight - targetH) / 2 : margin + slotHeight + margin/2 + (slotHeight - targetH) / 2;

                        pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
                        continue;
                    }

                } else if (layoutMode === 4) {
                    if (pageSizePref === 'fit') {
                        // Skip layout logic
                    } else {
                        // 4 per page: 2x2 grid
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
                        if (indexOnPage === 0 && i > 0) {
                            pdf.addPage([pdfWidth, pdfHeight], imgOrientation);
                        }

                        // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
                        const col = indexOnPage % 2;
                        const row = Math.floor(indexOnPage / 2);

                        imgX = margin + (col * (slotWidth + margin)) + (slotWidth - targetW) / 2;
                        imgY = margin + (row * (slotHeight + margin)) + (slotHeight - targetH) / 2;

                        pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
                        continue;
                    }
                }
                
                // Default Layout 1 (or fallback for Fit mode)
                const imgRatio = imgElement.width / imgElement.height;
                const contentRatio = contentWidth / contentHeight;

                if (imgRatio > contentRatio) {
                    targetW = contentWidth;
                    targetH = targetW / imgRatio;
                    imgX = margin;
                    imgY = margin + (contentHeight - targetH) / 2; // Center vertically
                } else {
                    targetH = contentHeight;
                    targetW = targetH * imgRatio;
                    imgY = margin;
                    imgX = margin + (contentWidth - targetW) / 2; // Center horizontally
                }

                pdf.addImage(compressedDataUrl, 'JPEG', imgX, imgY, targetW, targetH);
            }

            // Save and download with custom name
            pdf.save(`${customFileName}.pdf`);
            
            // Success Feedback
            hideLoading();
            triggerConfetti();
            Swal.fire({
                title: 'Success!',
                text: 'Your PDF has been generated securely.',
                icon: 'success',
                confirmButtonColor: '#10B981'
            });
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            hideLoading();
            Swal.fire('Oops...', 'An error occurred while generating the PDF. The image might be corrupted or too large.', 'error');
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
