import React from 'react';
import { useParams } from 'react-router-dom';
import './DietPage.css';

const DietPage = () => {
  const { userId } = useParams();

  return (
    <div className="diet-container">
      <h2>Page de régime pour l'utilisateur {userId}</h2>
      <p>Cette page est en cours de construction.</p>
    </div>
  );
};

export default DietPage;
