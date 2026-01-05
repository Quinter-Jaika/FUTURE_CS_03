// Upload Page JavaScript with encryption support - FIXED
document.addEventListener('DOMContentLoaded', function() {
    console.log("Upload page loaded - encryption support enabled");
    
    // DOM Elements
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const fileListDiv = document.getElementById('fileList');
    const fileCountSpan = document.getElementById('fileCount');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressText = document.getElementById('progressText');
    const progressBarFill = document.getElementById('progressBar');
    const uploadStatus = document.getElementById('uploadStatus');
    const encryptionIcon = document.getElementById('encryptionIcon');
    const statusText = document.getElementById('statusText');
    
    // Encryption elements
    const encryptToggle = document.getElementById('encryptToggle');
    const passwordSection = document.getElementById('passwordSection');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    
    let selectedFiles = [];
    let willEncrypt = false;
    
    // Initialize encryption toggle
    if (encryptToggle) {
        console.log("Encryption toggle found");
        encryptToggle.addEventListener('change', function() {
            willEncrypt = this.checked;
            console.log("Encryption toggled:", willEncrypt);
            if (willEncrypt) {
                passwordSection.style.display = 'block';
                passwordInput.focus();
            } else {
                passwordSection.style.display = 'none';
                passwordInput.value = '';
            }
        });
    } else {
        console.error("Encryption toggle NOT found!");
    }
    
    // Password toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSelection);
    }
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    }
    
    function unhighlight(e) {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        
        const dt = e.dataTransfer;
        const files = dt.files;
        
        console.log("Files dropped:", files.length);
        
        if (files.length > 0) {
            // Update the file input with dropped files
            const dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            fileInput.files = dataTransfer.files;
            
            // Process the files
            handleFiles(files);
        }
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        console.log("Files selected:", files.length);
        handleFiles(files);
    }
    
    function handleFiles(files) {
        // Add new files to the list
        const newFiles = Array.from(files);
        selectedFiles = [...selectedFiles, ...newFiles];
        updateSelectedFilesDisplay();
    }
    
    function updateSelectedFilesDisplay() {
        fileListDiv.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            selectedFilesDiv.style.display = 'none';
            uploadBtn.disabled = true;
            fileCountSpan.textContent = '0 files';
            return;
        }
        
        selectedFilesDiv.style.display = 'block';
        uploadBtn.disabled = false;
        fileCountSpan.textContent = `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`;
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-item-icon">
                    <i class="fas ${getFileIcon(file.name)}"></i>
                </div>
                <div class="file-item-info">
                    <div class="file-item-name">${file.name}</div>
                    <div class="file-item-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="file-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileListDiv.appendChild(fileItem);
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.file-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFile(index);
            });
        });
    }
    
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        
        // Update the file input
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        fileInput.files = dataTransfer.files;
        
        updateSelectedFilesDisplay();
    }
    
    function clearSelection() {
        selectedFiles = [];
        fileInput.value = '';
        updateSelectedFilesDisplay();
        
        // Reset encryption toggle
        if (encryptToggle) {
            encryptToggle.checked = false;
            willEncrypt = false;
            passwordSection.style.display = 'none';
            passwordInput.value = '';
        }
    }
    
    function getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fa-file-pdf',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'gif': 'fa-file-image',
            'bmp': 'fa-file-image',
            'svg': 'fa-file-image',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'xls': 'fa-file-excel',
            'xlsx': 'fa-file-excel',
            'ppt': 'fa-file-powerpoint',
            'pptx': 'fa-file-powerpoint',
            'zip': 'fa-file-archive',
            'rar': 'fa-file-archive',
            '7z': 'fa-file-archive',
            'tar': 'fa-file-archive',
            'gz': 'fa-file-archive',
            'txt': 'fa-file-alt',
            'md': 'fa-file-alt',
            'csv': 'fa-file-csv',
            'mp3': 'fa-file-audio',
            'wav': 'fa-file-audio',
            'mp4': 'fa-file-video',
            'avi': 'fa-file-video',
            'mov': 'fa-file-video',
            'mkv': 'fa-file-video'
        };
        return iconMap[extension] || 'fa-file';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function validateFiles() {
        const maxSize = 16 * 1024 * 1024; // 16MB
        const invalidFiles = [];
        
        selectedFiles.forEach(file => {
            if (file.size > maxSize) {
                invalidFiles.push(`${file.name} (${formatFileSize(file.size)}) exceeds 16MB limit`);
            }
        });
        
        // Validate encryption password if enabled
        if (willEncrypt) {
            const password = passwordInput.value;
            if (!password) {
                invalidFiles.push('Encryption password is required when encryption is enabled');
            } else if (password.length < 8) {
                invalidFiles.push('Encryption password must be at least 8 characters long');
            }
        }
        
        return invalidFiles;
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        console.log("Form submission - Encryption enabled:", willEncrypt);
        
        const invalidFiles = validateFiles();
        if (invalidFiles.length > 0) {
            alert('Please fix the following errors:\n\n' + invalidFiles.join('\n'));
            return;
        }
        
        if (selectedFiles.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }
        
        // Show progress bar
        uploadProgress.style.display = 'block';
        uploadBtn.disabled = true;
        clearBtn.disabled = true;
        
        // Update status based on encryption
        if (willEncrypt) {
            if (encryptionIcon) encryptionIcon.style.display = 'inline-block';
            if (statusText) statusText.textContent = 'Encrypting files with AES-256...';
            console.log("Will encrypt files with password:", passwordInput.value.substring(0, 3) + '...');
        } else {
            if (statusText) statusText.textContent = 'Preparing files for upload...';
        }
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 90) progress = 90;
            
            if (progressText) progressText.textContent = `${progress}%`;
            if (progressBarFill) progressBarFill.style.width = `${progress}%`;
            
            // Update status message
            if (willEncrypt && statusText) {
                if (progress < 30) {
                    statusText.textContent = 'Encrypting files with AES-256...';
                } else if (progress < 60) {
                    statusText.textContent = 'Securing file data...';
                } else {
                    statusText.textContent = 'Finalizing encryption...';
                }
            }
            
            if (progress === 90) {
                clearInterval(interval);
                
                // Update final status
                if (willEncrypt && statusText) {
                    statusText.textContent = 'Encryption complete! Submitting...';
                } else if (statusText) {
                    statusText.textContent = 'Upload complete! Submitting...';
                }
                
                console.log("Submitting form...");
                
                // Actually submit the form
                setTimeout(() => {
                    uploadForm.submit();
                }, 1000);
            }
        }, 100);
    }
});