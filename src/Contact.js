import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer'; // Import useInView
import './Contact.css';

function Contact() {
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

  return (
    <section id="contact" className="contact-section">
      <div ref={contactRef} className={`contact-content-wrapper ${contactInView ? 'is-visible' : ''}`}>
        <h2>Contactez-nous</h2>
        <p className="section-intro">N'hésitez pas à nous contacter pour toute question ou demande d'information. C'est le premier pas vers votre nouvelle vie.</p>
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
              <a href="https://www.facebook.com/p/Samuel-Wehbe-100093540156811/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/samuelwehbe/?igsh=MXJ4eHVudjJ3anl0aw%3D%3D" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/mohamed-ech-chkoubi-a15954227/?originalSubdomain=fr" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
