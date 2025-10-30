// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'telegram_cafe', // Specify the database name
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

 // Подключение роутов
    const ratingRouter = require('./routes/rating.routes');
    const userRouter = require('./routes/auth.routes'); // Добавляем роутер для пользователей
    app.use('/rating', ratingRouter);
    app.use('/users', userRouter); // Добавляем middleware для роутов пользователей

// Call the connectDB function
(async () => {
  await connectDB();
})();

app.use('/auth', authRoutes);

app.get('/api/hello', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
