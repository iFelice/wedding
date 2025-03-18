import React, { useState, useEffect } from 'react';
import { database, ref, onValue, remove } from '../firebaseconfig.js';

function Gallery() {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = () => {
        setLoading(true);
        const mediaListRef = ref(database, 'media');  // riferimento al nodo 'media'

        onValue(mediaListRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Converti l'oggetto in un array
                const mediaArray = Object.keys(data).map(key => ({
                    ...data[key],
                    firebaseKey: key // Salva la chiave univoca di Firebase per l'eliminazione
                })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ordina per timestamp

                setMedia(mediaArray);
            } else {
                setMedia([]); // Nessun media trovato
            }
            setLoading(false);
        }, {
            onlyOnce: false // ascolta le modifiche future
        });
    };

    const openMedia = (item, index) => {
        setSelectedMedia(item);
        setCurrentIndex(index);
    };

    const closeMedia = () => {
        setSelectedMedia(null);
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex - 1 + media.length) % media.length;
        setCurrentIndex(newIndex);
        setSelectedMedia(media[newIndex]);
    };

    const nextMedia = (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex + 1) % media.length;
        setCurrentIndex(newIndex);
        setSelectedMedia(media[newIndex]);
    };

    const deleteMedia = (item) => { // prendi l'item completo, non solo l'id
        if (confirm('Sei sicuro di voler eliminare questo elemento?')) {
            const mediaRef = ref(database, `media/${item.firebaseKey}`); // Usa firebaseKey per eliminare
            remove(mediaRef)
                .then(() => {
                    console.log(`Elemento con ID ${item.id} eliminato con successo.`);
                    closeMedia();  // Chiudi il visualizzatore se stavi visualizzando l'elemento eliminato
                })
                .catch(error => {
                    console.error("Errore durante l'eliminazione:", error);
                    alert("Errore durante l'eliminazione. Controlla la console.");
                });
        }
    };

    return (
        <div className="gallery-container">
            <h2>Galleria Fotografica</h2>

            {loading ? (
                <div className="loading">Caricamento in corso...</div>
            ) : media.length === 0 ? (
                <div className="no-media">Nessuna foto caricata</div>
            ) : (
                <div className="media-grid">
                    {media.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="media-item"
                            style={{ backgroundColor: item.color || '#f0f0f0' }}
                            onClick={() => openMedia(item, index)}
                        >
                            {item.url && (item.type === 'video' ? (
                                <div className="thumbnail video-thumbnail">
                                    <video src={item.url} />
                                    <div className="play-indicator">▶</div>
                                </div>
                            ) : (
                                <div className="thumbnail">
                                    <img src={`${item.url}?tr=q_auto,f_auto`} alt={`Immagine di ${item.userName || 'Ospite'}`} />
                                </div>
                            ))}
                            {!item.url && (
                                <div className="placeholder">Immagine non disponibile</div>
                            )}
                            <div className="user-info">{item.userName || 'Ospite'}</div>
                        </div>
                    ))}
                </div>
            )}

            {selectedMedia && (
                <div className="media-viewer" onClick={closeMedia}>
                    <div className="navigation prev" onClick={prevMedia}>❮</div>

                    <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
                        {selectedMedia.url ? (
                            selectedMedia.type === 'video' ? (
                                <video src={selectedMedia.url} controls autoPlay />
                            ) : (
                                <img src={selectedMedia.url} alt="Immagine a schermo intero" />
                            )
                        ) : (
                            <div className="placeholder">Contenuto non disponibile</div>
                        )}

                        <div className="media-info">
                            Caricato da: {selectedMedia.userName || 'Ospite'}
                            <button
                                className="delete-button"
                                onClick={() => deleteMedia(selectedMedia)} // Passa l'item intero
                            >
                                Elimina
                            </button>
                        </div>
                    </div>

                    <div className="navigation next" onClick={nextMedia}>❯</div>
                    <div className="close-button" onClick={closeMedia}>×</div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
