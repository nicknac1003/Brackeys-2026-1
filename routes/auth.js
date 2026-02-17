const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Insert user into database
    const result = await db.query(
      'INSERT INTO players (id, name) VALUES ($1, $2) RETURNING id, name',
      [userId, name]
    );

    const user = result.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
