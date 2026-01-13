import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SessionPage.css';
import apiUrl from './apiConfig';

const SessionPage = () => {
  const { programId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [exercisePerformance, setExercisePerformance] = useState({}); // New state for performance tracking

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Accès non autorisé.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/programs/${programId}`, {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Impossible de charger la séance.');
        const data = await res.json();
        console.log('Fetched session data:', data);
        setSession(data);

        // Initialize exercisePerformance state
        const initialPerformance = {};
        data.exercises.forEach((ex, index) => {
          initialPerformance[index] = ex.performance && ex.performance.length > 0
            ? ex.performance.map(p => ({ reps: p.reps || '', weight: p.weight || '' }))
            : Array.from({ length: ex.sets || 1 }, () => ({ reps: '', weight: '' })); // Initialize with planned sets
        });
        setExercisePerformance(initialPerformance);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [programId]);

  const handleExerciseClick = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
  };

  const handlePerformanceChange = (exerciseIndex, performanceIndex, field, value) => {
    setExercisePerformance(prevPerformance => {
      const newExercisePerformance = { ...prevPerformance };
      const newPerformanceArray = [...(newExercisePerformance[exerciseIndex] || [])];
      
      while (newPerformanceArray.length <= performanceIndex) {
        newPerformanceArray.push({ reps: '', weight: '' });
      }

      newPerformanceArray[performanceIndex] = {
        ...newPerformanceArray[performanceIndex],
        [field]: value
      };
      newExercisePerformance[exerciseIndex] = newPerformanceArray;
      return newExercisePerformance;
    });
  };

  const addPerformanceRow = (exerciseIndex) => {
    setExercisePerformance(prevPerformance => {
      const newExercisePerformance = { ...prevPerformance };
      const newPerformanceArray = [...(newExercisePerformance[exerciseIndex] || [])];
      newPerformanceArray.push({ reps: '', weight: '' });
      newExercisePerformance[exerciseIndex] = newPerformanceArray;
      return newExercisePerformance;
    });
  };

  const savePerformance = async () => {
    setLoading(true); // Indicate saving process
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
      setSession(data); // Update session state with saved data
      
      // Re-initialize exercisePerformance from the saved data to ensure consistency
      const reinitializedPerformance = {};
      data.exercises.forEach((ex, index) => {
        reinitializedPerformance[index] = ex.performance && ex.performance.length > 0
          ? ex.performance.map(p => ({ reps: p.reps || '', weight: p.weight || '' }))
          : Array.from({ length: ex.sets || 1 }, () => ({ reps: '', weight: '' }));
      });
      setExercisePerformance(reinitializedPerformance);

      alert('Performances sauvegardées avec succès !');

    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
      alert('Erreur lors de la sauvegarde des performances.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <div className="session-page-container"><h2>Chargement de la séance...</h2></div>;
  if (error) return <div className="session-page-container" style={{ color: 'red' }}>Erreur: {error}</div>;
  if (!session) return <div className="session-page-container"><h2>Séance non trouvée.</h2></div>;

  // Function to embed YouTube URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      }
      if (url.includes('/shorts/')) {
        videoId = url.split('/shorts/')[1].split('?')[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      console.error('Invalid URL for embedding:', e);
      return null;
    }
  };

  console.log('Rendering session:', session);

  return (
    <div className="session-page-container">
      <div className="session-header">
        <h1>{session.title}</h1>
        {session.description && <p className="coach-comment"><span>Commentaire du coach :</span> {session.description}</p>}
      </div>

      <div className="session-content">
        <div className="exercise-list">
          <h3>À faire aujourd'hui :</h3>
          {session.exercises && session.exercises.length > 0 ? (
            <ul>
              {session.exercises.map((ex, exIndex) => (
                <li key={exIndex}>
                  <div className="exercise-info">
                    <span className="exercise-name">{ex.name}</span>
                    <span className="exercise-details">{ex.sets} séries de {ex.reps}</span>
                    {ex.videoUrl && (
                      <i 
                        className="fas fa-play-circle video-icon" 
                        onClick={() => handleExerciseClick(ex.videoUrl)}
                        title="Voir la vidéo"
                      ></i>
                    )}
                  </div>
                  <div className="performance-inputs">
                    {exercisePerformance[exIndex] && exercisePerformance[exIndex].map((p, pIndex) => (
                      <div key={pIndex} className="performance-row">
                        <span>Série {pIndex + 1} :</span>
                        <input
                          type="number"
                          placeholder="Répétitions"
                          value={p.reps}
                          onChange={(e) => handlePerformanceChange(exIndex, pIndex, 'reps', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Poids (kg)"
                          value={p.weight}
                          onChange={(e) => handlePerformanceChange(exIndex, pIndex, 'weight', e.target.value)}
                        />
                      </div>
                    ))}
                    <button onClick={() => addPerformanceRow(exIndex)}>+ Ajouter une série</button>
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

        {selectedVideoUrl && (
          <div className="video-player">
            <iframe
              src={getYouTubeEmbedUrl(selectedVideoUrl)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
