// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useTelegram from './hooks/useTelegram'; // Убедитесь, что путь правильный

import HomePage from './components/HomePage'; // Ваша главная страница (где происходит вход/регистрация)
import RatingPage from './components/RatingPage'; // Ваша страница рейтинга
import AdminPage from './components/AdminPage'; // Ваша страница админки
import LoadingPage from './components/LoadingPage'; // Компонент для отображения загрузки

// Пример компонента-обертки для защищенных роутов
// Он будет перенаправлять пользователя, если он не авторизован
const ProtectedRoute = ({ element: Element, user, allowedRoles, ...rest }) => {
  // Проверяем, что пользователь загружен
  if (!user) {
    // Если пользователь не загружен (loading), показываем LoadingPage
    // Если пользователь отсутствует (логин не пройден), перенаправляем на главную
    return <Navigate to="/" replace />;
  }

  // Проверяем, есть ли у пользователя нужная роль (если allowedRoles указаны)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Пользователь не имеет нужной роли, перенаправляем на главную или другую страницу
      // Здесь можно добавить более сложную логику, например, перенаправить на страницу с ошибкой "Access Denied"
      return <Navigate to="/" replace />;
    }
  }

  // Пользователь авторизован и имеет нужную роль (или роль не важна для этого роута)
  return <Element user={user} {...rest} />;
};

function App() {
  // useTelegram должен возвращать:
  // user: данные пользователя с бэкенда (включая роль), если авторизован
  // loading: булево значение, показывающее, идет ли сейчас процесс аутентификации
  // telegramUser: данные пользователя от Telegram API (могут быть полезны для инициализации)
  const { user, loading, telegramUser } = useTelegram();

  // Логика перенаправления после успешного логина
  // Можно сделать так, чтобы после входа пользователя перенаправляло на RatingPage,
  // а админа - на AdminPage
  const getInitialRedirectPath = () => {
    if (user) {
      return user.role === 'admin' ? '/admin' : '/rating';
    }
    return '/'; // Если пользователь еще не авторизован, остаемся на главной
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        {/* Главная страница - всегда доступна для входа */}
        <Route
          path="/"
          element={<HomePage telegramUser={telegramUser} />} // Передаем telegramUser, если он нужен для кнопки входа
        />

        {/* Если пользователь авторизован, показываем остальные страницы */}
        {/* Используем ProtectedRoute для защиты роутов */}

        {/* Страница рейтинга - доступна всем авторизованным пользователям */}
        <Route
          path="/rating"
          element={<ProtectedRoute element={RatingPage} user={user} />}
        />

        {/* Страница админки - доступна только админам */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={AdminPage} user={user} allowedRoles={['admin']} />}
        />

        {/* Пример: если пользователь авторизован, но пытается зайти на главную, перенаправляем */}
        {/* Это может быть полезно, чтобы не показывать кнопку "Войти" авторизованному пользователю */}
        {user && (
          <Route path="/" element={<Navigate to={getInitialRedirectPath()} replace />} />
        )}

        {/* Маршрут для случаев, когда пользователь авторизован, но пытается зайти на несуществующую страницу */}
        {/* Можно перенаправить его на страницу, соответствующую роли */}
        <Route path="*" element={user ? <Navigate to={getInitialRedirectPath()} replace /> : <Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
