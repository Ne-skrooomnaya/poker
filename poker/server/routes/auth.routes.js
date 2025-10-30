const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Получение списка зарегистрированных пользователей (только telegramId и telegramUsername)
    router.get('/registered', async (req, res) => {
       console.log("Запрос к /users/registered"); // Добавьте эту строку
        try {
            const users = await User.find({}, 'telegramId telegramUsername'); // Получаем только telegramId и telegramUsername
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });


// Helper function to generate JWT token
const generateToken = (payload, secret, options) => {
    return jwt.sign(payload, secret, options);
};

    router.post('/telegram-login', async (req, res) => {
  const { telegramUsername, telegramId, firstName, lastName } = req.body;

  if (!telegramUsername || !telegramId) {
    return res.status(400).json({ message: 'Telegram username and telegramId are required' });
  }

  try {
    // Find the user based on the Telegram username (case-insensitive)
    let user = await User.findOne({ telegramUsername: telegramUsername.toLowerCase() });

    if (!user) {
      // User doesn't exist, create a new user
      user = new User({
        telegramUsername: telegramUsername.toLowerCase(),
        telegramId,
        firstName,
        lastName,
        isAdmin: false, // Default to false for new users
      });

      await user.save();
    } else {
      // User exists, verify the telegramId
      if (user.telegramId !== telegramId) {
        return res.status(403).json({ message: 'Invalid telegramId' }); // Telegram IDs do not match
      }
    }

    // Generate a JWT token for the user
    const payload = {
      userId: user.id,
      username: user.telegramUsername,
      isAdmin: user.isAdmin,
      type: 'user',
    };

    const token = generateToken(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token: token,
      user: {
        userId: user.id,
        username: user.telegramUsername,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error during Telegram login:", error);
    res.status(500).json({ message: 'Server error during Telegram login', error: error.message });
  }
});


module.exports = router;
