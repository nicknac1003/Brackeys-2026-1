require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1); // Trust first proxy

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter); // Apply general rate limiter to all routes


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.use('/jcgames/auth', authLimiter, authRoutes);
app.use('/jcgames/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
