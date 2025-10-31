    // server/server.js

    const express = require('express');
    const path = require('path'); // Убедитесь, что этот модуль импортирован
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const mongoose = require('mongoose');
    const authRoutes = require('./routes/auth.routes');
    const ratingRouter = require('./routes/rating.routes');

    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 5000; // Используем порт из переменных окружения

    app.use(cors({
      origin: 'https://your-app-name.onrender.com', // Или '*' для всех, но в продакшене лучше ограничить
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    app.use(bodyParser.json());

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
      useUnifiedTopology: true,
          // Убраны устаревшие опции useNewUrlParser, useUnifiedTopology
        });
        console.log('Successfully connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
      }
    };

    // --- ОБНОВЛЕНИЕ ЗДЕСЬ: Используем 'build' вместо 'public' ---
    // Create React App по умолчанию собирает фронтенд в папку 'build'.
     // Убедитесь, что путь правильный. Если клиентская сборка в 'client/dist', то '../client/dist'
    const frontendBuildPath = path.join(__dirname, '../client/build'); // Измените 'build' на 'dist' если используете
    app.use(express.static(frontendBuildPath));

    // Отдаем index.html для всех остальных запросов, чтобы React Router работал
    app.get('/*', (req, res) => { // Изменили '*' на '/*'
  res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
});

    app.use('/auth', authRoutes);
    app.use('/rating', ratingRouter);
    // app.use('/users', userRouter); // Если у вас есть отдельный роутер для пользователей

    app.get('/api/hello', (req, res) => {
      res.send('Hello from the server!');
    });

    (async () => {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })();
