import React from 'react';

function WelcomePage({ navigateTo }) {
  return (
    <div className="welcome-page">
      <h1>Benvenuti alla Galleria del Matrimonio</h1>
      <h2>Felice & Federica</h2>
      <p>Condividi con noi i momenti speciali del nostro matrimonio.<br/>
      Le vostre foto saranno parte dei nostri ricordi più preziosi.</p>
      <div className="button-container">
        <button onClick={() => navigateTo('upload')}>Carica Foto</button>
        <button onClick={() => navigateTo('gallery')}>Sfoglia Galleria</button>
      </div>
    </div>
  );
}

export default WelcomePage;