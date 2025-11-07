import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoachPage.css'; // Import the CSS file
import apiUrl from './apiConfig';

const CoachPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: 0, reps: '', videoUrl: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await fetch(`${apiUrl}/api/users`, {
        headers: {
          'x-auth-token': token,
        },
      });
      if (res.status === 401 || res.status === 403) {
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        console.error(data.msg);
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: '', videoUrl: '' }]);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmitProgram = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiUrl}/api/programs/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ userId: selectedUser, title, description, exercises }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Program added successfully!');
      setTitle('');
      setDescription('');
      setExercises([{ name: '', sets: 0, reps: '', videoUrl: '' }]);
      setSelectedUser('');
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="coach-container">
      <h2>Coach Dashboard</h2>
      <form onSubmit={handleSubmitProgram} className="program-form">
        <div className="form-group">
          <label>Select User:</label>
          <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
            <option value="">-- Select a user --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Program Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <h3>Exercises:</h3>
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-group">
            <input
              type="text"
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
              required
            />
            <input
              type="text"
              placeholder="Reps (e.g., '8-12', '30s')"
              value={exercise.reps}
              onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Video URL (optional)"
              value={exercise.videoUrl}
              onChange={(e) => handleExerciseChange(index, 'videoUrl', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddExercise}>Add Exercise</button>
        <button type="submit">Add Program</button>
      </form>
    </div>
  );
};

export default CoachPage;