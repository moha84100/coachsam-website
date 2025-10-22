import React, { useState, useEffect } from 'react';
import './ProgramEditModal.css';
import { exerciseData } from './exercises.js';

const ProgramEditModal = ({ isOpen, onClose, onSave, onDelete, program, date }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isRestDay: false,
    exercises: [],
  });

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        description: program.description || '',
        isRestDay: program.isRestDay || false,
        exercises: program.exercises.map(ex => ({ ...ex, muscleGroup: ex.muscleGroup || '' })) || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        isRestDay: false,
        exercises: [{ name: '', sets: '', reps: '', videoUrl: '', muscleGroup: '' }],
      });
    }
  }, [program, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    const currentExercise = { ...newExercises[index] };
    currentExercise[field] = value;

    if (field === 'muscleGroup') {
      currentExercise.name = '';
      currentExercise.videoUrl = '';
    }

    if (field === 'name') {
      const exercise = exerciseData[currentExercise.muscleGroup]?.find(ex => ex.name === value);
      if (exercise) {
        currentExercise.videoUrl = exercise.videoUrl;
      }
    }

    newExercises[index] = currentExercise;
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', videoUrl: '', muscleGroup: '' }],
    }));
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (program && program._id) {
      onDelete(program._id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>{program ? 'Modifier le programme' : 'Ajouter un programme'}</h2>
          <p>Pour le {date ? date.toLocaleDateString('fr-FR') : ''}</p>

          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isRestDay"
                checked={formData.isRestDay}
                onChange={handleInputChange}
              />
              Jour de repos
            </label>
          </div>

          {!formData.isRestDay && (
            <div className="exercises-section">
              <h4>Exercices</h4>
              {formData.exercises.map((ex, index) => (
                <div key={index} className="exercise-group">
                  <select
                    value={ex.muscleGroup}
                    onChange={(e) => handleExerciseChange(index, 'muscleGroup', e.target.value)}
                  >
                    <option value="">Choisir un groupe</option>
                    {Object.keys(exerciseData).map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>

                  <select
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    disabled={!ex.muscleGroup}
                  >
                    <option value="">Choisir un exercice</option>
                    {ex.muscleGroup && exerciseData[ex.muscleGroup].map(exercise => (
                      <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
                    ))}
                  </select>

                  <input type="number" name="sets" placeholder="Séries" value={ex.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} />
                  <input type="text" name="reps" placeholder="Répétitions" value={ex.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} />
                  <input type="text" name="videoUrl" placeholder="URL Vidéo" value={ex.videoUrl} readOnly />

                  <button type="button" className="remove-exercise-btn" onClick={() => removeExercise(index)}>X</button>
                </div>
              ))}
              <button type="button" className="add-exercise-btn" onClick={addExercise}>Ajouter un exercice</button>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="save-btn">Sauvegarder</button>
            {program && <button type="button" className="delete-btn" onClick={handleDelete}>Supprimer</button>}
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramEditModal;
