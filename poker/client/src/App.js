// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useTelegram from './hooks/useTelegram'; // Убедитесь, что путь правильный

import HomePage from './components/HomePage'; // Ваша главная страница
import RatingPage from './components/RatingPage'; // Ваша страница рейтинга
import AdminPage from './components/AdminPage'; // Ваша страница админки
import LoadingPage from './components/LoadingPage'; // Компонент для отображения загрузки

function App() {
  const { user, loading, telegramUser } = useTelegram();

  if (loading) {
    return <LoadingPage />;
  }

  // Если пользователь не авторизован (нет данных от бэкенда), показываем главную страницу
  // Если пользователь авторизован, перенаправляем на другую страницу
  // или показываем контент в зависимости от его роли

  return (
    <Router>
      <Routes>
        {/* Главная страница - вход */}
        <Route path="/" element={<HomePage />} />

        {/* Если пользователь авторизован, показываем остальные страницы */}
        {/* Можно добавить проверку роли пользователя для доступа к админке */}
        {user ? (
          <>
            <Route path="/rating" element={<RatingPage user={user} />} />
            {/* Пример: только для админов */}
            {user.role === 'admin' && (
              <Route path="/admin" element={<AdminPage user={user} />} />
            )}
            {/* Можно добавить перенаправление после успешного логина */}
            {/* <Route path="/" element={<HomePage />} /> */}
          </>
        ) : (
          // Если пользователь не авторизован, но уже был перенаправлен с главной,
          // можно показать сообщение или снова отправить на главную.
          // Или если вы хотите, чтобы главная была всегда доступна для входа:
          <Route path="/" element={<HomePage />} />
        )}

        {/* Можно добавить маршрут для страницы ошибки */}
      </Routes>
    </Router>
  );
}

export default App;
