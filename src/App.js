import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { InlineWidget } from 'react-calendly';
import { useInView } from 'react-intersection-observer';
import './App.css';
import Blog from './Blog';
import Outils from './Outils';
import Questionnaire from './Questionnaire';
import Contact from './Contact';
import AvantApres from './AvantApres';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import AdminPage from './AdminPage';
import UserProgramCalendar from './UserProgramCalendar';
import SessionPage from './SessionPage';
import BodyMeasurementsPage from './BodyMeasurementsPage';
import apiUrl from './apiConfig';

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

    fetch(`${apiUrl}/send-email`, {
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

  const testimonials = [
    {
      imgSrc: "https://placehold.co/300x300",
      altText: "Grandingo",
      quote: "J'avais tout essayé pour perdre du poids, sans succès. Avec Sam, j'ai perdu 15 kg en 2 mois et, surtout, j'ai appris à aimer le sport. Son approche bienveillante a tout changé !",
      author: "Grandingo, -15 kg"
    },
    {
      imgSrc: "https://placehold.co/301x301",
      altText: "Elio",
      quote: "Je voulais prendre de la masse mais je stagnais. Le programme de Sam, allié à ses conseils en nutrition, m'a permis de gagner 8 kg de muscle propre. Un vrai pro !",
      author: "Elio, +8 kg de muscle"
    },
    {
      imgSrc: "https://placehold.co/302x302",
      altText: "Mohamed",
      quote: "En tant que coureur, je devais améliorer mon endurance pour un marathon. Sam a structuré ma préparation et m'a permis de passer sous la barre des 3h30. Inestimable.",
      author: "Mohamed, Marathonien"
    },
    {
      imgSrc: "https://placehold.co/303x303",
      altText: "Laura",
      quote: "Le coaching de Sam a été une révélation. J'ai non seulement atteint mon objectif de poids, mais j'ai aussi retrouvé une énergie que je ne pensais plus possible. Un grand merci !",
      author: "Laura, -10 kg"
    },
    {
      imgSrc: "https://placehold.co/304x304",
      altText: "Julien",
      quote: "Je m'entraînais depuis des années sans voir de réels progrès. Sam a su identifier mes erreurs et m'a créé un programme qui a tout changé. Les résultats sont là !",
      author: "Julien, +5 kg de muscle"
    },
    {
      imgSrc: "https://placehold.co/305x305",
      altText: "Sophie",
      quote: "Je détestais courir. Sam m'a appris à aimer ça et j'ai terminé mon premier 10km. Jamais je n'aurais cru ça possible. Son soutien est incroyable.",
      author: "Sophie, Course à pied"
    },
    {
      imgSrc: "https://placehold.co/306x306",
      altText: "David",
      quote: "J'ai perdu 20kg en 6 mois. Sam est plus qu'un coach, c'est un véritable partenaire de réussite. Il est toujours là pour vous motiver et vous conseiller.",
      author: "David, -20 kg"
    },
    {
      imgSrc: "https://placehold.co/307x307",
      altText: "Chloé",
      quote: "Au-delà de la transformation physique, c'est ma confiance en moi qui a explosé. Les séances avec Sam sont un vrai boost pour le moral.",
      author: "Chloé, Confiance en soi"
    },
    {
      imgSrc: "https://placehold.co/308x308",
      altText: "Alexandre",
      quote: "Je préparais un concours sportif et Sam a été essentiel dans ma réussite. Son expertise et sa rigueur m'ont permis d'être au top le jour J.",
      author: "Alexandre, Préparation physique"
    },
    {
      imgSrc: "https://placehold.co/309x309",
      altText: "Manon",
      quote: "J'avais peur de ne pas y arriver, mais Sam a su me mettre en confiance. J'ai perdu 8kg et je me sens tellement mieux dans mon corps et dans ma tête.",
      author: "Manon, -8 kg"
    },
    {
      imgSrc: "https://placehold.co/310x310",
      altText: "Thomas",
      quote: "Un coach à l'écoute et très professionnel. Il m'a permis de dépasser mes limites et d'atteindre des objectifs que je pensais inaccessibles.",
      author: "Thomas, +7 kg de muscle"
    },
    {
      imgSrc: "https://placehold.co/311x311",
      altText: "Elodie",
      quote: "Je cherchais à me remettre en forme après ma grossesse. Sam a été d'une grande aide pour retrouver mon corps et mon énergie. Je le recommande à 100%.",
      author: "Elodie, Bien-être"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 3 + testimonials.length) % testimonials.length);
  };

  return (
  <>
    <section id="hero" className="hero-section">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src={process.env.PUBLIC_URL + "/hero_video.mov"} type="video/quicktime" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-profile-image-container">
          <img src={process.env.PUBLIC_URL + "/images/profile_coach_sam.png"} alt="Photo de Coach Sam" />
        </div>
        <h1>Transformez Votre Vie, Pas Seulement Votre Corps.</h1>
        <p>Rejoignez-moi et devenez la meilleure version de vous-même.</p>
        <a href="#booking" className="cta-button">Réserver votre appel</a>
      </div>
    </section>

    <section id="services">
      <h2>Mes Services</h2>
      <p className="section-intro">
        Plus qu’un simple programme, je vous propose un travail d’équipe, vos envies avec mes solutions pour vous.
        Je suis là pour que l’on travail ensemble, pas vous donner un programme, mais le construire de À à Z ensemble.
        Chacun des services proposés ci-dessous, est là pour vous, pour vos objectifs, pour réaliser vos rêves.
        Il n’y a pas de solution mieux que d’autre, il y en a des + adaptées selon votre profil.
      </p>
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
          title="Entrainement en distencielle"
          description="Rejoignez des entraînements à distance en direct. Des sessions interactives pour vous dépasser depuis chez vous."
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
      <div className="testimonial-carousel">
        <button className="carousel-arrow prev" onClick={prev}>&#10094;</button>
        <div className="testimonial-cards">
          {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
            <AnimatedTestimonialCard
              key={index}
              animationDirection="from-left"
              imgSrc={testimonial.imgSrc}
              altText={testimonial.altText}
              quote={testimonial.quote}
              author={testimonial.author}
            />
          ))}
        </div>
        <button className="carousel-arrow next" onClick={next}>&#10095;</button>
      </div>
    </section>

    <section id="booking">
      <h2>Réservez Votre Séance</h2>
      <InlineWidget url="https://calendly.com/mohamed-echchkoubi/30min" />
    </section>

    <section id="about" className="about-section">
      <div ref={aboutRef} className={`about-content ${aboutInView ? 'is-visible' : ''}`}>
        <h2>Le coach derrière les résultats</h2>
        <p className="award-text">Élu meilleur coach de France 🇫🇷</p>
        <p>Passionné de sport depuis toujours, mais lorsque j’ai découvert que je pouvais aider a améliorer des vie a travers le sport, je n’ai pas hésité.
