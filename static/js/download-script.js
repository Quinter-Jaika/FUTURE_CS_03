// Download page specific functionality with encryption support
document.addEventListener('DOMContentLoaded', function() {
    // File search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }

    // Select all functionality
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', handleSelectAll);
    }

    // Clear selection
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
    }

    // Delete button event listeners
    setupDeleteButtons();

    // Encrypt button event listeners
    setupEncryptButtons();

    // Modal event listeners
    setupModalEvents();

    // Add visual feedback for download buttons
    setupDownloadButtonFeedback();

    // Update file icons based on file types
    updateFileIcons();

    // Initialize file selection
    initFileSelection();
});

// Initialize file selection
function initFileSelection() {
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn')) {
                this.classList.toggle('selected');
                updateSelectedCount();
                updateBulkEncryptButton();
            }
        });
    });
}

// Update selected count
function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.file-card.selected').length;
    const selectedCountElement = document.getElementById('selectedCount');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    
    if (selectedCountElement) {
        selectedCountElement.textContent = selectedCount;
    }
    
    if (clearSelectionBtn) {
        clearSelectionBtn.style.display = selectedCount > 0 ? 'block' : 'none';
    }
}

// Update bulk encrypt button
function updateBulkEncryptButton() {
    const bulkEncryptBtn = document.getElementById('bulkEncryptBtn');
    const selectedCards = document.querySelectorAll('.file-card.selected');
    const hasUnencrypted = Array.from(selectedCards).some(card => 
        card.getAttribute('data-encrypted') === 'false'
    );
    
    if (bulkEncryptBtn) {
        bulkEncryptBtn.style.display = hasUnencrypted ? 'block' : 'none';
    }
}

// Clear selection
function clearSelection() {
    const selectedCards = document.querySelectorAll('.file-card.selected');
    selectedCards.forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedCount();
    updateBulkEncryptButton();
}

// Handle file search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const fileCards = document.querySelectorAll('.file-card');
    
    fileCards.forEach(card => {
        const fileName = card.querySelector('.file-name').textContent.toLowerCase();
        if (fileName.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle filter
function handleFilter(e) {
    const filterValue = e.target.value;
    const fileCards = document.querySelectorAll('.file-card');
    
    fileCards.forEach(card => {
        const fileType = card.getAttribute('data-type');
        const isEncrypted = card.getAttribute('data-encrypted') === 'true';
        const fileName = card.querySelector('.file-name').textContent.toLowerCase();
        
        let show = true;
        
        switch (filterValue) {
            case 'encrypted':
                show = isEncrypted;
                break;
            case 'unencrypted':
                show = !isEncrypted;
                break;
            case 'images':
                show = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].some(ext => 
                    fileName.endsWith('.' + ext)
                );
                break;
            case 'documents':
                show = ['pdf', 'doc', 'docx', 'txt', 'rtf'].some(ext => 
                    fileName.endsWith('.' + ext)
                );
                break;
            case 'archives':
                show = ['zip', 'rar', '7z', 'tar', 'gz'].some(ext => 
                    fileName.endsWith('.' + ext)
                );
                break;
        }
        
        card.style.display = show ? 'flex' : 'none';
    });
}

// Handle select all functionality
function handleSelectAll() {
    const visibleCards = document.querySelectorAll('.file-card[style*="flex"], .file-card:not([style])');
    visibleCards.forEach(card => {
        card.classList.add('selected');
    });
    updateSelectedCount();
    updateBulkEncryptButton();
}

// Setup delete button event listeners
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn[data-filename]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const filename = this.getAttribute('data-filename');
            confirmDelete(filename);
        });
    });
}

// Setup encrypt button event listeners
function setupEncryptButtons() {
    const encryptButtons = document.querySelectorAll('.encrypt-btn[data-filename]');
    encryptButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const filename = this.getAttribute('data-filename');
            showEncryptModal(filename);
        });
    });
    
    // Bulk encrypt button
    const bulkEncryptBtn = document.getElementById('bulkEncryptBtn');
    if (bulkEncryptBtn) {
        bulkEncryptBtn.addEventListener('click', showBulkEncryptModal);
    }
}

