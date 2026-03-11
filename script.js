// State Management
let selectedImages = [];
let idCounter = 0;

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const imagePreview = document.getElementById('image-preview');
const controls = document.getElementById('controls');
const imageCount = document.getElementById('image-count');
const clearBtn = document.getElementById('clear-btn');
const generateBtn = document.getElementById('generate-btn');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize SortableJS for drag & drop reordering
let sortable = Sortable.create(imagePreview, {
    animation: 200,
    ghostClass: 'sortable-ghost',
    onEnd: () => {
        // Update logic map selectedImages after drag using data-index
        const newOrder = [];
        const items = imagePreview.querySelectorAll('.preview-item');
        items.forEach(item => {
            const index = parseInt(item.dataset.index);
            const found = selectedImages.find(img => img.id === index);
            if (found) newOrder.push(found);
        });
        selectedImages = newOrder;
    }
});

// Event Listeners for Upload interactions
fileInput.addEventListener('change', handleFiles);

uploadArea.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
        fileInput.click();
    }
});

uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    processFiles(files);
});

// Core logic to parse and load files
function handleFiles(e) {
    const files = e.target.files;
    processFiles(files);
}

function processFiles(files) {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (validFiles.length > 0) {
        controls.style.display = 'block';
    }

    validFiles.forEach(file => {
        const reader = new FileReader();
        const id = idCounter++;

        reader.onload = (e) => {
            const imgData = e.target.result;
            selectedImages.push({ id, file, imgData });
            renderPreview(id, imgData, file.name);
            updateCount();
        };
        reader.readAsDataURL(file);
    });

    // reset input out so you can pick the same file twice if needed
    fileInput.value = '';
}

// Visual Preview Rendering
function renderPreview(id, src, name) {
    const div = document.createElement('div');
    div.classList.add('preview-item');
    div.dataset.index = id;

    div.innerHTML = `
        <img src="${src}" alt="${name}">
        <button class="remove-btn" onclick="event.stopPropagation(); removeImage(${id})" title="Remove Image">&times;</button>
    `;

    imagePreview.appendChild(div);
}

// Global scope required for inline removal fn
window.removeImage = function (id) {
    selectedImages = selectedImages.filter(img => img.id !== id);
    const item = imagePreview.querySelector(`.preview-item[data-index="${id}"]`);
    if (item) {
        item.style.transform = 'scale(0)';
        item.style.opacity = '0';
        setTimeout(() => {
            item.remove();
        }, 200);
    }
    updateCount();

    if (selectedImages.length === 0) {
        setTimeout(() => {
            controls.style.display = 'none';
        }, 200);
    }
}

// UI Updaters
function updateCount() {
    imageCount.textContent = selectedImages.length;
}

clearBtn.addEventListener('click', () => {
    selectedImages = [];
    imagePreview.innerHTML = '';
    controls.style.display = 'none';
    updateCount();
});

