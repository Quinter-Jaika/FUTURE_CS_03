from flask import Flask, render_template, request, send_file, flash, redirect, url_for
import os
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet
import base64
from hashlib import sha256

app = Flask(__name__,
            static_folder='static',  # This is default
            static_url_path='/static'  # This is default
)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Make sure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Handle file upload
        if 'file' not in request.files:
            flash('No file selected', 'error')
            return redirect(request.url)
        
        files = request.files.getlist('file')
        encrypt = request.form.get('encrypt')
        password = request.form.get('password')
        
        for file in files:
            if file.filename == '':
                continue
            
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            if encrypt:
                # Encrypt the file
                encrypted_filename = encrypt_file(filepath, password)
                flash(f'File {filename} encrypted and uploaded', 'success')
            else:
                flash(f'File {filename} uploaded successfully', 'success')
        
        return redirect(url_for('download_list'))
    
    return render_template('upload.html')

@app.route('/download')
def download_list():
    # Get list of files in upload folder
    files = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(filepath):
            size = os.path.getsize(filepath)
            # Check if file is encrypted (has .enc extension)
            encrypted = filename.endswith('.enc')
            files.append({
                'name': filename,
                'size': format_size(size),
                'encrypted': encrypted,
                'type': get_file_type(filename)
            })
    
    return render_template('download.html', files=files)

@app.route('/download/<filename>')
def download_file(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    flash('File not found', 'error')
    return redirect(url_for('download_list'))

@app.route('/decrypt/<filename>', methods=['GET', 'POST'])
def decrypt_file(filename):
    if request.method == 'GET':
        return render_template('decrypt.html', filename=filename)
    
    elif request.method == 'POST':
        password = request.form.get('password')
        if not password:
            flash('Password is required', 'error')
            return redirect(url_for('decrypt_file', filename=filename))
        
        try:
            # Decryption logic
            encrypted_filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            if not os.path.exists(encrypted_filepath):
                flash('File not found', 'error')
                return redirect(url_for('download_list'))
            
            # Generate key from password
            key = sha256(password.encode()).digest()
            fernet = Fernet(base64.urlsafe_b64encode(key))
            
            # Read encrypted file
            with open(encrypted_filepath, 'rb') as f:
                encrypted_data = f.read()
            
            # Decrypt
            decrypted_data = fernet.decrypt(encrypted_data)
            
            # Original filename (remove .enc extension)
            original_filename = filename[:-4] if filename.endswith('.enc') else filename
            decrypted_filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"decrypted_{original_filename}")
            
            # Save decrypted file
            with open(decrypted_filepath, 'wb') as f:
                f.write(decrypted_data)
            
            # Send for download
            return send_file(
                decrypted_filepath,
                as_attachment=True,
                download_name=original_filename
            )
            
        except Exception as e:
            flash(f'Decryption failed: Incorrect password or corrupted file', 'error')
            return redirect(url_for('decrypt_file', filename=filename))

@app.route('/delete/<filename>', methods=['POST'])
def delete_file(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        flash(f'File {filename} deleted successfully', 'success')
    else:
        flash('File not found', 'error')
    return redirect(url_for('download_list'))

@app.route('/encrypt/<filename>', methods=['POST'])
def encrypt_file_route(filename):
    password = request.form.get('password')
    if not password:
        flash('Password is required for encryption', 'error')
        return redirect(url_for('download_list'))
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(filepath):
            flash('File not found', 'error')
            return redirect(url_for('download_list'))
        
        # Generate key from password
        key = sha256(password.encode()).digest()
        fernet = Fernet(base64.urlsafe_b64encode(key))
        
        # Read original file
        with open(filepath, 'rb') as f:
            original_data = f.read()
        
        # Encrypt
        encrypted_data = fernet.encrypt(original_data)
        
        # Save encrypted file
        encrypted_filename = filename + '.enc'
        encrypted_filepath = os.path.join(app.config['UPLOAD_FOLDER'], encrypted_filename)
        
        with open(encrypted_filepath, 'wb') as f:
            f.write(encrypted_data)
        
        # Optionally delete original file
        # os.remove(filepath)
        
        flash(f'File {filename} encrypted successfully', 'success')
        return redirect(url_for('download_list'))
        
    except Exception as e:
        flash(f'Encryption failed: {str(e)}', 'error')
        return redirect(url_for('download_list'))

# Helper functions
def format_size(size_in_bytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_in_bytes < 1024.0:
            return f"{size_in_bytes:.2f} {unit}"
        size_in_bytes /= 1024.0
    return f"{size_in_bytes:.2f} TB"

def get_file_type(filename):
    ext = filename.split('.')[-1].lower()
    if ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']:
        return 'images'
    elif ext in ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md']:
        return 'documents'
    elif ext in ['zip', 'rar', '7z', 'tar', 'gz']:
        return 'archives'
    else:
        return 'other'
    

@app.route('/debug/routes')
def debug_routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods))
        line = f"{rule.endpoint}: {rule.rule} [{methods}]"
        output.append(line)
    return '<pre>' + '\n'.join(sorted(output)) + '</pre>'

if __name__ == '__main__':
    app.run(debug=True)