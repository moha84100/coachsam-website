import React, { useState, useEffect } from 'react';
import './AvantApres.css';

function AvantApres() {
  const imageNames = Array.from({ length: 23 }, (_, i) => `${i + 1}.png`);
  const comments = [
    "voici ma propre transformation, un peu longue à cause du manque de connaissance, la suite est + rapide 😉",
    "je me sens mieux dans mon corps, en meilleur santé, merci d’avoir été à l’écoute",
    "je ne pensais pas pouvoir atteindre un tel niveau, mais ce n’est pas fini !",
    "je suis fier d’avoir eu ce parcours, merci coach.",
    "j’ai tellement appris en étant à ces côtés, et mon physique le remercie encore",
    "en tant que sportif je pensais pas que le coaching était quelque chose d’aussi poussé, 0 regret, MERCI",
    "je me voyais évolué de semaine en semaine, un réel plaisir, merci encore",
    "c’etait mentalement dure, mais avec Sam qui me motivait au besoin c’était vraiment un plaisir, surtout quand je vois mon corps aujourd’hui.",
    "je ne savais pas qu’en seulement 3 mois on pouvait accomplir autant de chose, merci",
    "je me sens + léger malgré le poids pris, je suis moins fatigué durant mes journées",
    "je pensais pas durer en salle, aujourd’hui je ne me voit pas arrêter, merci Sam.",
    "-10kg en 1 mois j’ai encore du mal à y croire, merci coach.",
    "simple, efficace, quoi demander de plus de la part de son coach.",
    "très compréhensif malgré le mal que j’avais à prendre du poids, mais on a réussit !",
    "j’ai enfin pris du poids ! Je prends enfin du plaisir à manger, et surtout à m’entraîner vu les résultats que j’ai.",
    "cette transformation m’a permis d’être beaucoup + performant au basket, merci coach !",
    "j’avais peur de venir en salle, mais Sam m’a donné confiance en moi, en ma capacité à changer et aimer ce que je fais.",
    "oui oui 3 semaines, quand les choses sont bien faites ça peut aller très vite, merci Sam.",
    "à mon âge on ne s’attend plus à grand chose, mais là je suis bluffé, merci coach.",
    "cette recomposition corporelle m’a permit d’être meilleur en boxe et d’être + à l’aise avec mon corps.",
    "wouah, juste wouah, merci coach de m’avoir fait découvrir mes abdos.",
    "peur de la salle de sport, et quand on est bien accompagné tout va mieux ! Merci !",
    "en tant que mécanicien, je pensais pas que c’était aussi important d’avoir une masse musculaire + importante, je supporte bien mieux le travail physique."
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentComment, setCurrentComment] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * comments.length);
    setCurrentComment(comments[randomIndex]);
    console.log("Current Comment:", comments[randomIndex]); // Ajout du console.log
  }, [currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageNames.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageNames.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="avant-apres-container">
      <h2>Mes Avant Après</h2>
      <p>Découvrez les transformations de mes clients.</p>
      <div className="carousel-container">
        <button onClick={prevImage} className="carousel-arrow left-arrow">&lt;</button>
        <div className="image-card">
          <img 
            key={currentImageIndex} /* Ajout de la clé pour l'animation */
            src={`${process.env.PUBLIC_URL}/images/avant-apres/${imageNames[currentImageIndex]}`} 
            alt={`Avant Après ${currentImageIndex + 1}`} 
            className="avant-apres-image fade-slide-in"
          />
        </div>
        <button onClick={nextImage} className="carousel-arrow right-arrow">&gt;</button>
      </div>
      <div className="testimonial-bubble">
        <p className="comment-text">{currentComment}</p>
      </div>
    </div>
  );
}

export default AvantApres;