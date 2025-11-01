// client/src/pages/HomePage.js
import React, { useEffect } from 'react';
import useTelegram from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom'; // Для перенаправления

function HomePage() {
  const { user, loading, telegramUser, loginUser } = useTelegram();
  const navigate = useNavigate();

  // Если пользователь уже авторизован (получены данные от бэкенда),
  // перенаправляем его на другую страницу (например, рейтинг или главную страницу приложения)
  useEffect(() => {
    if (!loading && user) {
      // Перенаправляем пользователя после успешного входа
      // Например, на главную страницу приложения или страницу рейтинга
      navigate('/rating'); // Или '/dashboard', '/app' и т.д.
    } else if (!loading && telegramUser && !user) {
      // Если данные Telegram есть, но бэкенд не вернул пользователя (ошибка логина)
      // Можно показать сообщение об ошибке пользователю
      console.log("Login failed, please try again.");
      // Или можно просто оставить на этой странице, чтобы пользователь мог повторить вход
    }
  }, [loading, user, telegramUser, navigate, loginUser]);

  const handleLogin = async () => {
    if (telegramUser) {
      // Вызываем функцию логина из useTelegram
      await loginUser(telegramUser);
      // Перенаправление произойдет в useEffect, когда user обновится
    } else {
      alert("Telegram user data not available. Please restart the app.");
    }
  };

  // На главной странице входа отображаем только одну кнопку "Войти"
  // Если пользователь еще не авторизован (loading === false и user === null)
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Добро пожаловать!</h1>
      {!user && !loading && ( // Показываем кнопку, только если не загрузка и нет пользователя
        <button onClick={handleLogin} style={{ padding: '15px 30px', fontSize: '18px' }}>
          Войти
        </button>
      )}
      {/* Можно добавить индикатор загрузки, если логин еще идет */}
      {loading && <p>Загрузка...</p>}
    </div>
  );
}

export default HomePage;