    // server/middleware/authMiddleware.js (или создайте новый файл, например, adminAuthMiddleware.js)

    const jwt = require('jsonwebtoken'); // Предполагаем, что вы используете JWT для аутентификации
    const User = require('../models/user.model'); // Импортируйте вашу модель пользователя

    // Middleware для общей аутентификации (проверяет, что пользователь зарегистрирован)
    const authenticateUser = async (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1]; // Предполагаем, что токен передается в заголовке Authorization

      if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Замените 'process.env.JWT_SECRET' на ваш секретный ключ
        req.user = await User.findById(decoded.id).select('-password'); // Получаем пользователя из БД
        if (!req.user) {
          return res.status(404).json({ message: 'User not found' });
        }
        next();
      } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
      }
    };

    // Middleware для проверки роли администратора
    const authorizeAdmin = async (req, res, next) => {
      // Предполагаем, что req.user уже установлен предыдущим middleware (authenticateUser)
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      next();
    };

    module.exports = {
      authenticateUser,
      authorizeAdmin,
    };
