    // server/controllers/admin.controller.js (пример)

    const adminController = {
      getDashboard: (req, res) => {
        // req.user содержит информацию о текущем аутентифицированном админе
        res.json({
          message: `Welcome to the admin dashboard, ${req.user.firstName}!`,
          user: req.user,
          // Здесь может быть логика для отображения статистики, пользователей и т.д.
        });
      },

      // Пример другой функции админки
      // createItem: async (req, res) => {
      //   try {
      //     // Логика создания нового элемента (игры, турнира и т.д.)
      //     res.status(201).json({ message: 'Item created successfully' });
      //   } catch (error) {
      //     console.error('Error creating item:', error);
      //     res.status(500).json({ message: 'Server error while creating item' });
      //   }
      // },
    };

    module.exports = adminController;
