import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserProgramCalendar.css';
import ProgramEditModal from './ProgramEditModal'; // Import the modal

// Setup the localizer
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

const UserProgramCalendar = () => {
  const { userId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for calendar navigation
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, authorization denied');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/programs/user/${userId}`, {
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) throw new Error('Failed to fetch programs for this user');
      const programs = await res.json();

      const calendarEvents = programs.map(program => ({
        title: program.isRestDay ? 'Repos' : program.title,
        start: new Date(program.date),
        end: new Date(program.date),
        allDay: true,
        resource: program,
      }));
      setEvents(calendarEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingProgram(null);
  };

  const handleSelectSlot = (slotInfo) => {
    setIsModalOpen(true);
    setSelectedDate(slotInfo.start);
    setEditingProgram(null);
  };

  const handleSelectEvent = (event) => {
    setIsModalOpen(true);
    setSelectedDate(event.start);
    setEditingProgram(event.resource);
  };

  const handleSaveProgram = async (programData) => {
    const token = localStorage.getItem('token');
    const isEditing = !!editingProgram;

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:3001/api/programs/${editingProgram._id}`
      : 'http://localhost:3001/api/programs/add';

    const body = isEditing
      ? programData
      : { ...programData, userId, date: selectedDate };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to save program');
      }

      handleCloseModal();
      fetchPrograms(); // Refetch to show the update
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/programs/${programId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });

      if (!res.ok) throw new Error('Failed to delete program');

      handleCloseModal();
      fetchPrograms(); // Refetch
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers for calendar navigation
  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  if (loading) return <div>Loading calendar...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="program-calendar-page">
      <h1>Planning du client</h1>
      <p>Cliquez sur un jour pour ajouter un programme, ou sur un programme existant pour le modifier.</p>
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture='fr'
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          // Add navigation props
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
        />
      </div>

      <ProgramEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProgram}
        onDelete={handleDeleteProgram}
        program={editingProgram}
        date={selectedDate}
      />
    </div>
  );
};

export default UserProgramCalendar;
