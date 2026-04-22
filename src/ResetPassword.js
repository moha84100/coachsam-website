import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Auth.css';
import apiUrl from './apiConfig';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.msg);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
        <h2>Nouveau mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
          />
          <button type="submit">Réinitialiser</button>
        </form>
        {message && <p className="success-message" style={{color: 'green', marginTop: '1rem'}}>{message}</p>}
        {error && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
