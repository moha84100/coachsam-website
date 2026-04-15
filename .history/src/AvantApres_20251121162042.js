import React, { useState, useEffect } from 'react';
import './AvantApres.css';

function AvantApres() {
  const transformations = [
    {
      image: "1.png",
      comment: "voici ma propre transformation, un peu longue à cause du manque de connaissance, la suite est + rapide 😉"
    },
    {
      image: "2.png",
      comment: "je me sens mieux dans mon corps, en meilleur santé, merci d’avoir été à l’écoute"
    },
    {
      image: "3.png",
      comment: "je ne pensais pas pouvoir atteindre un tel niveau, mais ce n’est pas fini !"
    },
    {
      image: "4.png",
      comment: "je suis fier d’avoir eu ce parcours, merci coach."
    },
    {
      image: "5.png",
      comment: "j’ai tellement appris en étant à ces côtés, et mon physique le remercie encore"
    },
    {
      image: "6.png",
      comment: "en tant que sportif je pensais pas que le coaching était quelque chose d’aussi poussé, 0 regret, MERCI"
    },
    {
      image: "7.png",
      comment: "je me voyais évolué de semaine en semaine, un réel plaisir, merci encore"
    },
    {
      image: "8.png",
      comment: "c’etait mentalement dure, mais avec Sam qui me motivait au besoin c’était vraiment un plaisir, surtout quand je vois mon corps aujourd’hui."
    },
    {
      image: "9.png",
      comment: "je ne savais pas qu’en seulement 3 mois on pouvait accomplir autant de chose, merci"
    },
    {
      image: "10.png",
      comment: "je me sens + léger malgré le poids pris, je suis moins fatigué durant mes journées"
    },
    {
      image: "11.png",
      comment: "je pensais pas durer en salle, aujourd’hui je ne me voit pas arrêter, merci Sam."
    },
    {
      image: "12.png",
      comment: "-10kg en 1 mois j’ai encore du mal à y croire, merci coach."
    },
    {
      image: "13.png",
      comment: "simple, efficace, quoi demander de plus de la part de son coach."
    },
    {
      image: "14.png",
      comment: "très compréhensif malgré le mal que j’avais à prendre du poids, mais on a réussit !"
    },
    {
      image: "15.png",
      comment: "j’ai enfin pris du poids ! Je prends enfin du plaisir à manger, et surtout à m’entraîner vu les résultats que j’ai."
    },
    {
      image: "16.png",
      comment: "cette transformation m’a permis d’être beaucoup + performant au basket, merci coach !"
    },
    {
      image: "17.png",
      comment: "j’avais peur de venir en salle, mais Sam m’a donné confiance en moi, en ma capacité à changer et aimer ce que je fais."
    },
    {
      image: "18.png",
      comment: "oui oui 3 semaines, quand les choses sont bien faites ça peut aller très vite, merci Sam."
    },
    {
      image: "19.png",
      comment: "à mon âge on ne s’attend plus à grand chose, mais là je suis bluffé, merci coach."
    },
    {
      image: "20.png",
      comment: "cette recomposition corporelle m’a permit d’être meilleur en boxe et d’être + à l’aise avec mon corps."
    },
    {
      image: "21.png",
      comment: "wouah, juste wouah, merci coach de m’avoir fait découvrir mes abdos."
    },
    {
      image: "22.png",
      comment: "peur de la salle de sport, et quand on est bien accompagné tout va mieux ! Merci !"
    },
    {
      image: "23.png",
      comment: "en tant que mécanicien, je pensais pas que c’était aussi important d’avoir une masse musculaire + importante, je supporte bien mieux le travail physique."
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % transformations.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? transformations.length - 1 : prevIndex - 1
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
            src={`${process.env.PUBLIC_URL}/images/avant-apres/${transformations[currentImageIndex].image}`}
            alt={`Avant Après ${currentImageIndex + 1}`}
            className="avant-apres-image fade-slide-in"
          />
        </div>
        <button onClick={nextImage} className="carousel-arrow right-arrow">&gt;</button>
      </div>
      <div className="testimonial-bubble">
        <p className="comment-text">{transformations[currentImageIndex].comment}</p>
      </div>
    </div>
  );
}

export default AvantApres;