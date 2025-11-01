// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useTelegram from './hooks/useTelegram'; // Убедитесь, что путь правильный

import HomePage from './components/HomePage'; // Ваша главная страница (где происходит вход/регистрация)
import RatingPage from './components/RatingPage'; // Ваша страница рейтинга
import AdminRatingPage from './components/rating/AdminRatingPage'; // Страница админки
import LoadingPage from './components/LoadingPage'; // Компонент для отображения загрузки

// Пример компонента-обертки для защищенных роутов
// Он будет перенаправлять пользователя, если он не авторизован
const ProtectedRoute = ({ element: Element, user, allowedRoles, fallbackPath = "/", ...rest }) => {
      if (!user) {
        return <Navigate to={fallbackPath} replace />;
      }
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          return <Navigate to={fallbackPath} replace />; // Перенаправляем, если роль не подходит
        }
      }
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
  // const getInitialRedirectPath = () => {
  //   if (user) {
  //     return user.role === 'admin' ? '/admin' : '/rating';
  //   }
  //   return '/'; // Если пользователь еще не авторизован, остаемся на главной
  // };

  if (loading) {
    return <LoadingPage />;
  }

  return (
        <Router>
          <Routes>
            {/* Главная страница - доступна для входа */}
            <Route path="/" element={<HomePage />} />

            {/* Если пользователь авторизован, показываем его путь */}
            {user && (
              <>
                {/* Перенаправление после успешного логина */}
                <Route path="/welcome" element={<Navigate to={user.role === 'admin' ? '/admin/rating' : '/rating'} replace />} />
                {/* Или можно просто сделать перенаправление с "/" на нужную страницу */}
              </>
            )}

            {/* Страница рейтинга - доступна всем авторизованным пользователям */}
            <Route
              path="/rating"
              element={<ProtectedRoute element={RatingPage} user={user} fallbackPath="/" />}
            />

            {/* Страница админского рейтинга - доступна только админам */}
            <Route
              path="/admin/rating"
              element={<ProtectedRoute element={AdminRatingPage} user={user} allowedRoles={['admin']} fallbackPath="/" />}
            />

            {/* Если пользователь авторизован, но пытается зайти на несуществующую страницу, перенаправляем */}
            {user && (
                <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin/rating' : '/rating'} replace />} />
            )}

             {/* Если пользователь не авторизован и пытается зайти на защищенную страницу */}
             {/* Этот маршрут нужен, если Navigate в ProtectedRoute ведет на "/", а нам надо, чтобы главная была "/" */}
            {!user && (
                 <Route path="*" element={<Navigate to="/" replace />} />
            )}
          </Routes>
        </Router>
      );
    }

    export default App;
