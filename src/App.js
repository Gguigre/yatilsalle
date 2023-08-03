import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '627921590766-95uqkbkc7ic29fcrbtc9nb61f8bp3i3g.apps.googleusercontent.com',
          callback: handleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('buttonDiv'),
          { theme: 'outline', size: 'large' }  // options
        );
        clearInterval(interval);
      }
    }, 100);
  }, []);

  const handleLogin = (response) => {
    if (response.credential) {
      console.log(response.credential)
      // L'utilisateur s'est connecté avec succès
      // Tu peux utiliser response.credential pour faire des requêtes à l'API Google Calendar
    } else {
      console.warn('Erreur lors de la connexion');
      // L'utilisateur n'a pas réussi à se connecter
    }
  };

  return (
    <div className="App">
      <div id="buttonDiv"></div>
    </div>
  );
}

export default App;