// Show encrypt modal
function showEncryptModal(filename) {
    document.getElementById('encryptFileName').textContent = filename;
    document.getElementById('encryptModal').style.display = 'block';
    
    // Set up modal events
    const modal = document.getElementById('encryptModal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-encrypt');
    const confirmBtn = document.getElementById('confirmEncryptBtn');
    
    // Password toggle for modal
    const passwordToggle = modal.querySelector('#encryptPasswordToggle');
    const passwordInput = modal.querySelector('#encryptPassword');
    const confirmInput = modal.querySelector('#confirmPassword');
    
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            confirmInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : 
                '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Close modal
    const closeModal = function() {
        modal.style.display = 'none';
        passwordInput.value = '';
        confirmInput.value = '';
    };
    
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Confirm encryption
    confirmBtn.onclick = function() {
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;
        
        if (!password) {
            alert('Please enter a password');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        // Submit encryption form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/encrypt/${filename}`;
        
        const passwordField = document.createElement('input');
        passwordField.type = 'hidden';
        passwordField.name = 'password';
        passwordField.value = password;
        
        form.appendChild(passwordField);
        document.body.appendChild(form);
        form.submit();
        
        closeModal();
    };
}

// Show bulk encrypt modal
function showBulkEncryptModal() {
    const selectedCards = document.querySelectorAll('.file-card.selected');
    const unencryptedFiles = Array.from(selectedCards)
        .filter(card => card.getAttribute('data-encrypted') === 'false')
        .map(card => card.querySelector('.file-name').textContent);
    
    if (unencryptedFiles.length === 0) {
        alert('No unencrypted files selected');
        return;
    }
    
    // For now, we'll encrypt them one by one
    // In a real app, you might want to implement bulk encryption
    alert(`Selected ${unencryptedFiles.length} files for encryption. Please encrypt them individually for security.`);
}

// Confirm file deletion
function confirmDelete(filename) {
    document.getElementById('fileNameToDelete').textContent = filename;
    document.getElementById('deleteForm').action = `/delete/${filename}`;
    document.getElementById('deleteModal').style.display = 'block';
}

// Setup modal events
function setupModalEvents() {
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteBtn = deleteModal?.querySelector('.close-modal');
    const cancelDeleteBtn = deleteModal?.querySelector('.cancel-delete');
    
    if (closeDeleteBtn) {
        closeDeleteBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
}

// Setup download button visual feedback
function setupDownloadButtonFeedback() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            this.classList.add('selected');
            setTimeout(() => {
                this.classList.remove('selected');
            }, 1000);
        });
    });
}

// Update file icons based on file types
function updateFileIcons() {
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
        const fileName = card.querySelector('.file-name').textContent;
        const iconClass = getFileIcon(fileName);
        const iconElement = card.querySelector('.file-icon i');
        if (iconElement) {
            iconElement.className = `fas fa-${iconClass}`;
        }
    });
}

// Get appropriate icon class based on file extension
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'pdf': 'file-pdf',
        'jpg': 'file-image',
        'jpeg': 'file-image',
        'png': 'file-image',
        'gif': 'file-image',
        'bmp': 'file-image',
        'doc': 'file-word',
        'docx': 'file-word',
        'xls': 'file-excel',
        'xlsx': 'file-excel',
        'ppt': 'file-powerpoint',
        'pptx': 'file-powerpoint',
        'zip': 'file-archive',
        'rar': 'file-archive',
        'tar': 'file-archive',
        'gz': 'file-archive',
        'txt': 'file-alt',
        'csv': 'file-csv',
        'html': 'file-code',
        'css': 'file-code',
        'js': 'file-code',
        'py': 'file-code',
        'json': 'file-code',
        'xml': 'file-code',
        'mp3': 'file-audio',
        'wav': 'file-audio',
        'mp4': 'file-video',
        'avi': 'file-video'
    };
    return iconMap[extension] || 'file';
}