Mon approche du coaching est de vous rendre autonome dans votre vie sportive / nutritionnelle, afin que l’on atteigne ensemble vos objectifs et que vous puissiez battre de vos propres ailes par la suite.
Si vous doutez de vous, je vous montrez que vous méritez mieux que ce simple doute.</p>
      </div>
    </section>

    <section id="nutrition-pillars">
      <h2>5 Piliers Nutrition</h2>
      <ol>
        <li>Manger équilibré : un repas avec protéines, glucides complexes et légumes.</li>
        <li>Privilégier le naturel : aliments frais et peu transformés.</li>
        <li>S’hydrater suffisamment : eau tout au long de la journée.</li>
        <li>Adapter les portions à l’objectif : perte de poids, prise de masse ou maintien.</li>
        <li>Être régulier : des habitudes simples et constantes pour progresser durablement.</li>
      </ol>
    </section>

    <section id="blog">
      <Blog />
    </section>

    <section id="contact" className="contact-section">
      <div ref={contactRef} className={`contact-content-wrapper ${contactInView ? 'is-visible' : ''}`}>
        <h2>Prêt à commencer ?</h2>
        <div className="contact-grid">
          <div className="contact-info-container">
            <div className="info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h4>Adresse</h4>
              <p>Orange 84100</p>
            </div>
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h4>Email</h4>
              <p>Samuel.coaching.84@gmail.com</p>
            </div>
            <div className="social-links-contact">
              <a href="https://www.facebook.com/p/Samuel-Wehbe-100093540156811/"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/samuelwehbe/?igsh=MXJ4eHVudjJ3anl0aw%3D%3D"><i className="fab fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/mohamed-ech-chkoubi-a15954227/?originalSubdomain=fr"><i className="fab fa-linkedin-in"></i></a>
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
  
  // State for authentication
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect to check admin status when authenticated
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (token) {
        try {
          const response = await fetch(`${apiUrl}/api/auth/check-admin`, {
            headers: {
              'x-auth-token': token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.isAdmin);
            setIsAuthenticated(true);
          } else {
            // Invalid token, logout
            handleLogout();
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, [token]);

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Login handler to be passed to LoginPage
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router basename="/coachsam-website">
      <div className="App">
        <header className={`App-header ${scrolled ? 'scrolled' : ''}`}>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            <ul>
              {/* Common links */}
              <li><Link to="/#hero" onClick={toggleMenu}>Accueil</Link></li>
              <li><Link to="/#services" onClick={toggleMenu}>Services</Link></li>
              <li><Link to="/#testimonials" onClick={toggleMenu}>Témoignages</Link></li>
              <li><Link to="/#booking" onClick={toggleMenu}>Réserver votre appel</Link></li>
              <li><Link to="/avant-apres" onClick={toggleMenu}>Avant Après</Link></li>
              <li><Link to="/outils" onClick={toggleMenu}>Outils</Link></li>
              <li><Link to="/questionnaire" onClick={toggleMenu}>Questionnaire</Link></li>
              <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
              
              {/* Conditional links */}
              {isAuthenticated ? (
                <>
                  {isAdmin && <li><Link to="/admin" onClick={toggleMenu}>Admin</Link></li>}
                  <li><Link to="/profile" onClick={toggleMenu}>Profil</Link></li>
                  <li><a href="/" onClick={(e) => { e.preventDefault(); handleLogout(); toggleMenu(); }} className="logout-button">Déconnexion</a></li>
                </>
              ) : (
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
              )}
              
              <li><Link to="/"><img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Coach Sam Logo" className="nav-logo" /></Link></li>
            </ul>
          </nav>
          <button className="hamburger-menu" onClick={toggleMenu}>
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
        </header>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/outils" element={<Outils />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/avant-apres" element={<AvantApres />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Profile Route */}
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profile/body-measurements" element={isAuthenticated ? <BodyMeasurementsPage /> : <Navigate to="/login" />} />
          
          {/* Protected Admin Route */}
          <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="/admin/user/:userId/program" element={isAuthenticated && isAdmin ? <UserProgramCalendar /> : <Navigate to="/" />} />
          <Route path="/admin/user/:userId/body-measurements" element={isAuthenticated && isAdmin ? <BodyMeasurementsPage /> : <Navigate to="/" />} />

          {/* Protected Session Route */}
          <Route path="/session/:programId" element={isAuthenticated ? <SessionPage /> : <Navigate to="/login" />} />
        </Routes>

        <footer>
          <div className="footer-content">
            <div className="footer-logo">
              <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Coach Sam Logo" />
              <p>Transformez Votre Vie, Pas Seulement Votre Corps.</p>
            </div>
            <div className="footer-links">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/#hero">Accueil</Link></li>
                <li><Link to="/#services">Services</Link></li>
                <li><Link to="/#testimonials">Témoignages</Link></li>
                <li><Link to="/#booking">Réserver</Link></li>
                <li><Link to="/avant-apres">Avant Après</Link></li>
                <li><Link to="/outils">Outils</Link></li>
                <li><Link to="/questionnaire">Questionnaire</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-social">
              <h4>Suivez-moi</h4>
              <div className="social-links">
                <a href="https://www.facebook.com/p/Samuel-Wehbe-100093540156811/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/samuelwehbe/?igsh=MXJ4eHVudjJ3anl0aw%3D%3D" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/in/mohamed-ech-chkoubi-a15954227/?originalSubdomain=fr" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Coach Sam. By Ech-Chkoubi Mohamed.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
