import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BodyMeasurementsPage.css';

const BodyMeasurementsPage = () => {
  const { userId } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [measurements, setMeasurements] = useState({
    poids: { value: '75 kg', comment: 'Objectif : 70 kg' },
    taille: { value: '180 cm', comment: '' },
    cou: { value: '38 cm', comment: '' },
    epaule: { value: '110 cm', comment: '' },
    poitrine: { value: '100 cm', comment: 'Augmenter la force' },
    bras: { value: '35 cm', comment: '' },
    nombril: { value: '80 cm', comment: 'Réduire de 2 cm' },
    fesses: { value: '95 cm', comment: '' },
    cuisse: { value: '55 cm', comment: '' },
    mollet: { value: '38 cm', comment: '' },
  });
  const [measurementsHistory, setMeasurementsHistory] = useState([
    {
      date: '2023-10-01',
      measurements: {
        poids: { value: '76 kg', comment: 'Objectif : 70 kg' },
        taille: { value: '180 cm', comment: '' },
        cou: { value: '39 cm', comment: '' },
        epaule: { value: '109 cm', comment: '' },
        poitrine: { value: '99 cm', comment: 'Augmenter la force' },
        bras: { value: '34 cm', comment: '' },
        nombril: { value: '82 cm', comment: 'Réduire de 2 cm' },
        fesses: { value: '96 cm', comment: '' },
        cuisse: { value: '56 cm', comment: '' },
        mollet: { value: '39 cm', comment: '' },
      },
    },
    {
      date: '2023-09-01',
      measurements: {
        poids: { value: '77 kg', comment: 'Objectif : 70 kg' },
        taille: { value: '180 cm', comment: '' },
        cou: { value: '40 cm', comment: '' },
        epaule: { value: '108 cm', comment: '' },
        poitrine: { value: '98 cm', comment: 'Augmenter la force' },
        bras: { value: '33 cm', comment: '' },
        nombril: { value: '84 cm', comment: 'Réduire de 2 cm' },
        fesses: { value: '97 cm', comment: '' },
        cuisse: { value: '57 cm', comment: '' },
        mollet: { value: '40 cm', comment: '' },
      },
    },
  ]);
  const [objective, setObjective] = useState('perte de gras');

  const objectives = [
    'perte de gras',
    'prise de masse',
    'maintien',
    'recomposition corporelle',
    'amélioration des performances',
  ];

  useEffect(() => {
    console.log('User ID:', userId);
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3001/api/auth/check-admin', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.isAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    checkAdminStatus();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: { ...prev[name], value } }));
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: { ...prev[name], comment: value } }));
  };

  const handleObjectiveChange = (e) => {
    setObjective(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      measurements,
    };
    setMeasurementsHistory([newEntry, ...measurementsHistory]);
    // Here you would typically save the data to the backend
    console.log('Saving measurements:', measurements);
    console.log('Saving objective:', objective);
  };

  const getComparisonColor = (key, currentValue, history) => {
    const previousEntry = history[1]; // Compare with the second last entry
    if (!previousEntry) return 'inherit';

    const previousValue = previousEntry.measurements[key].value;

    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);

    if (isNaN(current) || isNaN(previous)) return 'inherit';

    if (current === previous) return 'orange';

    if (objective === 'perte de gras') {
      return current < previous ? 'green' : 'red';
    } else if (objective === 'prise de masse') {
      return current > previous ? 'green' : 'red';
    } else {
      return current !== previous ? 'blue' : 'inherit';
    }
  };

  return (
    <div className="body-measurements-page">
      <h1>Mes mensurations</h1>
      <div className="measurements-container">
        <div className="objective-section">
          <h3>Objectif</h3>
          {isEditing ? (
            <select value={objective} onChange={handleObjectiveChange}>
              {objectives.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <p>{objective.charAt(0).toUpperCase() + objective.slice(1)}</p>
          )}
        </div>

        {Object.entries(measurements).map(([key, data]) => (
          <div key={key} className="measurement-item">
            <span className="measurement-label">{key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}:</span>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={data.value}
                onChange={handleInputChange}
              />
            ) : (
              <span
                className="measurement-value"
                style={{
                  color: getComparisonColor(
                    key,
                    data.value,
                    measurementsHistory
                  ),
                }}
              >
                {data.value}
              </span>
            )}
            {isAdmin && (
              <div className="comment-section">
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={data.comment}
                    onChange={handleCommentChange}
                    placeholder="Ajouter un commentaire"
                  />
                ) : (
                  data.comment && <span className="measurement-comment">({data.comment})</span>
                )}
              </div>
            )}
          </div>
        ))}

        {isAdmin && (
          <div className="actions">
            {isEditing ? (
              <button onClick={handleSave} className="save-btn">Sauvegarder</button>
            ) : (
              <button onClick={handleEdit} className="edit-btn">Modifier</button>
            )}
          </div>
        )}
      </div>

      <div className="history-container">
        <h2>Historique des mensurations</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {Object.keys(measurements).map((key) => (
                <th key={key}>{key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurementsHistory.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                {Object.keys(measurements).map((key) => (
                  <td key={key}>{entry.measurements[key].value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BodyMeasurementsPage;