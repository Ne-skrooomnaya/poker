// server/server.js

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const mongoose = require('mongoose');
    const authRoutes = require('./routes/auth.routes');
    const ratingRouter = require('./routes/rating.routes');

    dotenv.config(); // Загружаем переменные из .env для локальной разработки

    const app = express();

    // **ВАЖНОЕ ИЗМЕНЕНИЕ**:
    // Теперь мы всегда полагаемся на process.env.PORT, который устанавливает Render.
    // Если process.env.PORT не установлен (локально), то fallback на 3001 (как в вашем .env)
    // или другой порт, который вы предпочитаете для локальной разработки.
    // Если вы хотите, чтобы локально использовался 3001, убедитесь, что он есть в .env
    // и эта строка выглядит так:
    const PORT = process.env.PORT || 3001; // Используем порт Render, если есть, иначе 3001 (для локальной разработки)

    app.use(cors());
    app.use(bodyParser.json());

    // --- MongoDB Connection ---
    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          // Убраны устаревшие опции useNewUrlParser, useUnifiedTopology
        });
        console.log('Successfully connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
      }
    };

    // --- Обработка статических файлов фронтенда ---
    app.use(express.static(path.join(__dirname, '../client/public')));

    // --- Маршрутизация ---
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
    });

    app.use('/auth', authRoutes);
    app.use('/rating', ratingRouter);
    // Если у вас есть роутер для пользователей, который нужно подключать, добавьте его сюда.
    // Например, если userRouter импортируется и содержит роуты пользователей:
    // app.use('/users', userRouter);

    app.get('/api/hello', (req, res) => {
      res.send('Hello from the server!');
    });

    // --- Запуск сервера ---
    (async () => {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`); // Это сообщение будет выводить тот порт, который будет использоваться
      });
    })();