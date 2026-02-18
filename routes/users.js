const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get leaderboard with pagination (protected route)
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Validate page number
    if (page < 1) {
      return res.status(400).json({ error: 'Page number must be greater than 0' });
    }

    // Get total count of users
    const countResult = await db.query('SELECT COUNT(*) FROM players');
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get paginated leaderboard with rank
    const result = await db.query(
      `SELECT rank, id, name, money FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY money DESC, last_updated ASC) AS rank, id, name, money
        FROM players
      ) ranked
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        perPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//update user money and return place in leaderboard
router.post('/update-money', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { money } = req.body;

    if (typeof money !== 'number') {
      return res.status(400).json({ error: 'Money must be a number' });
    }

    // Update user's money
    await db.query('UPDATE players SET money = $1, last_updated = NOW() WHERE id = $2', [money, userId]);

    // Get user's new rank
    const rankResult = await db.query(
      'SELECT COUNT(*) + 1 AS rank FROM players WHERE money > $1 OR (money = $1 AND last_updated < (SELECT last_updated FROM players WHERE id = $2))',
      [money, userId]
    );
    const rank = rankResult.rows[0].rank;
    res.json({ message: 'Money updated successfully', rank });
  } catch (error) {
    console.error('Update money error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
