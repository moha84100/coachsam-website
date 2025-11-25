import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ProfilePage.css'; // We will reuse and adapt the styles
import apiUrl from './apiConfig';

// Setup the localizer for react-big-calendar
const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
  getDay,
  locales,
});

const ProfilePage = ({ isAdmin, token, userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State for calendar navigation
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    if (!token) {
      setError('Vous n\'êtes pas connecté.');
      setLoading(false);
      return;
    }

    try {
      // Fetch programs for the logged-in user
      const res = await fetch(`${apiUrl}/api/programs`, {
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Impossible de récupérer le programme.');
      const programs = await res.json();

      // Transform programs into events for the calendar
      const calendarEvents = programs.map(program => ({
        title: program.isRestDay ? 'Repos' : program.title,
        start: new Date(program.date),
        end: new Date(program.date),
        allDay: true,
        resource: program, // Store the original program object
      }));
      setEvents(calendarEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPrograms();
    }
  }, [token, fetchPrograms]);

  // Handlers for calendar navigation
  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleSelectEvent = (event) => {
    if (event.resource && event.resource._id) {
      navigate(`/session/${event.resource._id}`);
    }
  };

  if (loading) return <div className="profile-container"><h2>Chargement du calendrier...</h2></div>;
  if (error) return <div className="profile-container" style={{ color: 'red' }}>Erreur: {error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mon Programme</h2>
        <div>
          <button className="body-measurements-btn" onClick={() => navigate('/profile/body-measurements')}>
            Mon corps
          </button>
          {isAdmin && userId && (
            <button className="diet-btn" onClick={() => navigate(`/profile/diet/${userId}`)}>
              Modifier la diète
            </button>
          )}
        </div>
      </div>
      <p>Consultez votre planning d'entraînement. Cliquez sur un événement pour voir les détails.</p>
      <div style={{ height: '75vh', marginTop: '2rem' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture='fr'
          onSelectEvent={handleSelectEvent} // Allow clicking to see details
          // Navigation props
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
        />
      </div>
    </div>
  );
};

export default ProfilePage;