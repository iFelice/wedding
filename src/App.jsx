import React, { useState } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  
  // Funzione per cambiare pagina
  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 onClick={() => navigateTo('welcome')}>
          Matrimonio Felice & Federica
        </h1>
      </header>
      
      <main>
        {currentPage === 'welcome' && (
          <WelcomePage navigateTo={navigateTo} />
        )}
        
        {currentPage === 'upload' && (
          <UploadForm />
        )}
        
        {currentPage === 'gallery' && (
          <Gallery />
        )}
      </main>
      
      <nav>
        <button onClick={() => navigateTo('welcome')}>Home</button>
        <button onClick={() => navigateTo('upload')}>Carica Foto</button>
        <button onClick={() => navigateTo('gallery')}>Galleria</button>
      </nav>
    </div>
  );
}

export default App;