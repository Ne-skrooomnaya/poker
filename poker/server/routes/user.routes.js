// server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const authMiddleware = require('../middleware/authMiddleware'); // Если нужно защитить роут

// GET /users - Получить список всех пользователей
// router.get('/', authMiddleware, async (req, res) => { // Защищаем роут, если требуется
router.get('/', async (req, res) => { // Пока без защиты для примера
  try {
    const users = await User.find({}, '_id username firstName lastName role'); // Выбираем нужные поля
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
