import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiUrl from './apiConfig';
import './DietPage.css';

const DietPage = ({ isAdmin, token, userId: currentUserId }) => {
  const { userId } = useParams();
  const [dietNotes, setDietNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Chargement du nom...');

  const fetchUserName = useCallback(async () => {
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/users/${userId}`, {
          headers: { 'x-auth-token': fetchToken },
      });

      if (!res.ok) {
          // If the user being viewed is the current user, try to get their name from local storage
          // This assumes the name is stored during login, which is good practice.
          if (userId === currentUserId) {
            const storedUserName = localStorage.getItem('userName'); // Assuming 'userName' is stored
            if (storedUserName) {
              setUserName(storedUserName);
              return;
            }
          }
          setUserName('Utilisateur Inconnu');
          return;
      }
      const userData = await res.json();
      setUserName(userData.name || 'Utilisateur Inconnu');
    } catch (err) {
      console.error("Error fetching user name:", err);
      // Fallback to local storage if API call fails for current user
      if (userId === currentUserId) {
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        } else {
          setUserName('Utilisateur Inconnu');
        }
      } else {
        setUserName('Utilisateur Inconnu');
      }
    }
  }, [userId, currentUserId]);


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
    fetchUserName();
  }, [fetchDietNotes, fetchUserName]);

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    const fetchToken = localStorage.getItem('token');
    // Backend uses POST for both creating and updating diet notes
    const method = 'POST';
    const url = `${apiUrl}/api/diet/notes`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': fetchToken,
        },
        body: JSON.stringify({ userId, notes: dietNotes }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.msg || 'Could not save diet notes');
      }

      alert('Notes de régime enregistrées avec succès !');
      await fetchDietNotes(); // Re-fetch to ensure consistency
    } catch (err) {
      console.error('Save diet notes error:', err);
      setError(`Erreur lors de l'enregistrement: ${err.message}`);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="diet-container">
      <h2>Notes de régime pour {userName}</h2>

      {isAdmin || (userId === currentUserId) ? ( // Allow current user to edit their own notes
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
