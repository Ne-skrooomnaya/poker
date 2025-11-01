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
        unique: true, // Добавляем unique: true сюда
        sparse: true, // Опционально: позволяет хранить null значения, если username отсутствует. Это может помочь, если Telegram не всегда его отдает.
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
    }, {
      timestamps: true,
    });

    module.exports = mongoose.model('User', userSchema);