// Core PDF Generation mapping utilizing File->Image->jsPDF
generateBtn.addEventListener('click', async () => {
    if (selectedImages.length === 0) return;

    loadingOverlay.style.display = 'flex';

    try {
        const { jsPDF } = window.jspdf;

        const pageSize = document.getElementById('page-size').value;
        const marginStr = document.getElementById('margin').value;
        const marginStyle = parseInt(marginStr);
        const compressionQuality = parseFloat(document.getElementById('compression').value);
        const orientationPref = document.getElementById('orientation').value;
        const imagesPerPage = parseInt(document.getElementById('images-per-page').value) || 1;
        const fileName = document.getElementById('file-name').value.trim() || 'Document_Converted';
        const docFilter = document.getElementById('doc-filter').value;
        const watermarkText = document.getElementById('watermark').value.trim();
        const pageNumbers = document.getElementById('page-numbers').value;
        const pdfPassword = document.getElementById('pdf-password').value.trim();

        let pdf;

        let actualPageSize = pageSize;
        // Turn off 'fit' to image size when merging multiple images on one page
        if (imagesPerPage > 1 && pageSize === 'fit') actualPageSize = 'a4';

        let chunks = [];
        for (let i = 0; i < selectedImages.length; i += imagesPerPage) {
            chunks.push(selectedImages.slice(i, i + imagesPerPage));
        }

        for (let pageIndex = 0; pageIndex < chunks.length; pageIndex++) {
            const chunk = chunks[pageIndex];

            const loadedImages = [];
            for (let imgObj of chunk) {
                const img = new Image();
                img.src = imgObj.imgData;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                loadedImages.push({ img, imgObj });
            }

            let pdfWidth = 210; // A4 default width (mm)
            let pdfHeight = 297; // A4 default height (mm)

            if (actualPageSize === 'letter') {
                pdfWidth = 215.9;
                pdfHeight = 279.4;
            } else if (actualPageSize === 'fit' && imagesPerPage === 1) {
                const img = loadedImages[0].img;
                const ptX = img.width * 0.264583;
                const ptY = img.height * 0.264583;
                pdfWidth = ptX + marginStyle * 2;
                pdfHeight = ptY + marginStyle * 2;
            }

            let currentOrientation;
            if (orientationPref === 'auto') {
                currentOrientation = pdfWidth > pdfHeight ? 'l' : 'p';
            } else {
                currentOrientation = orientationPref;
                if ((currentOrientation === 'p' && pdfWidth > pdfHeight) ||
                    (currentOrientation === 'l' && pdfHeight > pdfWidth)) {
                    const temp = pdfWidth;
                    pdfWidth = pdfHeight;
                    pdfHeight = temp;
                }
            }

            if (pageIndex === 0) {
                let jsPdfOpts = {
                    orientation: currentOrientation,
                    unit: 'mm',
                    format: actualPageSize === 'fit' ? [pdfWidth, pdfHeight] : actualPageSize
                };

                // Add optional PRO password protection
                if (pdfPassword) {
                    jsPdfOpts.encryption = {
                        userPassword: pdfPassword,
                        ownerPassword: pdfPassword,
                        userPermissions: ["print", "modify", "copy", "annot-forms"]
                    };
                }

                try {
                    pdf = new jsPDF(jsPdfOpts);
                } catch (e) {
                    // Fallback if encryption is not supported by current cdnjs build
                    delete jsPdfOpts.encryption;
                    pdf = new jsPDF(jsPdfOpts);
                    console.warn("PDF Encryption not supported by standard build, bypassing password.");
                }
            } else {
                pdf.addPage(actualPageSize === 'fit' ? [pdfWidth, pdfHeight] : actualPageSize, currentOrientation);
            }

            // Grid logic
            let cols = 1, rows = 1;
            if (imagesPerPage === 2) { rows = 2; cols = 1; }
            if (imagesPerPage === 4) { rows = 2; cols = 2; }
            if (imagesPerPage === 6) { rows = 3; cols = 2; }
            if (imagesPerPage === 9) { rows = 3; cols = 3; }

            const renderableWidth = pdfWidth - marginStyle * 2;
            const renderableHeight = pdfHeight - marginStyle * 2;
            const cellWidth = renderableWidth / cols;
            const cellHeight = renderableHeight / rows;

            for (let i = 0; i < loadedImages.length; i++) {
                const { img, imgObj } = loadedImages[i];
                let finalImgData = imgObj.imgData;

                // Apply Scanner Filter or Compress Image via canvas (Downscaling for 100-200kb)
                if (compressionQuality < 1.0 || img.src.includes('image/png') || docFilter !== 'none') {
                    const canvas = document.createElement('canvas');
                    let targetWidth = img.width;
                    let targetHeight = img.height;

                    if (compressionQuality <= 0.15) {
                        const maxDim = 700;
                        if (targetWidth > maxDim || targetHeight > maxDim) {
                            const ratio = Math.min(maxDim / targetWidth, maxDim / targetHeight);
                            targetWidth = targetWidth * ratio;
                            targetHeight = targetHeight * ratio;
                        }
                    } else if (compressionQuality <= 0.3) {
                        const maxDim = 1200;
                        if (targetWidth > maxDim || targetHeight > maxDim) {
                            const ratio = Math.min(maxDim / targetWidth, maxDim / targetHeight);
                            targetWidth = targetWidth * ratio;
                            targetHeight = targetHeight * ratio;
                        }
                    }

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // PRO: Apply Image Document Filters (B&W/Grayscale) over pixels
                    if (docFilter !== 'none') {
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        for (let j = 0; j < data.length; j += 4) {
                            // RGB simple average
                            const avg = (data[j] + data[j + 1] + data[j + 2]) / 3;
                            if (docFilter === 'bw') {
                                // Thresholding for sharp B&W text
                                const bw = avg > 140 ? 255 : 0;
                                data[j] = bw;
                                data[j + 1] = bw;
                                data[j + 2] = bw;
                            } else if (docFilter === 'gray') {
                                data[j] = avg;
                                data[j + 1] = avg;
                                data[j + 2] = avg;
                            }
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }

                    finalImgData = canvas.toDataURL('image/jpeg', compressionQuality);
                }

                const imgRatio = img.width / img.height;
                // Add inner-padding so photos don't stick to each other
                const cellPadding = imagesPerPage > 1 ? 5 : 0;
                const maxDrawW = cellWidth - (cellPadding * 2);
                const maxDrawH = cellHeight - (cellPadding * 2);

                let drawW = maxDrawW, drawH = maxDrawH;

                if (actualPageSize !== 'fit') {
                    if (imgRatio > maxDrawW / maxDrawH) {
                        drawH = maxDrawW / imgRatio;
                        drawW = maxDrawW;
                    } else {
                        drawW = maxDrawH * imgRatio;
                        drawH = maxDrawH;
                    }
                }

                const c = i % cols;
                const r = Math.floor(i / cols);

                const cellX = marginStyle + (c * cellWidth);
                const cellY = marginStyle + (r * cellHeight);

                const drawX = cellX + ((cellWidth - drawW) / 2);
                const drawY = cellY + ((cellHeight - drawH) / 2);

                pdf.addImage(finalImgData, 'JPEG', drawX, drawY, drawW, drawH);
            }

            // PRO: Add Watermark over the entire page layout
            if (watermarkText) {
                pdf.setTextColor(150, 150, 150); // Gray color
                pdf.setFontSize(45);
                // jsPDF text rotation handling requires angle in options
                pdf.text(watermarkText, pdfWidth / 2, pdfHeight / 2, { angle: 45, align: 'center' });
            }

            // PRO: Add Page Numbers
            if (pageNumbers !== 'none') {
                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(10);
                const pageText = `Page ${pageIndex + 1} of ${chunks.length}`;

                let px = pdfWidth / 2;
                let py = pdfHeight - 10;
                let textOpts = { align: 'center' };

                if (pageNumbers === 'bottom-right') {
                    px = pdfWidth - 10;
                    textOpts.align = 'right';
                } else if (pageNumbers === 'top-right') {
                    px = pdfWidth - 10;
                    py = 10;
                    textOpts.align = 'right';
                }

                pdf.text(pageText, px, py, textOpts);
            }
        }

        pdf.save(`${fileName}.pdf`);

        loadingOverlay.style.display = 'none';

        // Confetti & Premium Alert
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });

        Swal.fire({
            title: 'Awesome!',
            text: 'Your new PDF is ready and downloading!',
            icon: 'success',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#4f46e5'
        });

    } catch (err) {
        loadingOverlay.style.display = 'none';
        console.error(err);
        Swal.fire({
            title: 'Error!',
            text: 'An error occurred during PDF generation.',
            icon: 'error',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#ef4444'
        });
    }
});

// Quick Sorting PRO Features
document.getElementById('sort-az-btn').addEventListener('click', () => {
    selectedImages.sort((a, b) => {
        const nameA = a.file.name.toLowerCase();
        const nameB = b.file.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    renderPreview();
});

document.getElementById('reverse-btn').addEventListener('click', () => {
    selectedImages.reverse();
    renderPreview();
});
