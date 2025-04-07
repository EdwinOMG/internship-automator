require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;
const EXCEL_FILE = path.join(__dirname, 'internships.xlsx');

// Initialize Excel file
let workbook;
try {
  workbook = XLSX.readFile(EXCEL_FILE);
} catch (e) {
  workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Internships');
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
  scope: ['profile', 'email'],
  accessType: 'offline'
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    email: profile.emails[0].value,
    displayName: profile.displayName,
    provider: 'google'
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    email: user.email,
    displayName: user.displayName
  });
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

const jwt = require('jsonwebtoken'); // Install: npm install jsonwebtoken

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.displayName },
    process.env.JWT_SECRET || 'your-secret-key', // Add JWT_SECRET to .env
    { expiresIn: '1h' }
  );
};

const isAuthenticated = (req, res, next) => {
  // Check session-based auth (Passport.js)
  if (req.isAuthenticated()) return next();

  // Fallback: Check JWT token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user to request
      return next();
    } catch (err) {
      console.error("JWT verification failed:", err);
    }
  }

  res.status(401).json({ error: 'Not authenticated' });
};

// Routes
app.get('/auth/google', (req, res, next) => {
  req.session.returnTo = req.query.returnTo || '/dashboard';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user)
    // Redirect to homepage with token
    res.redirect(`http://localhost:5173/?token=${encodeURIComponent(token)}`)
  }
)
app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:5173');
});

// Protected Routes
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json(req.user);
});

app.post('/api/internships', isAuthenticated, (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming data
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Validate required fields
    if (!req.body.Company || !req.body.Role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    data.push(req.body);
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    
    XLSX.writeFile(workbook, EXCEL_FILE);
    console.log("Excel file updated successfully"); // Confirm save
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ error: 'Failed to update Excel file' });
  }
});

// Debug Endpoint (optional)
app.get('/debug-session', (req, res) => {
  console.log('Session data:', req.session);
  res.json(req.session);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Google OAuth configured with callback:', process.env.CALLBACK_URL);
});