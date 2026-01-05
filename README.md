# 🔐 Secure File Sharing System

A secure file sharing web application with AES-256 encryption built with Python Flask. <br>This system allows users to upload, encrypt, download, and manage files securely with military-grade encryption.

## 🚀 Features

### 🔒 Security Features
- **AES-256 Encryption**: Military-grade encryption for maximum security
- **Password Protection**: Custom passwords for encrypted files
- **Secure File Handling**: Files encrypted before storage
- **No Password Recovery**: Zero-knowledge architecture
- **Local Storage Only**: Files stored locally on the server

### 📁 File Management
- **Multi-file Upload**: Upload multiple files at once (up to 16MB each)
- **Drag & Drop**: Intuitive drag-and-drop interface
- **File Preview**: Visual file icons and metadata display
- **Search & Filter**: Search files and filter by type/encryption status
- **Bulk Operations**: Select multiple files for batch operations

### 🔄 Encryption/Decryption
- **On-demand Encryption**: Encrypt existing files anytime
- **Secure Decryption**: Password-protected file access
- **Automatic Cleanup**: Temporary files removed after download
- **Encryption Indicators**: Visual cues for encrypted files

## 🛠️ Technology Stack

### Backend
- **Python Flask**: Web framework
- **PyCryptodome**: AES-256 encryption implementation
- **Werkzeug**: File handling and security
- **Jinja2**: Template engine

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript**: Interactive UI components
- **Font Awesome**: Icon library
- **Responsive Design**: Works on all devices

### Security
- **AES-256-CBC**: Encryption algorithm
- **PBKDF2**: Password-based key derivation
- **HMAC-SHA256**: Message authentication
- **Secure Random**: Salt and IV generation

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/secure-file-sharing.git
cd secure-file-sharing
```

### Step 2 : Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Step 3 : Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4 : Configure Application
```bash
# Create .env file (optional)
echo "SECRET_KEY=your-secret-key-here" > .env
echo "MAX_FILE_SIZE=16777216" >> .env
```

### Step 5 : Run the  Application
```bash
# Create .env file (optional)
echo "SECRET_KEY=your-secret-key-here" > .env
echo "MAX_FILE_SIZE=16777216" >> .env
```

### Step 6 : Access Application
Visit http://127.0.0.1:5000 in your browser.


### Project Structure
```text
secure-file-sharing/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (optional)
│
├── uploads/               # Uploaded files directory
├── encrypted/             # Encrypted files directory
│
├── templates/             # HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   ├── upload.html       # File upload page
│   ├── download.html     # File management page
│   └── decrypt.html      # File decryption page
│
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Stylesheet
    └── js/
        ├── script.js     # Main JavaScript
        ├── upload-script.js
        ├── download-script.js
        └── encryption.js
```

## Configuration
Create a .env file in the project root:

```env
SECRET_KEY=your-secret-key-here
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216  # 16MB
DEBUG=False  # Set to True for development
```

### File Limits
- Maximum file size: 16MB per file
- Supported formats: All file types
- Storage location: Local uploads/ directory
- Encryption: Optional for each file

## 🎯 Usage Guide
1. Uploading Files
- Navigate to the Upload page
- Drag & drop files or click "Browse Files"
- (Optional) Enable encryption and set a password
- Click "Upload Files"

2. Managing Files
- Go to the Download page
- View all uploaded files
- Use search and filters to find files
- Download, encrypt, or delete files as needed

3. Encrypting Files
- On the Download page, click "Encrypt" on any unencrypted file
- Enter a strong password (min. 8 characters)
- Confirm the password
- The file will be encrypted with AES-256

4. Decrypting Files
- Click "Decrypt & Download" on encrypted files
- Enter the correct password
- The file will be decrypted and downloaded automatically
- Temporary files are cleaned up after download

## 🆘 Support
### Common Issues
- "Method Not Allowed": Check route definitions in app.py
- File upload fails: Verify file size and permissions
- Encryption/decryption fails: Check password and file integrity

### 🙏 Acknowledgments
- Flask Team for the excellent web framework
- PyCryptodome for robust encryption implementation
- Font Awesome for beautiful icons
- Future Interns for the project inspiration