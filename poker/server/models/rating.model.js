// server/models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Связь с моделью User
    required: true,
    unique: true, // Предполагается, что у каждого пользователя есть одна запись в рейтинге
  },
  score: {
    type: Number,
    default: 0,
  },
  // Можно добавить другие поля, например, для времени достижения лучшего результата
}, {
  timestamps: true,
});

module.exports = mongoose.model('Rating', ratingSchema);

