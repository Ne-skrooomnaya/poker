// server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path'); // Импортируем модуль path

// Импортируем ваши роуты
const authRoutes = require('./routes/auth.routes');
const ratingRouter = require('./routes/rating.routes');
// Убедитесь, что userRouter действительно импортируется из ./routes/auth.routes,
// если это так, можно использовать только authRoutes.
// Если userRouter - это отдельный роутер, то его нужно импортировать.
// Предположим, что authRoutes уже содержит логику для пользователей.
// const userRouter = require('./routes/auth.routes'); // Можно убрать, если authRoutes уже покрывает пользователей


// Загружаем переменные окружения из .env файла.
// Важно: на Render переменные окружения устанавливаются через панель управления,
// но dotenv.config() также работает локально.
dotenv.config();

const app = express();

// 1. Используем переменную окружения PORT, предоставляемую Render.
// Если process.env.PORT не установлен (например, при локальной разработке),
// используется значение из .env файла (если он есть и в нем указан PORT)
// или дефолтное значение (5000).
// Убедитесь, что в вашем .env файле указан PORT, если вы хотите использовать его локально.
const PORT = process.env.PORT || 5000; // Если вы хотите использовать 3001 локально, убедитесь, что в .env стоит PORT=3001


app.use(cors()); // Разрешает кросс-доменные запросы
app.use(bodyParser.json()); // Парсит входящие JSON-запросы

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    // process.env.MONGODB_URI должен быть установлен в переменных окружения Render
    // и в вашем локальном .env файле.
    await mongoose.connect(process.env.MONGODB_URI, {
      // dbName: 'telegram_cafe', // Если имя базы данных уже есть в URI, это необязательно.
                                  // Обычно оно выглядит как: mongodb+srv://.../myDataBase?
                                  // Если оно отсутствует, можете добавить его здесь.
      useNewUrlParser: true,      // Эти опции устарели, но часто встречаются в старых примерах.
      useUnifiedTopology: true,   // Рекомендуется убрать, если ваш Mongoose >= 6.0.0
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Завершаем процесс, если подключение к БД критично для работы сервера.
    // Если сервер может работать без БД (например, отдавать статику), можно не выходить.
    process.exit(1);
  }
};

// --- Обработка статических файлов фронтенда ---
// Это часть решения проблемы "Cannot GET /"
// Предполагается, что ваш фронтенд собирается в папку 'public' в директории 'client'.
// Если папка называется иначе (например, 'dist', 'build'), измените путь.
// __dirname - это текущая директория (server). Мы поднимаемся на уровень вверх (..),
// затем заходим в 'client' и ищем папку 'public'.
app.use(express.static(path.join(__dirname, '../client/public')));

// --- Маршрутизация ---

// Обработчик для корневого маршрута '/'
// Отдает index.html фронтенда.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

// API маршруты
// Убедитесь, что импортированные роутеры корректно определены в соответствующих файлах.
app.use('/auth', authRoutes); // Пример: /auth/login, /auth/register
app.use('/rating', ratingRouter); // Пример: /rating/get, /rating/add

// Пример простого GET-запроса для проверки
app.get('/api/hello', (req, res) => {
  res.send('Hello from the server!');
});

// --- Запуск сервера ---
// Используем асинхронную функцию для подключения к БД перед запуском сервера.
(async () => {
  await connectDB(); // Ждем подключения к БД

  // Запускаем сервер после успешного подключения к БД
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
