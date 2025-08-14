import React, { useState } from 'react';
import Modal from 'react-modal';
import './Blog.css';

// --- Modal Custom Styles ---
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    maxHeight: '80vh',
    padding: '40px',
    borderRadius: '15px',
    border: 'none',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1100, // Ensure modal is on top
  },
};

Modal.setAppElement('#root'); // Accessibility

// --- Articles Data ---
const articles = [
  {
    category: 'Nutrition & Alimentation',
    title: "Les 5 Piliers d'une Nutrition Sportive Réussie",
    summary: "Les bases pour optimiser votre énergie et récupération.",
    fullContent: `...` // Keep existing content
  },
  {
    category: 'Nutrition & Alimentation',
    title: "Les Erreurs de Débutant en Nutrition et Comment les Éviter",
    summary: "Ne laissez pas ces erreurs communes saboter vos efforts.",
    fullContent: `
      <h3>Erreur 1 : Craindre les glucides</h3>
      <p>Les glucides sont votre principale source d'énergie. Les supprimer complètement est contre-productif. Apprenez à choisir les bons (complets) et à les consommer au bon moment.</p>
      <h3>Erreur 2 : Se focaliser uniquement sur les calories</h3>
      <p>La qualité prime sur la quantité. 500 calories de poulet et de légumes n'ont pas le même impact sur votre corps que 500 calories de sucreries. Pensez micronutriments !</p>
      <h3>Erreur 3 : Manquer de protéines</h3>
      <p>Un apport insuffisant en protéines empêche vos muscles de se réparer et de se renforcer après l'effort. C'est le nutriment de la récupération par excellence.</p>
    `
  },
  {
    category: 'Entraînement & Performance',
    title: "5 Exercices au Poids du Corps pour un Entraînement Efficace",
    summary: "Pas de salle ? Pas de problème. Des résultats avec zéro matériel.",
    fullContent: `
      <p>L'efficacité ne dépend pas du matériel. Voici 5 mouvements fondamentaux :</p>
      <ul>
        <li><strong>Pompes :</strong> Pour le haut du corps (pectoraux, épaules, triceps).</li>
        <li><strong>Squats :</strong> Le roi des exercices pour les jambes et les fessiers.</li>
        <li><strong>Fentes :</strong> Idéales pour le travail unilatéral, l'équilibre et la stabilité.</li>
        <li><strong>Gainage (Planche) :</strong> Pour une sangle abdominale forte et un dos protégé.</li>
        <li><strong>Burpees :</strong> L'exercice cardio par excellence pour brûler des calories et améliorer votre endurance.</li>
      </ul>
    `
  },
  {
    category: 'Motivation & Mental',
    title: "La Musique, Votre Partenaire d'Entraînement Ultime",
    summary: "Comment une simple playlist peut booster vos performances.",
    fullContent: `
      <p>La musique n'est pas qu'un simple fond sonore. Des études ont montré qu'une musique rythmée peut augmenter votre endurance, réduire la perception de l'effort et même améliorer votre coordination. Créez des playlists spécifiques pour chaque type de séance (cardio, musculation, récupération) pour maximiser ses bienfaits.</p>
    `
  },
  {
    category: 'Récupération & Bien-être',
    title: "Le Rôle des Jours de Repos dans la Construction Musculaire",
    summary: "Pourquoi ne rien faire est parfois l'action la plus productive.",
    fullContent: `
      <p>C'est pendant les jours de repos, et non pendant l'entraînement, que vos fibres musculaires se réparent et se renforcent. Ignorer ces jours mène au surentraînement, à la stagnation et aux blessures. Accordez-vous au moins 1 à 2 jours de repos complet par semaine et pensez à la récupération active (marche, étirements légers).</p>
    `
  }
];

const categories = ['Tous', ...new Set(articles.map(article => article.category))];

function Blog() {
  const [filter, setFilter] = useState('Tous');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openModal = (article) => {
    setSelectedArticle(article);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedArticle(null);
  };

  const filteredArticles = filter === 'Tous' 
    ? articles 
    : articles.filter(article => article.category === filter);

  return (
    <div className="blog-container">
      <h2>Le Blog de Coach Sam</h2>
      <p>Conseils, astuces et réflexions pour vous accompagner dans votre parcours.</p>
      
      <div className="filter-buttons">
        {categories.map(category => (
          <button 
            key={category} 
            onClick={() => setFilter(category)}
            className={filter === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {filteredArticles.map((article, index) => (
          <div className="article-card" key={index}>
            <span className="article-category">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <button onClick={() => openModal(article)} className="read-more">Lire la suite</button>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Article Details"
        >
          <div className="modal-header">
            <h2>{selectedArticle.title}</h2>
            <button onClick={closeModal} className="close-modal-btn">&times;</button>
          </div>
          <div className="modal-content" dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent }}></div>
        </Modal>
      )}
    </div>
  );
}

export default Blog;