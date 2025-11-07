import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Questionnaire.css';
import apiUrl from './apiConfig';

function Questionnaire() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    job: '',
    goal: [],
    other_goals: '',
    frequency: '',
    activities: '',
    injuries: '',
    health_issues: '',
    medication: '',
    sleep: '',
    nutrition: '',
    stress: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        goal: checked
          ? [...prevData.goal, value]
          : prevData.goal.filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: 'questionnaire',
        ...formData,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        setFormData({
          name: '',
          age: '',
          job: '',
          goal: [],
          other_goals: '',
          frequency: '',
          activities: '',
          injuries: '',
          health_issues: '',
          medication: '',
          sleep: '',
          nutrition: '',
          stress: '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Something went wrong.');
      });
  };

  return (
    <div className="questionnaire-container">
      <Link to="/" className="back-to-home-button">Retour Accueil</Link>
      <h2>Questionnaire Nouveaux Clients</h2>
      <p>Merci de remplir ce formulaire avec le plus de détails possible. Ces informations sont confidentielles et me permettront de créer un programme sûr et parfaitement adapté à vos besoins.</p>
      
      <form className="questionnaire-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informations Personnelles</legend>
          <label>Nom & Prénom <input type="text" name="name" required value={formData.name} onChange={handleChange} /></label>
          <label>Âge <input type="number" name="age" required value={formData.age} onChange={handleChange} /></label>
          <label>Profession <input type="text" name="job" value={formData.job} onChange={handleChange} /></label>
        </fieldset>

        <fieldset>
          <legend>Vos Objectifs</legend>
          <p>Quels sont vos principaux objectifs ? (plusieurs choix possibles)</p>
          <label><input type="checkbox" name="goal" value="weight_loss" checked={formData.goal.includes('weight_loss')} onChange={handleChange} /> Perte de poids</label>
          <label><input type="checkbox" name="goal" value="muscle_gain" checked={formData.goal.includes('muscle_gain')} onChange={handleChange} /> Prise de masse / Renforcement musculaire</label>
          <label><input type="checkbox" name="goal" value="performance" checked={formData.goal.includes('performance')} onChange={handleChange} /> Amélioration des performances sportives</label>
          <label><input type="checkbox" name="goal" value="endurance" checked={formData.goal.includes('endurance')} onChange={handleChange} /> Amélioration de l'endurance / Cardio</label>
          <label><input type="checkbox" name="goal" value="wellness" checked={formData.goal.includes('wellness')} onChange={handleChange} /> Bien-être général / Anti-stress</label>
          <label>Autres objectifs (précisez) :<textarea name="other_goals" value={formData.other_goals} onChange={handleChange}></textarea></label>
        </fieldset>

        <fieldset>
          <legend>Niveau de Forme Actuel</legend>
          <p>À quelle fréquence pratiquez-vous une activité physique ?</p>
          <label><input type="radio" name="frequency" value="never" checked={formData.frequency === 'never'} onChange={handleChange} /> Jamais ou très rarement</label>
          <label><input type="radio" name="frequency" value="1-2_week" checked={formData.frequency === '1-2_week'} onChange={handleChange} /> 1 à 2 fois par semaine</label>
          <label><input type="radio" name="frequency" value="3-4_week" checked={formData.frequency === '3-4_week'} onChange={handleChange} /> 3 à 4 fois par semaine</label>
          <label><input type="radio" name="frequency" value="5-plus_week" checked={formData.frequency === '5-plus_week'} onChange={handleChange} /> 5 fois ou plus par semaine</label>
          <label>Quels types d'activités ? (Ex: course, musculation, yoga...)<input type="text" name="activities" value={formData.activities} onChange={handleChange} /></label>
        </fieldset>

        <fieldset>
          <legend>Antécédents Médicaux et Blessures</legend>
          <p>Cette section est cruciale pour votre sécurité.</p>
          <label>Avez-vous des blessures (anciennes ou actuelles) ? Si oui, lesquelles ?<textarea name="injuries" value={formData.injuries} onChange={handleChange}></textarea></label>
          <label>Souffrez-vous de problèmes de santé chroniques (problèmes cardiaques, diabète, asthme, etc.) ?<textarea name="health_issues" value={formData.health_issues} onChange={handleChange}></textarea></label>
          <label>Prenez-vous des médicaments qui pourraient affecter votre pratique sportive ?<textarea name="medication" value={formData.medication} onChange={handleChange}></textarea></label>
        </fieldset>

        <fieldset>
          <legend>Habitudes de Vie</legend>
          <label>Combien d'heures dormez-vous par nuit en moyenne ? <input type="text" name="sleep" value={formData.sleep} onChange={handleChange} /></label>
          <label>Comment décririez-vous votre alimentation ?<textarea name="nutrition" value={formData.nutrition} onChange={handleChange}></textarea></label>
          <label>Quel est votre niveau de stress au quotidien (sur une échelle de 1 à 10) ? <input type="number" name="stress" min="1" max="10" value={formData.stress} onChange={handleChange} /></label>
        </fieldset>

        <button type="submit" className="submit-btn">Envoyer le Questionnaire</button>
      </form>
    </div>
  );
}

export default Questionnaire;
