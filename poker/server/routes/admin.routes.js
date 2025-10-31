// server/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');
// const authMiddleware = require('../middleware/authMiddleware'); // Если нужно

// POST /admin/update-rating - Обновить рейтинг пользователя
// router.post('/update-rating', authMiddleware, async (req, res) => { // Защищаем роут
router.post('/update-rating', async (req, res) => { // Пока без защиты
  const { userId, score } = req.body;

  if (!userId || score === undefined || score === null) {
    return res.status(400).json({ message: 'User ID and score are required' });
  }

  // Дополнительная проверка, что текущий пользователь (из токена) является админом
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ message: 'Forbidden: Only admins can update ratings' });
  // }

  try {
    // Проверяем, существует ли пользователь
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Обновляем или создаем запись в рейтинге
    let rating = await Rating.findOne({ userId: userId });

    if (rating) {
      rating.score = score;
    } else {
      rating = new Rating({
        userId: userId,
        score: score,
      });
    }

    await rating.save();
    res.json({ message: 'Rating updated successfully', rating });

  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: 'Server error updating rating' });
  }
});

// TODO: Добавить другие админские функции (например, управление пользователями, удаление и т.д.)

module.exports = router;
