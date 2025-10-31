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
    const PORT = process.env.PORT || 3001; // Используем порт Render, если есть, иначе 3001 для локальной разработки

    app.use(cors());
    app.use(bodyParser.json());

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

    // --- ОБНОВЛЕНИЕ ЗДЕСЬ: Используем 'build' вместо 'public' ---
    // Create React App по умолчанию собирает фронтенд в папку 'build'.
     app.use(express.static(path.join(__dirname, '../client/build'))); // Используйте build!
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html')); // Используйте build!
    });

    app.use('/auth', authRoutes);
    app.use('/rating', ratingRouter);
    //app.use('/users', userRouter); // Если у вас есть отдельный роутер для пользователей

    app.get('/api/hello', (req, res) => {
      res.send('Hello from the server!');
    });

    (async () => {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })();
