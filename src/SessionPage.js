import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SessionPage.css';
import apiUrl from './apiConfig';

const SessionPage = () => {
  const { programId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleVideo, setVisibleVideo] = useState(null); // State to track which video is visible
  const [exercisePerformance, setExercisePerformance] = useState({});
  const [previousPerformances, setPreviousPerformances] = useState({});

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Accès non autorisé.');
        setLoading(false);
        return;
      }

      try {
        // Fetch current session
        const res = await fetch(`${apiUrl}/api/programs/${programId}`, {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Impossible de charger la séance.');
        const currentData = await res.json();
        setSession(currentData);

        // Fetch all user sessions to find previous performance
        const allRes = await fetch(`${apiUrl}/api/programs`, {
          headers: { 'x-auth-token': token },
        });
        if (allRes.ok) {
          const allPrograms = await allRes.json();
          
          // Sort programs by date descending to find the most recent one before current
          const sortedPrograms = allPrograms
            .filter(p => p._id !== programId && new Date(p.date) < new Date(currentData.date))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          const prevPerfs = {};
          currentData.exercises.forEach((ex, exIndex) => {
            // Find the last session that included this exercise name
            const lastSessionWithExercise = sortedPrograms.find(p => 
              p.exercises && p.exercises.some(prevEx => prevEx.name === ex.name && prevEx.performance && prevEx.performance.length > 0)
            );

            if (lastSessionWithExercise) {
              const prevEx = lastSessionWithExercise.exercises.find(pe => pe.name === ex.name);
              prevPerfs[exIndex] = prevEx.performance;
            }
          });
          setPreviousPerformances(prevPerfs);
        }

        const initialPerformance = {};
        currentData.exercises.forEach((ex, index) => {
          initialPerformance[index] = ex.performance && ex.performance.length > 0
            ? ex.performance.map(p => ({ reps: p.reps || '', weight: p.weight || '' }))
            : Array.from({ length: ex.sets || 1 }, () => ({ reps: '', weight: '' }));
        });
        setExercisePerformance(initialPerformance);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [programId]);

  const handleVideoToggle = (exIndex) => {
    setVisibleVideo(visibleVideo === exIndex ? null : exIndex);
  };

  const handlePerformanceChange = (exerciseIndex, performanceIndex, field, value) => {
    setExercisePerformance(prev => {
      const newPerformance = { ...prev };
      const performanceArray = [...(newPerformance[exerciseIndex] || [])];
      
      while (performanceArray.length <= performanceIndex) {
        performanceArray.push({ reps: '', weight: '' });
      }

      performanceArray[performanceIndex] = { ...performanceArray[performanceIndex], [field]: value };
      newPerformance[exerciseIndex] = performanceArray;
      return newPerformance;
    });
  };

  const addPerformanceRow = (exerciseIndex) => {
    setExercisePerformance(prev => {
      const newPerformance = { ...prev };
      const performanceArray = [...(newPerformance[exerciseIndex] || [])];
      performanceArray.push({ reps: '', weight: '' });
      newPerformance[exerciseIndex] = performanceArray;
      return newPerformance;
    });
  };

  const savePerformance = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Accès non autorisé.');
      setLoading(false);
      return;
    }

    try {
      const updatedExercises = session.exercises.map((ex, index) => ({
        ...ex,
        performance: exercisePerformance[index] ? exercisePerformance[index].filter(p => p.reps || p.weight) : [],
      }));

      const res = await fetch(`${apiUrl}/api/programs/${programId}/performance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ exercises: updatedExercises }),
      });

      if (!res.ok) throw new Error('Impossible de sauvegarder les performances.');
      
      const data = await res.json();
      setSession(data);
      
      const reinitializedPerformance = {};
      data.exercises.forEach((ex, index) => {
        reinitializedPerformance[index] = ex.performance && ex.performance.length > 0
          ? ex.performance.map(p => ({ reps: p.reps || '', weight: p.weight || '' }))
          : Array.from({ length: ex.sets || 1 }, () => ({ reps: '', weight: '' }));
      });
      setExercisePerformance(reinitializedPerformance);

      alert('Performances sauvegardées avec succès !');

    } catch (err) {
      setError(err.message);
      alert('Erreur lors de la sauvegarde des performances.');
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
      if (urlObj.hostname === 'youtu.be') videoId = urlObj.pathname.slice(1);
      if (url.includes('/shorts/')) videoId = url.split('/shorts/')[1].split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      return null;
    }
  };

  if (loading) return <div className="session-page-container"><h2>Chargement de la séance...</h2></div>;
  if (error) return <div className="session-page-container" style={{ color: 'red' }}>Erreur: {error}</div>;
  if (!session) return <div className="session-page-container"><h2>Séance non trouvée.</h2></div>;

  return (
    <div className="session-page-container">
      <div className="session-header">
        <h1>{session.title}</h1>
        {session.description && <p className="coach-comment"><span>Commentaire du coach :</span> {session.description}</p>}
      </div>

      <div className="exercise-list">
        <h3>À faire aujourd'hui :</h3>
        {session.exercises && session.exercises.length > 0 ? (
          <ul>
            {session.exercises.map((ex, exIndex) => (
              <li key={exIndex} className="exercise-card">
                <div className="exercise-card-header">
                  <div className="exercise-info">
                    <span className="exercise-name">{ex.name}</span>
                    <span className="exercise-details">
                      {ex.sets} séries de {ex.reps}
                      {ex.restTime && <span className="rest-time"> • Repos : {ex.restTime}</span>}
                    </span>
                  </div>
                  {ex.videoUrl && (
                    <button className="video-toggle-button" onClick={() => handleVideoToggle(exIndex)} title="Voir la vidéo">
                      <i className={`fas ${visibleVideo === exIndex ? 'fa-times' : 'fa-play'}`}></i>
                    </button>
                  )}
                </div>

                {visibleVideo === exIndex && ex.videoUrl && (
                  <div className="video-player-card">
                    <iframe
                      src={getYouTubeEmbedUrl(ex.videoUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <div className="performance-tracking">
                  <h4>Votre performance :</h4>
                  <div className="performance-grid-header">
                    <span>Série</span>
                    <span>Répétitions</span>
                    <span>Poids (kg)</span>
                  </div>
                  {exercisePerformance[exIndex]?.map((p, pIndex) => {
                    // Get previous performance for this specific set if it exists
                    const prevSet = previousPerformances[exIndex] && previousPerformances[exIndex][pIndex];
                    return (
                      <div key={pIndex} className="performance-grid-row">
                        <span>{pIndex + 1}</span>
                        <input
                          type="number"
                          placeholder={prevSet ? prevSet.reps : "Reps"}
                          value={p.reps}
                          onChange={(e) => handlePerformanceChange(exIndex, pIndex, 'reps', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder={prevSet ? prevSet.weight : "Poids"}
                          value={p.weight}
                          onChange={(e) => handlePerformanceChange(exIndex, pIndex, 'weight', e.target.value)}
                        />
                      </div>
                    );
                  })}
                  <button onClick={() => addPerformanceRow(exIndex)} className="add-set-button">
                    + Ajouter une série
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun exercice pour cette séance.</p>
        )}
        <button onClick={savePerformance} className="save-performance-button" disabled={loading}>
          {loading ? 'Sauvegarde...' : 'Enregistrer les performances'}
        </button>
      </div>
    </div>
  );
};

export default SessionPage;
