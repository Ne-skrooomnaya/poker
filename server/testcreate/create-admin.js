// // создание админов
// // createAdmin.js
// const mongoose = require('mongoose');
// const User = require('../models/user.model'); // Путь к вашей модели User
// require('dotenv').config(); // Подключаем dotenv для переменных окружения

// const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram_cafe'; // Используйте вашу строку подключения

// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(async () => {
//     console.log('Connected to MongoDB');

//     const adminUsername = 'admin';
//     const adminTelegramId = 'faiz_hair'; // Замените на настоящий Telegram ID

//     // Проверяем, существует ли админ уже
//     const existingAdmin = await User.findOne({ telegramUsername: adminUsername });

//     if (existingAdmin) {
//         console.log('Admin already exists');
//         mongoose.disconnect();
//         return;
//     }

//     const admin = new User({
//         telegramUsername: adminUsername,
//         telegramId: adminTelegramId,
//         firstName: 'Admin', // Добавьте имя
//         lastName: 'User',   // Добавьте фамилию
//         isAdmin: true,
//     });

//     await admin.save();
//     console.log('Admin created successfully');
//     mongoose.disconnect();
// })
// .catch(err => {
//     console.error('Error connecting to MongoDB or creating admin:', err);
// });
