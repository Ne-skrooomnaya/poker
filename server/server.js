// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Для загрузки переменных окружения

const app = express();

// --- Переменные окружения ---
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// --- Подключение к MongoDB ---
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(express.json()); // Для парсинга JSON-запросов
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Укажите ваш домен на Render для продакшена
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- API Routes (Важно: Эти маршруты должны быть ПЕРЕД обслуживанием статики) ---
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ratingRoutes = require('./routes/rating.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/auth', authRoutes); // Например, /auth/login
app.use('/users', userRoutes); // Например, /users
app.use('/rating', ratingRoutes); // Например, /rating
app.use('/admin', adminRoutes); // Например, /admin/update-rating

// --- Обслуживание статических файлов фронтенда ---
// Путь к папке 'build' вашего React-приложения
// Предполагается, что 'server' и 'client' находятся в одной корневой папке 'poker'
const frontendBuildPath = path.join(__dirname, '../client/build');

// 1. Сначала отдаем статические файлы (CSS, JS, изображения и т.д.)
app.use(express.static(frontendBuildPath));

// 2. Затем, для всех остальных GET-запросов (которые не являются статическими файлами
// и не являются API-маршрутами), отдаем index.html.
// Это позволяет клиентскому роутеру (например, React Router) обрабатывать маршруты.
// server/server.js
// ... (ваш существующий код)

// Важно: Этот маршрут должен быть ПОСЛЕ всех ваших API маршрутов и express.static
app.get(/.*/, (req, res) => { // Использование регулярного выражения для "любого маршрута"
  res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
});

// ... (остальной код)



// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});