const path = require('path');
// Only use dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'https://moha84100.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.json());

// Function to log errors to a file
const logError = (error) => {
  const logFilePath = path.join(__dirname, 'backend_errors.log');
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ${error}\n`;
  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
  console.error(error); // Still log to console for immediate visibility
};

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
      logError(error);
      res.status(500).send('Une erreur est survenue.');
    } else {
      console.log('E-mail envoyé : ' + info.response);
      res.status(200).send('E-mail envoyé avec succès !');
    }
  });
});


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Debugging MONGO_URI
console.log("--- DEBUGGING ENV VARS ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("--------------------------");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => logError(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

// Program Schema
const ProgramSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String },
  isRestDay: { type: Boolean, default: false },
  exercises: [{
    name: String,
    category: String,
    sets: Number,
    reps: String,
    videoUrl: String,
  }],
});

const Program = mongoose.model('Program', ProgramSchema);

// Body Measurement Schema
const BodyMeasurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  objective: { type: String, default: 'maintien' },
  measurements: {
    poids: { value: String, comment: String },
    taille: { value: String, comment: String },
    cou: { value: String, comment: String },
    epaule: { value: String, comment: String },
    poitrine: { value: String, comment: String },
    bras: { value: String, comment: String },
    nombril: { value: String, comment: String },
    fesses: { value: String, comment: String },
    cuisse: { value: String, comment: String },
    mollet: { value: String, comment: String },
  },
  history: [
    {
      date: Date,
      measurements: {
        poids: { value: String, comment: String },
        taille: { value: String, comment: String },
        cou: { value: String, comment: String },
        epaule: { value: String, comment: String },
        poitrine: { value: String, comment: String },
        bras: { value: String, comment: String },
        nombril: { value: String, comment: String },
        fesses: { value: String, comment: String },
        cuisse: { value: String, comment: String },
        mollet: { value: String, comment: String },
      },
    },
  ],
});

const BodyMeasurement = mongoose.model('BodyMeasurement', BodyMeasurementSchema);

// Diet Schema
const DietSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  notes: { type: String, default: '' },
});

const Diet = mongoose.model('Diet', DietSchema);


// API Endpoints

// Register a new user
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login a user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Middleware to authenticate user
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    logError(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to authenticate admin
const adminAuth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied, not an admin' });
    }
    next();
  } catch (err) {
    logError(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Check admin status
app.get('/api/auth/check-admin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ isAdmin: user.isAdmin, userId: req.user.id });
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users (Admin only)
app.get('/api/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Grant admin rights to a user (Admin only)
app.put('/api/users/:id/make-admin', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User is now an admin', user });
  } catch (err) {
    logError(err.message);
    // Check for invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's programs
app.get('/api/programs', auth, async (req, res) => {
  try {
    const programs = await Program.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(programs);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a new program (Admin only)
app.post('/api/programs/add', adminAuth, async (req, res) => {
  const { userId, date, title, description, isRestDay, exercises } = req.body;

  try {
    const newProgram = new Program({
      userId,
      date,
      title,
      description,
      isRestDay,
      exercises,
    });

    const program = await newProgram.save();
    res.json(program);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Add multiple recurring programs (Admin only)
app.post('/api/programs/add-recurring', adminAuth, async (req, res) => {
  const programsToAdd = req.body; // Expecting an array of program objects

  if (!Array.isArray(programsToAdd) || programsToAdd.length === 0) {
    return res.status(400).json({ msg: 'Request body must be a non-empty array of programs' });
  }

  try {
    const savedPrograms = await Promise.all(programsToAdd.map(async (programData) => {
      const { userId, date, title, description, isRestDay, exercises } = programData;
      const newProgram = new Program({
        userId,
        date,
        title,
        description,
        isRestDay,
        exercises,
      });
      return await newProgram.save();
    }));
    res.json(savedPrograms);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Get all programs for all users (Admin only)
app.get('/api/programs/all', adminAuth, async (req, res) => {
  try {
    // Populate userId to get user details like name and email
    const programs = await Program.find().sort({ date: 1 }).populate('userId', ['name', 'email']);
    res.json(programs);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Get all programs for a specific user (Admin only)
app.get('/api/programs/user/:userId', adminAuth, async (req, res) => {
  try {
    const programs = await Program.find({ userId: req.params.userId }).sort({ date: 1 });
    res.json(programs);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a single program by ID (for session details page)
app.get('/api/programs/:id', auth, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ msg: 'Program not found' });
    }

    // Security check: ensure the program belongs to the user
    if (program.userId.toString() !== req.user.id) {
      // Also allow admin access
      const adminUser = await User.findById(req.user.id);
      if (!adminUser.isAdmin) {
        return res.status(403).json({ msg: 'User not authorized' });
      }
    }

    res.json(program);
  } catch (err) {
    logError(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Program not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a program (Admin only)
app.put('/api/programs/:id', adminAuth, async (req, res) => {
  const { date, title, description, isRestDay, exercises } = req.body;

  try {
    let program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ msg: 'Program not found' });
    }

    // Update fields
    if (date) program.date = date;
    if (title) program.title = title;
    if (description !== undefined) program.description = description;
    if (isRestDay !== undefined) program.isRestDay = isRestDay;
    if (exercises) program.exercises = exercises;

    program = await program.save();
    res.json(program);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get body measurements for a user
app.get('/api/body-measurements/:userId', auth, async (req, res) => {
  try {
    const bodyMeasurements = await BodyMeasurement.findOne({ userId: req.params.userId });

    if (!bodyMeasurements) {
      return res.status(404).json({ msg: 'Body measurements not found' });
    }

    // Security check: ensure the body measurements belong to the user or the user is an admin
    if (req.user.id !== req.params.userId) {
      const adminUser = await User.findById(req.user.id);
      if (!adminUser.isAdmin) {
        return res.status(403).json({ msg: 'User not authorized' });
      }
    }

    res.json(bodyMeasurements);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Save or update body measurements for a user
app.post('/api/body-measurements/:userId', auth, async (req, res) => {
  const { objective, measurements, history } = req.body;

  try {
    let bodyMeasurements = await BodyMeasurement.findOne({ userId: req.params.userId });

    if (!bodyMeasurements) {
      // Create new entry if not found
      bodyMeasurements = new BodyMeasurement({
        userId: req.params.userId,
        objective,
        measurements,
        history,
      });
    } else {
      // Update existing entry
      bodyMeasurements.objective = objective;
      bodyMeasurements.measurements = measurements;
      bodyMeasurements.history = history;
    }

    // Security check: ensure the body measurements belong to the user or the user is an admin
    if (req.user.id !== req.params.userId) {
      const adminUser = await User.findById(req.user.id);
      if (!adminUser.isAdmin) {
        return res.status(403).json({ msg: 'User not authorized' });
      }
    }

    await bodyMeasurements.save();
    res.json(bodyMeasurements);
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a program (Admin only)
app.delete('/api/programs/:id', adminAuth, async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ msg: 'Program not found' });
    }

    res.json({ msg: 'Program removed' });
  } catch (err) {
    logError(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get diet notes for a user (Authenticated users and Admin)

app.get('/api/diet/:userId/notes', auth, async (req, res) => {

  try {

    // Security check: ensure the user can only access their own diet notes, or the user is an admin

    if (req.user.id !== req.params.userId) {

      const adminUser = await User.findById(req.user.id);

      if (!adminUser.isAdmin) {

        return res.status(403).json({ msg: 'User not authorized' });

      }

    }



    const dietEntry = await Diet.findOne({ userId: req.params.userId });



    if (!dietEntry) {

      return res.status(404).json({ msg: 'Diet notes not found for this user' });

    }



    res.json({ notes: dietEntry.notes });

  } catch (err) {

    logError(err.message);

    res.status(500).json({ msg: 'Server error' });

  }

});



// Create or Update diet notes for a user (Authenticated users and Admin)

app.post('/api/diet/notes', auth, async (req, res) => {

  const { userId, notes } = req.body;



  try {

    // Security check: ensure the user can only modify their own diet notes, or the user is an admin

    if (req.user.id !== userId) {

      const adminUser = await User.findById(req.user.id);

      if (!adminUser.isAdmin) {

        return res.status(403).json({ msg: 'User not authorized to modify these notes' });

      }

    }



    let dietEntry = await Diet.findOne({ userId });



    if (dietEntry) {

      // Update existing notes

      dietEntry.notes = notes;

    } else {

      // Create new notes entry

      dietEntry = new Diet({ userId, notes });

    }



    await dietEntry.save();

    res.json(dietEntry);

  } catch (err) {

    logError(err.message);

    res.status(500).json({ msg: 'Server error' });

  }

});



// Global error handling middleware

app.use((err, req, res, next) => {

  logError(err.stack); // Log the full stack trace for debugging

  res.status(err.statusCode || 500).json({

    msg: err.message || 'An unexpected server error occurred',

    error: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Provide stack trace in development

  });

});



app.listen(port, () => {

  console.log(`Serveur en écoute sur le port ${port}`);

});


