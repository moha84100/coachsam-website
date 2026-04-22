import React, { useState } from 'react';
import './Auth.css';
import apiUrl from './apiConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.msg);
      } else {
        setError(data.msg);
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Coach Sam Logo" className="auth-logo" />
        <h2>Mot de passe oublié</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Entrez votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Envoyer le lien</button>
        </form>
        {message && <p className="success-message" style={{color: 'green', marginTop: '1rem'}}>{message}</p>}
        {error && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
