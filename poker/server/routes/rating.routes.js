const express = require('express');
const router = express.Router();
const Rating = require('../models/rating.model');

// Получение всех записей рейтинга
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получение записи рейтинга по telegramId
router.get('/:telegramId', async (req, res) => {
  try {
    const rating = await Rating.findOne({ telegramId: req.params.telegramId });
    if (!rating) {
      return res.status(404).json({ message: 'Cannot find rating' });
    }
    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Создание новой записи рейтинга
router.post('/', async (req, res) => {
  const { telegramId, points } = req.body;

  // Проверка существования записи с данным telegramId
  const existingRating = await Rating.findOne({ telegramId });
  if (existingRating) {
    return res.status(400).json({ message: 'Rating with this telegramId already exists' });
  }

  const rating = new Rating({
    telegramId,
    telegramUsername: req.body.telegramUsername,  // Оставить, как есть, если нужно.
    points,
  });

  try {
    const newRating = await rating.save();
    res.status(201).json(newRating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновление записи рейтинга
router.patch('/:telegramId', async (req, res) => {
  try {
    const rating = await Rating.findOne({ telegramId: req.params.telegramId });
    if (!rating) {
      return res.status(404).json({ message: 'Cannot find rating' });
    }
    rating.points = req.body.points
    const updatedRating = await rating.save();
    res.json(updatedRating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удаление записи рейтинга
router.delete('/:telegramId', async (req, res) => {
  try {
    const rating = await Rating.findOne({ telegramId: req.params.telegramId });
    if (!rating) {
      return res.status(404).json({ message: 'Cannot find rating' });
    }

    await Rating.deleteOne({ telegramId: req.params.telegramId }); // Use deleteOne instead of remove
    res.json({ message: 'Deleted Rating' });
  } catch (err) {
    console.error("Ошибка при удалении:", err); // Выводим ошибку
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
