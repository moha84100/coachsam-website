import React, { useState, useEffect } from 'react';
import './AvantApres.css';

function AvantApres() {
  const imageNames = Array.from({ length: 23 }, (_, i) => `${i + 1}.png`);
  const comments = [
    "Grâce à Coach Sam, j'ai retrouvé la forme et l'énergie !",
    "Les séances sont intenses mais les résultats sont là. Merci Sam !",
    "Je n'aurais jamais cru pouvoir atteindre mes objectifs, mais Sam m'a prouvé le contraire.",
    "Un coaching personnalisé et motivant. Je recommande à 100% !",
    "Sam est un coach à l'écoute et très professionnel. Chaque séance est un plaisir.",
    "Mes habitudes alimentaires ont complètement changé grâce aux conseils de Sam.",
    "Je me sens plus fort et plus confiant que jamais. Merci Coach Sam !",
    "Les entraînements sont variés et adaptés à mes besoins. J'adore !",
    "Sam m'a aidé à dépasser mes limites et à croire en moi.",
    "Une expérience incroyable ! J'ai appris à aimer le sport.",
    "Je suis impressionné par les résultats obtenus en si peu de temps.",
    "Sam est un véritable expert. Ses conseils sont précieux.",
    "Je n'ai plus mal au dos et je me sens beaucoup mieux dans mon corps.",
    "Le meilleur investissement que j'ai fait pour ma santé.",
    "Sam est toujours là pour me motiver, même quand je n'ai pas envie.",
    "J'ai perdu du poids et gagné en muscle. Je suis ravi !",
    "Les séances en extérieur sont géniales. On ne s'ennuie jamais.",
    "Sam m'a appris à écouter mon corps et à respecter mes limites.",
    "Je suis plus endurant et je me fatigue moins vite.",
    "Un accompagnement au top ! Je me sens vraiment soutenu.",
    "Sam est un coach passionné et ça se voit.",
    "Je suis fier de mes progrès et je continue sur ma lancée.",
    "Merci Sam pour ton professionnalisme et ta bonne humeur !",
    "Je me sens tellement mieux dans ma peau ! Un grand merci à Sam.",
    "Les résultats sont incroyables, je n'aurais jamais cru ça possible.",
    "Sam a su me motiver et me guider vers une meilleure version de moi-même.",
    "Chaque séance est un défi que j'adore relever grâce à Sam.",
    "Mon corps a changé, mon esprit aussi. Coach Sam est le meilleur !",
    "Je suis plus fort, plus rapide, et en meilleure santé. Que demander de plus ?",
    "Sam est un coach exceptionnel, toujours à l'écoute et de bon conseil.",
    "J'ai retrouvé le plaisir de faire du sport et de prendre soin de moi.",
    "Les entraînements sont adaptés et efficaces. Je suis très satisfait."
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