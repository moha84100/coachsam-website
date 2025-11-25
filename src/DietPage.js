import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiUrl from './apiConfig';
import './DietPage.css';

const DietPage = ({ isAdmin, token, userId: currentUserId }) => {
  const { userId } = useParams(); // userId from URL (can be current user or another user for admin)
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Lundi');
  const [formData, setFormData] = useState({
    jour: selectedDay,
    repas: '',
    aliments: '',
    quantité: '',
    heure: '',
  });
  const [editingId, setEditingId] = useState(null);

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const fetchDietPlans = useCallback(async () => {
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${userId}`, {
        headers: { 'x-auth-token': fetchToken },
      });
      if (!res.ok) throw new Error('Could not fetch diet plans');
      const data = await res.json();
      setDietPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDietPlans();
  }, [fetchDietPlans]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, jour: selectedDay }));
  }, [selectedDay]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDiet = async (e) => {
    e.preventDefault();
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': fetchToken,
        },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (!res.ok) throw new Error('Could not add diet plan');
      await fetchDietPlans();
      setFormData({ jour: selectedDay, repas: '', aliments: '', quantité: '', heure: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDiet = async (e) => {
    e.preventDefault();
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': fetchToken,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Could not update diet plan');
      await fetchDietPlans();
      setFormData({ jour: selectedDay, repas: '', aliments: '', quantité: '', heure: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDiet = async (id) => {
    const fetchToken = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': fetchToken },
      });
      if (!res.ok) throw new Error('Could not delete diet plan');
      await fetchDietPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (plan) => {
    setFormData({
      jour: plan.jour,
      repas: plan.repas,
      aliments: plan.aliments,
      quantité: plan.quantité,
      heure: plan.heure,
    });
    setEditingId(plan._id);
    setSelectedDay(plan.jour);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  const filteredDietPlans = dietPlans.filter(plan => plan.jour === selectedDay);

  return (
    <div className="diet-container">
      <h2>Plan de régime pour l'utilisateur {userId}</h2>

      <div className="day-tabs">
        {daysOfWeek.map(day => (
          <button
            key={day}
            className={`day-tab ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {isAdmin && (
        <form onSubmit={editingId ? handleUpdateDiet : handleAddDiet} className="diet-form">
          <select name="jour" value={formData.jour} onChange={handleChange} required>
            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <input name="repas" value={formData.repas} onChange={handleChange} placeholder="Repas" required />
          <input name="aliments" value={formData.aliments} onChange={handleChange} placeholder="Aliments" required />
          <input name="quantité" value={formData.quantité} onChange={handleChange} placeholder="Quantité" required />
          <input name="heure" value={formData.heure} onChange={handleChange} placeholder="Heure" required />
          <button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
          {editingId && <button onClick={() => { setEditingId(null); setFormData({ jour: selectedDay, repas: '', aliments: '', quantité: '', heure: '' }); }}>Annuler</button>}
        </form>
      )}

      <table className="diet-table">
        <thead>
          <tr>
            <th>Repas</th>
            <th>Aliments</th>
            <th>Quantité</th>
            <th>Heure</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredDietPlans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.repas}</td>
              <td>{plan.aliments}</td>
              <td>{plan.quantité}</td>
              <td>{plan.heure}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => startEditing(plan)}>Modifier</button>
                  <button onClick={() => handleDeleteDiet(plan._id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DietPage;
