// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Предполагается, что у вас есть модель User

// POST /auth/login
// Принимает данные пользователя из Telegram и либо находит существующего,
// либо создает нового пользователя.
router.post('/login', async (req, res) => {
  const { telegramId, username, firstName, lastName, photoUrl } = req.body;

  if (!telegramId) {
    return res.status(400).json({ message: 'Telegram ID is required' });
  }

  try {
    let user = await User.findOne({ telegramId });

    if (user) {
      // Пользователь существует, обновляем данные, если нужно
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.photoUrl = photoUrl || user.photoUrl;
      // Важно: не обновляем роль, если она уже установлена
    } else {
      // Пользователь не существует, создаем нового
      user = new User({
        telegramId: telegramId,
        username: username,
        firstName: firstName,
        lastName: lastName,
        photoUrl: photoUrl,
        role: 'user', // Роль по умолчанию для новых пользователей
      });
    }

    await user.save();
    res.json({ message: 'User authenticated', user });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// TODO: Добавить роут для админов, если нужно

module.exports = router;