import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Outils.css';

function Outils() {
  // --- STATE MANAGEMENT ---
  // Inputs
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [goal, setGoal] = useState('maintenance');

  // Results
  const [imc, setImc] = useState(null);
  const [imcCategory, setImcCategory] = useState('');
  const [calories, setCalories] = useState(null);

  // --- CALCULATIONS ---
  useEffect(() => {
    const numHeight = parseFloat(height);
    const numWeight = parseFloat(weight);
    const numAge = parseFloat(age);
    const numActivityLevel = parseFloat(activityLevel);

    // IMC Calculation
    if (numHeight > 0 && numWeight > 0) {
      const heightInMeters = numHeight / 100;
      const imcValue = numWeight / (heightInMeters * heightInMeters);
      setImc(imcValue.toFixed(2));

      if (imcValue < 18.5) setImcCategory('Maigreur');
      else if (imcValue < 24.9) setImcCategory('Poids normal');
      else if (imcValue < 29.9) setImcCategory('Surpoids');
      else setImcCategory('Obésité');
    } else {
      setImc(null);
      setImcCategory('');
    }

    // Calorie Calculation
    if (numHeight > 0 && numWeight > 0 && numAge > 0) {
      let bmr;
      if (gender === 'male') {
        bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5;
      } else {
        bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
      }

      let totalCalories = bmr * numActivityLevel;

      if (goal === 'loss') totalCalories -= 500;
      else if (goal === 'gain') totalCalories += 300;

      setCalories(totalCalories.toFixed(0));
    } else {
      setCalories(null);
    }
  }, [height, weight, age, gender, activityLevel, goal]);

  return (
    <div className="outils-page-container">
      <Link to="/" className="back-to-home-button">Retour Accueil</Link>
      <h2>Outils Gratuits</h2>
      <p>Utilisez ces calculateurs pour obtenir une première estimation de vos besoins.</p>

      <div className="calculator-grid">
        {/* Combined Inputs Card */}
        <div className="calculator-card">
          <h3>Vos Informations</h3>
          <div className="input-group">
            <label>Taille (cm)</label>
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 175" />
          </div>
          <div className="input-group">
            <label>Poids (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ex: 70" />
          </div>
          <div className="input-group">
            <label>Âge</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 30" />
          </div>
          <div className="input-group">
            <label>Sexe</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        {/* Results Card */}
        <div className="calculator-card">
          <h3>Vos Résultats</h3>
          {imc ? (
            <div className="results-display">
              <p>Votre IMC : <strong>{imc}</strong> ({imcCategory})</p>
            </div>
          ) : (
            <small>Entrez taille et poids pour voir l'IMC.</small>
          )}

          <hr />

          <div className="input-group">
            <label>Votre niveau d'activité</label>
            <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
              <option value="1.2">Sédentaire (bureau)</option>
              <option value="1.375">Légèrement actif (1-3j/sem)</option>
              <option value="1.55">Modérément actif (3-5j/sem)</option>
              <option value="1.725">Très actif (6-7j/sem)</option>
              <option value="1.9">Extrêmement actif (travail physique + sport)</option>
            </select>
          </div>
          <div className="input-group">
            <label>Votre objectif</label>
            <select value={goal} onChange={e => setGoal(e.target.value)}>
              <option value="loss">Perte de poids</option>
              <option value="maintenance">Maintien</option>
              <option value="gain">Prise de masse</option>
            </select>
          </div>

          {calories ? (
            <div className="results-display calories-result">
              <p>Besoins caloriques estimés :</p>
              <span>{calories} kcal / jour</span>
            </div>
          ) : (
            <small>Entrez taille, poids et âge pour voir les calories.</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Outils;
