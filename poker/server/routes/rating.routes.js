// server/routes/rating.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/rating.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// GET /rating - Получить список рейтингов
router.get('/', async (req, res) => {
  try {
    // Получаем все записи рейтинга, сортируем по убыванию счета
    const ratings = await Rating.find()
      .populate('userId', 'username firstName lastName') // Присоединяем данные пользователя
      .sort({ score: -1 })
      .exec(); // exec() нужен после populate

    // Форматируем ответ, чтобы было удобнее отображать
    const formattedRatings = ratings.map(rating => ({
      _id: rating._id,
      score: rating.score,
      user: { // Объект user с нужными полями
        _id: rating.userId._id,
        username: rating.userId.username,
        firstName: rating.userId.firstName,
        lastName: rating.userId.lastName,
      }
    }));

    res.json(formattedRatings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: 'Server error fetching ratings' });
  }
});

module.exports = router;