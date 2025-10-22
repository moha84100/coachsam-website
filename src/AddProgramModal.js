import React, { useState } from 'react';
import './AddProgramModal.css';
import { exerciseData } from './exercises';

const AddProgramModal = ({ isOpen, onClose, onSave, userId }) => {
  const [week, setWeek] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', category: '', sets: '', reps: '', videoUrl: '' },
  ]);

  if (!isOpen) return null;

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    if (field === 'category') {
      newExercises[index][field] = value;
      newExercises[index]['name'] = ''; // Reset exercise name when category changes
    } else if (field === 'name') {
      const selectedExercise = exerciseData[newExercises[index].category].find(ex => ex.name === value);
      newExercises[index]['name'] = value;
      newExercises[index]['videoUrl'] = selectedExercise ? selectedExercise.videoUrl : '';
    } else {
      newExercises[index][field] = value;
    }
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', category: '', sets: '', reps: '', videoUrl: '' }]);
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    if (!week) {
      alert('Please provide a week number.');
      return;
    }
    if (!title) {
      alert('Please provide a title for the program.');
      return;
    }
    const programData = { userId, week, title, description, exercises };
    onSave(programData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Program</h3>
        <div className="modal-form">
          <div className="form-group">
            <label>Week Number</label>
            <input
              type="number"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              placeholder="e.g., 1"
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Program Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Full Body Strength - Day 1"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the program's goals"
            ></textarea>
          </div>

          <div className="exercises-section">
            <h4>Exercises</h4>
            {exercises.map((ex, index) => (
              <div key={index} className="exercise-input">
                <select
                  value={ex.category}
                  onChange={(e) => handleExerciseChange(index, 'category', e.target.value)}
                >
                  <option value="">Select Category</option>
                  {Object.keys(exerciseData).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={ex.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  disabled={!ex.category}
                >
                  <option value="">Select Exercise</option>
                  {ex.category && exerciseData[ex.category].map(exercise => (
                    <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Reps (e.g., 8-12)"
                  value={ex.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Video URL (optional)"
                  value={ex.videoUrl}
                  onChange={(e) => handleExerciseChange(index, 'videoUrl', e.target.value)}
                />
                {exercises.length > 1 && (
                  <button onClick={() => removeExercise(index)} className="remove-exercise-btn">
                    Remove Exercise
                  </button>
                )}
              </div>
            ))}
            <button onClick={addExercise} className="add-exercise-btn">
              Add Another Exercise
            </button>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="cancel-btn">Cancel</button>
            <button onClick={handleSubmit} className="save-btn">Save Program</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProgramModal;