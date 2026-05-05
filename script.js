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
        const fileName = document.getElementById('file-name').value.trim() || 'Document_Converted';

        let pdf;

        for (let i = 0; i < selectedImages.length; i++) {
            const imgObj = selectedImages[i];

            // Abstract load behavior over Promises for awaiting
            const img = new Image();
            img.src = imgObj.imgData;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            let pdfWidth = 210; // A4 default width (mm)
            let pdfHeight = 297; // A4 default height (mm)

            if (pageSize === 'letter') {
                pdfWidth = 215.9;
                pdfHeight = 279.4;
            } else if (pageSize === 'fit') {
                // Convert pixels to robust mm approximation
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
                // Swap dimensions if they don't match the forced orientation (for standard sizes like A4)
                if ((currentOrientation === 'p' && pdfWidth > pdfHeight) ||
                    (currentOrientation === 'l' && pdfHeight > pdfWidth)) {
                    const temp = pdfWidth;
                    pdfWidth = pdfHeight;
                    pdfHeight = temp;
                }
            }

            if (i === 0) {
                pdf = new jsPDF({
                    orientation: currentOrientation,
                    unit: 'mm',
                    format: pageSize === 'fit' ? [pdfWidth, pdfHeight] : pageSize
                });
            } else {
                pdf.addPage(pageSize === 'fit' ? [pdfWidth, pdfHeight] : pageSize, currentOrientation);
            }

            // Maintain Aspect Ratios securely bounded within pages
            const imgRatio = img.width / img.height;
            const pdfRatio = (pdfWidth - marginStyle * 2) / (pdfHeight - marginStyle * 2);

            let renderWidth = pdfWidth - marginStyle * 2;
            let renderHeight = pdfHeight - marginStyle * 2;
            let xIndex = marginStyle;
            let yIndex = marginStyle;

            if (pageSize !== 'fit') {
                if (imgRatio > pdfRatio) {
                    renderHeight = renderWidth / imgRatio;
                    yIndex = marginStyle + ((pdfHeight - marginStyle * 2 - renderHeight) / 2);
                } else {
                    renderWidth = renderHeight * imgRatio;
                    xIndex = marginStyle + ((pdfWidth - marginStyle * 2 - renderWidth) / 2);
                }
            }

            // Utilize jspdf image placement API
            let finalImgData = imgObj.imgData;

            // Compress Image via canvas (Downscaling for 100-200kb)
            if (compressionQuality < 1.0 || img.src.includes('image/png')) {
                const canvas = document.createElement('canvas');
                let targetWidth = img.width;
                let targetHeight = img.height;

                // Aggressive downsizing for Super Compress (100kb - 200kb)
                if (compressionQuality <= 0.15) {
                    const maxDim = 700; // Force max 700px on longest side for tiny file size
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
                ctx.fillStyle = "#FFFFFF"; // Prevent transparent PNG black backgrounds
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                // Convert to JPEG with specified quality
                finalImgData = canvas.toDataURL('image/jpeg', compressionQuality);
            }

            pdf.addImage(finalImgData, 'JPEG', xIndex, yIndex, renderWidth, renderHeight);
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
