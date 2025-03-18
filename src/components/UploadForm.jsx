// UploadForm.jsx
import React, { useState, useEffect } from 'react';
import { database, ref, push } from '../firebaseconfig.js';
import { v4 as uuidv4 } from 'uuid';

function UploadForm() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        console.log('Variabili disponibili:', import.meta.env);
        console.log('Cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        console.log('Upload preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        selectedFiles.forEach(file => {
            console.log('Nome file:', file.name);
            console.log('Tipo file:', file.type);
        });
    };

    const uploadFileWithProgress = (file, cloudName, uploadPreset, userName) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            formData.append('file', file, file.name); // Includi il nome del file
            formData.append('upload_preset', uploadPreset);
            formData.append('tags', userName);
            //RIMUOVI QUESTA RIGA formData.append('transformation', 'f_auto,q_auto:best');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const fileProgress = Math.round((e.loaded / e.total) * 100);
                    console.log(`File ${file.name}: ${fileProgress}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log(response);
                    resolve(response);
                } else {
                    reject(new Error('Errore durante l\'upload'));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Errore di rete'));
            };

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`, true);
            xhr.send(formData);
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('Seleziona almeno una foto per continuare');
            return;
        }

        if (!userName.trim()) {
            alert('Inserisci il tuo nome per continuare');
            return;
        }

        setUploading(true);
        setProgress(0);

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error('Variabili Cloudinary non configurate:', { cloudName, uploadPreset });
            alert('Configurazione Cloudinary mancante. Controlla la console per dettagli.');
            setUploading(false);
            return;
        }

        console.log('Iniziando upload con:', { cloudName, uploadPreset });

        const totalFiles = files.length;
        let uploadedCount = 0;

        for (const file of files) {
            try {
                console.log('Caricamento file:', file.name);

                const data = await uploadFileWithProgress(file, cloudName, uploadPreset, userName);

                const fileType = file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : 'unknown';

                const mediaData = {
                    id: uuidv4(),
                    url: data.secure_url,
                    userName: userName,
                    timestamp: new Date().toISOString(),
                    type: fileType,
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
                };

                const mediaListRef = ref(database, 'media');
                push(mediaListRef, mediaData);

                uploadedCount++;
                setProgress(Math.round((uploadedCount / totalFiles) * 100));
            } catch (error) {
                console.error('Errore dettagliato:', error);
                alert(`Errore: ${error.message}`);
                setUploading(false);
                return;
            }
        }

        setUploading(false);
        alert('Tutte le foto sono state caricate con successo!');
        setFiles([]);
        setUserName('');
    };

    return (
        <div className="upload-form">
            <h2>Carica le tue foto del matrimonio</h2>

            <div className="form-group">
                <label htmlFor="userName">Il tuo nome:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Inserisci il tuo nome"
                    disabled={uploading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="photos">Seleziona foto e video:</label>
                <input
                    type="file"
                    id="photos"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <p className="file-info">
                    File selezionati: {files.length}
                </p>
            </div>

            {uploading ? (
                <div style={{
                    width: '100%',
                    height: '24px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    margin: '15px 0',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#4CAF50',
                        transition: 'width 0.3s ease'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        top: '50%',
                        left: '0',
                        transform: 'translateY(-50%)',
                        color: '#333',
                        fontWeight: 'bold',
                        zIndex: '10'
                    }}>
                        Caricamento in corso... {progress}%
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || !userName.trim()}
                >
                    Carica File
                </button>
            )}
        </div>
    );
}

export default UploadForm;
