import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiUrl from './apiConfig';
import './DietPage.css';

const DietPage = ({ isAdmin, token, userId: currentUserId }) => {
  const { userId } = useParams();
  const [dietNotes, setDietNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDietNotes = useCallback(async () => {
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${userId}/notes`, {
        headers: { 'x-auth-token': fetchToken },
      });
      if (!res.ok) {
        if (res.status === 404) {
          setDietNotes(''); // No notes found, initialize as empty
          return;
        }
        throw new Error('Could not fetch diet notes');
      }
      const data = await res.json();
      setDietNotes(data.notes || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDietNotes();
  }, [fetchDietNotes]);

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    const fetchToken = localStorage.getItem('token');
    const method = dietNotes ? 'PUT' : 'POST';
    const url = dietNotes ? `${apiUrl}/api/diet/${userId}/notes` : `${apiUrl}/api/diet/notes`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': fetchToken,
        },
        body: JSON.stringify({ userId, notes: dietNotes }),
      });
      if (!res.ok) throw new Error('Could not save diet notes');
      await fetchDietNotes(); // Re-fetch to ensure consistency
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="diet-container">
      <h2>Notes de régime pour l'utilisateur {userId}</h2>

      {isAdmin ? (
        <form onSubmit={handleSaveNotes} className="diet-notes-form">
          <textarea
            name="dietNotes"
            value={dietNotes}
            onChange={(e) => setDietNotes(e.target.value)}
            placeholder="Saisissez vos notes de régime ici..."
            rows="10"
          ></textarea>
          <button type="submit">Enregistrer les notes</button>
        </form>
      ) : (
        <div className="diet-notes-display">
          <h3>Vos notes:</h3>
          <p>{dietNotes || "Aucune note de régime disponible."}</p>
        </div>
      )}
    </div>
  );
};

export default DietPage;
