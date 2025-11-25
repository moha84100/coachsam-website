import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiUrl from './apiConfig';
import './DietPage.css';

const DietPage = () => {
  const { userId } = useParams();
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    repas: '',
    aliments: '',
    quantité: '',
    heure: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDietPlans = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${userId}`, {
        headers: { 'x-auth-token': token },
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDiet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ ...formData, userId }),
      });
      if (!res.ok) throw new Error('Could not add diet plan');
      await fetchDietPlans();
      setFormData({ repas: '', aliments: '', quantité: '', heure: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDiet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Could not update diet plan');
      await fetchDietPlans();
      setFormData({ repas: '', aliments: '', quantité: '', heure: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDiet = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/diet/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Could not delete diet plan');
      await fetchDietPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (plan) => {
    setFormData({
      repas: plan.repas,
      aliments: plan.aliments,
      quantité: plan.quantité,
      heure: plan.heure,
    });
    setEditingId(plan._id);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="diet-container">
      <h2>Plan de régime pour l'utilisateur {userId}</h2>

      <form onSubmit={editingId ? handleUpdateDiet : handleAddDiet} className="diet-form">
        <input name="repas" value={formData.repas} onChange={handleChange} placeholder="Repas" required />
        <input name="aliments" value={formData.aliments} onChange={handleChange} placeholder="Aliments" required />
        <input name="quantité" value={formData.quantité} onChange={handleChange} placeholder="Quantité" required />
        <input name="heure" value={formData.heure} onChange={handleChange} placeholder="Heure" required />
        <button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setFormData({ repas: '', aliments: '', quantité: '', heure: '' }); }}>Annuler</button>}
      </form>

      <table className="diet-table">
        <thead>
          <tr>
            <th>Repas</th>
            <th>Aliments</th>
            <th>Quantité</th>
            <th>Heure</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dietPlans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.repas}</td>
              <td>{plan.aliments}</td>
              <td>{plan.quantité}</td>
              <td>{plan.heure}</td>
              <td>
                <button onClick={() => startEditing(plan)}>Modifier</button>
                <button onClick={() => handleDeleteDiet(plan._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DietPage;
