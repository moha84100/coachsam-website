require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { formType, ...formData } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions;

  if (formType === 'contact') {
    const { name, email, message } = formData;
    mailOptions = {
      from: `"Coach Sam" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: [process.env.EMAIL_USER, 'samuel.coaching@gmail.com'],
      subject: `Nouveau message de ${name}`,
      text: message
    };
  } else if (formType === 'questionnaire') {
    let emailBody = 'Nouveau questionnaire rempli :\n\n';
    for (const [key, value] of Object.entries(formData)) {
      emailBody += `${key}: ${value}\n`;
    }

    mailOptions = {
      from: `"Coach Sam" <${process.env.EMAIL_USER}>`,
      to: [process.env.EMAIL_USER, 'samuel.coaching@gmail.com'],
      subject: 'Nouveau questionnaire rempli',
      text: emailBody
    };
  } else {
    return res.status(400).send('Type de formulaire invalide.');
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Une erreur est survenue.');
    } else {
      console.log('E-mail envoyé : ' + info.response);
      res.status(200).send('E-mail envoyé avec succès !');
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
