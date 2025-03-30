require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();

// Configuration
const EXCEL_FILE = path.join(__dirname, 'internships.xlsx');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
  scope: ['profile', 'email'] // Add required scopes
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Initialize Excel file
let workbook;
try {
  workbook = XLSX.readFile(EXCEL_FILE);
} catch (e) {
  workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships');
}

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard'); // Redirect to frontend
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Protected API Routes
app.post('/api/internships', isAuthenticated, (req, res) => {
  try {
    const newEntry = req.body;
    
    // Get first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Add new entry
    data.push(newEntry);
    
    // Update worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    
    // Save file
    XLSX.writeFile(workbook, EXCEL_FILE);
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Excel file' });
  }
});

// User info endpoint
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});