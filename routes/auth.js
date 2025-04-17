const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check for required fields
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // Create new user
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ 
        username: newUser.username,
        gems: newUser.gems
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});


// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Check for required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
  
    try {
      // Find the user
      const user = await User.findOne({ username });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
  
      // Successful login
      return res.status(200).json({
        username: user.username,
        gems: user.gems
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error.' });
    }
});

// Update gems endpoint
router.post('/update-gems', async (req, res) => {
    const { username, gems } = req.body;
  
    if (!username || typeof gems !== 'number') {
      return res.status(400).json({ error: 'Username and numeric gems value are required.' });
    }
  
    try {
      const user = await User.findOneAndUpdate(
        { username },
        { $set: { gems } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      return res.status(200).json({
        username: user.username,
        gems: user.gems
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error.' });
    }
});

// Leaderboard endpoint
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ gems: -1 })
      .limit(50)
      .select('username gems');

    res.render('leaderboard', { users: topUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading leaderboard');
  }
});

module.exports = router;