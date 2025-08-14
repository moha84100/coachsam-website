import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { InlineWidget } from 'react-calendly';
import { useInView } from 'react-intersection-observer';
import './App.css';
import Blog from './Blog';
import Outils from './Outils';
import Questionnaire from './Questionnaire';
import Contact from './Contact'; // Added Contact import
import AvantApres from './AvantApres';

// Animated Service Card Component
const AnimatedServiceCard = ({ icon, title, description, buttonText, animationDirection }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.2,    // Trigger when 20% of the card is visible
  });

  return (
    <div ref={ref} className={`service-card ${animationDirection} ${inView ? 'is-visible' : ''}`}>
      <i className={`fas ${icon} service-icon`}></i>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href="#booking" className="service-button">{buttonText}</a>
    </div>
  );
};

// Animated Testimonial Card Component
const AnimatedTestimonialCard = ({ imgSrc, altText, quote, author, animationDirection }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div ref={ref} className={`testimonial-card ${animationDirection} ${inView ? 'is-visible' : ''}`}>
      <img src={imgSrc} alt={altText} />
      <blockquote>
        "{quote}"
        <cite>- {author}</cite>
      </blockquote>
    </div>
  );
};

// Main Page Component
const MainPage = () => {
  const location = useLocation();
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: contactRef, inView: contactInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: 'contact',
        name,
        email,
        message,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Something went wrong.');
      });
  };


  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
  <>
    <section id="hero" className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src={process.env.PUBLIC_URL + "/hero_video.mp4"} type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-profile-image-container">
          <img src={process.env.PUBLIC_URL + "/images/profile_coach_sam.png"} alt="Photo de Coach Sam" />
        </div>
        <h1>Transformez Votre Vie, Pas Seulement Votre Corps.</h1>
        <p>Rejoignez-moi et devenez la meilleure version de vous-même.</p>
        <a href="#booking" className="cta-button">Réserver ma séance</a>
      </div>
    </section>

    <section id="services">
      <h2>Mes Services</h2>
      <p className="section-intro">Plus qu'un simple programme, je vous propose un partenariat. Mon approche n'est pas de vous imposer un plan, mais de le construire <strong>avec vous</strong>. Chaque service ci-dessous est une invitation à commencer un parcours où votre motivation et mon expertise se rencontrent pour atteindre, et dépasser, vos objectifs.</p>
      <div className="services-grid">
        <AnimatedServiceCard 
          animationDirection="from-left"
          icon="fa-user-shield"
          title="Coaching Individuel"
          description="Un suivi 100% personnalisé pour des résultats optimaux. Bilan complet, programme sur mesure et motivation constante."
          buttonText="Commencer"
        />
        <AnimatedServiceCard 
          animationDirection="from-right"
          icon="fa-users"
          title="Coaching en Groupe"
          description="Rejoignez une communauté dynamique et motivante. Des sessions collectives pour se dépasser ensemble dans la bonne humeur."
          buttonText="Rejoindre"
        />
        <AnimatedServiceCard 
          animationDirection="from-left"
          icon="fa-laptop-code"
          title="Programmes en Ligne"
          description="La flexibilité d'un entraînement de qualité, où que vous soyez. Accès à des vidéos, des plans et un suivi à distance."
          buttonText="Découvrir"
        />
        <AnimatedServiceCard 
          animationDirection="from-right"
          icon="fa-dumbbell"
          title="Préparation Physique"
          description="Optimisez vos performances pour une compétition ou un événement sportif. Planification ciblée pour atteindre votre pic de forme."
          buttonText="Se préparer"
        />
      </div>
    </section>

    <section id="testimonials">
      <h2>Ce que disent mes clients</h2>
      <div className="testimonial-cards">
        <AnimatedTestimonialCard
          animationDirection="from-left"

          imgSrc={process.env.PUBLIC_URL + "/grandingo.jpg"}
          altText="Grandingo"
          quote="J'avais tout essayé pour perdre du poids, sans succès. Avec Sam, j'ai perdu 15 kg en 2 mois et, surtout, j'ai appris à aimer le sport. Son approche bienveillante a tout changé !"
          author="Grandingo, -15 kg"
        />
        <AnimatedTestimonialCard
          animationDirection="from-right"
          imgSrc="https://img.freepik.com/photos-premium/corps-est-ne-travail-acharne-determination-portrait-jeune-homme-torse-nu-muscle-debout-exterieur_590464-39559.jpg"
          altText="Elio"
          quote="Je voulais prendre de la masse mais je stagnais. Le programme de Sam, allié à ses conseils en nutrition, m'a permis de gagner 8 kg de muscle propre. Un vrai pro !"
          author="Elio, +8 kg de muscle"
        />
        <AnimatedTestimonialCard
          animationDirection="from-left"
          imgSrc={process.env.PUBLIC_URL + "/ma_photo_de_profil.jpg"}
          altText="Mohamed"
          quote="En tant que coureur, je devais améliorer mon endurance pour un marathon. Sam a structuré ma préparation et m'a permis de passer sous la barre des 3h30. Inestimable."
          author="Mohamed, Marathonien"
        />
      </div>
    </section>

    <section id="booking">
      <h2>Réservez Votre Séance</h2>
      <InlineWidget url="https://calendly.com/mohamed-echchkoubi/30min" />
    </section>

    <section id="about" className="about-section">
      <div ref={aboutRef} className={`about-content ${aboutInView ? 'is-visible' : ''}`}>
        <h2>Le Coach derriere les resultats</h2>
        <p className="award-text">Élu Meilleur Coach de France</p>
        <p>Ancien athlète de haut niveau, ma passion est de traduire la science de la performance en résultats concrets pour vous. Ma méthode n'est pas universelle, elle est personnelle. Je m'engage à comprendre vos objectifs, à respecter vos limites et à construire, ensemble, le chemin le plus efficace vers votre meilleure version.</p>
      </div>
    </section>

    <section id="blog">
      <Blog />
    </section>

    <section id="contact" className="contact-section">
      <div ref={contactRef} className={`contact-content-wrapper ${contactInView ? 'is-visible' : ''}`}>
        <h2>Prêt à commencer ?</h2>
        <p className="section-intro">Contactez-moi pour toute question ou pour planifier votre première séance. C'est le premier pas vers votre nouvelle vie.</p>
        <div className="contact-grid">
          <div className="contact-form-container">
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Votre Nom" required value={name} onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Votre Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea placeholder="Votre message..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              <button type="submit">Envoyer le Message</button>
            </form>
          </div>
          <div className="contact-info-container">
            <div className="info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h4>Adresse</h4>
              <p>Rue d'Espagne, 84100 Orange</p>
            </div>
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h4>Email</h4>
              <p>samuel.coaching@gmail.com</p>
            </div>
            <div className="info-card">
              <i className="fas fa-phone"></i>
              <h4>Téléphone</h4>
              <p>07 67 61 44 46</p>
            </div>
            <div className="social-links-contact">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
)};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className={`App-header ${scrolled ? 'scrolled' : ''}`}>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            <ul>
              <li><Link to="/#hero" onClick={toggleMenu}>Accueil</Link></li>
              <li><Link to="/#services" onClick={toggleMenu}>Services</Link></li>
              <li><Link to="/#testimonials" onClick={toggleMenu}>Témoignages</Link></li>
              <li><Link to="/#booking" onClick={toggleMenu}>Réserver</Link></li>
              <li><Link to="/avant-apres" onClick={toggleMenu}>Avant Après</Link></li>
              <li><Link to="/outils" onClick={toggleMenu}>Outils</Link></li>
              <li><Link to="/questionnaire" onClick={toggleMenu}>Questionnaire</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li> {/* Added Contact link */}
              <li><Link to="/"><img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Coach Sam Logo" className="nav-logo" /></Link></li>
            </ul>
          </nav>
          <button className="hamburger-menu" onClick={toggleMenu}>
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
        </header>

        <Routes>
          <Route path="/" element={<MainPage />} /> {/* Changed from AvantApres */}
          <Route path="/outils" element={<Outils />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/avant-apres" element={<AvantApres />} />
          <Route path="/contact" element={<Contact />} /> {/* Added Contact route */}
        </Routes>

        <footer>
          <p>&copy; 2025 Coach Sam. By Ech-Chkoubi Mohamed.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;