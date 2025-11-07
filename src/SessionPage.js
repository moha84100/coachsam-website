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
              {session.exercises.map((ex, index) => (
                <li key={index} onClick={() => handleExerciseClick(ex.videoUrl)}>
                  <span className="exercise-name">{ex.name}</span>
                  <span className="exercise-details">{ex.sets} séries de {ex.reps}</span>
                  {ex.videoUrl && <i className="fas fa-play-circle video-icon"></i>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun exercice pour cette séance.</p>
          )}
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
