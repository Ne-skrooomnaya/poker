const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  photoUrl: {
    type: String,
  },
  role: { // Добавляем поле для роли: 'user' или 'admin'
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // Можете добавить другие поля, например, для рейтинга, если не хотите отдельную модель
  // ratingScore: { type: Number, default: 0 },
  // rank: { type: Number }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema)
