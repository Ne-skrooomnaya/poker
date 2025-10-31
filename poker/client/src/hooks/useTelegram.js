import { useEffect, useState, useCallback } from "react";

// Импортируем axios для отправки запросов на бэкенд
import axios from 'axios';

// Получаем Telegram Web App API
const tg = window.Telegram.WebApp;

// URL вашего бэкенда на Render
// Важно: Убедитесь, что этот URL правильно настроен в переменных окружения на Render
// и доступен для вашего клиентского приложения.
// Например: process.env.REACT_APP_BACKEND_URL
// Пока что используем заглушку, но в продакшене нужно будет установить реальный URL.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Замените или настройте через .env

function useTelegram() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null); // Для хранения данных из Telegram

  const initTelegram = useCallback(() => {
    try {
      tg.ready(); // Сообщаем Telegram, что приложение готово
      tg.expand(); // Расширяем мини-приложение на весь экран (опционально)

      // Получаем данные пользователя из Telegram
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setTelegramUser(tg.initDataUnsafe.user);
      } else {
        console.error("Telegram user data not available.");
        // Возможно, стоит показать пользователю сообщение об ошибке или перенаправить
      }
    } catch (error) {
      console.error("Error initializing Telegram Web App:", error);
      // Обработка ошибок инициализации Telegram API
    }
  }, []);

  // Функция для авторизации пользователя на бэкенде
  const loginUser = useCallback(async (telegramUserData) => {
    if (!telegramUserData) {
      console.error("Telegram user data is missing for login.");
      return;
    }

    try {
      // Отправляем данные пользователя на бэкенд для авторизации/регистрации
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        telegramId: telegramUserData.id,
        username: telegramUserData.username,
        firstName: telegramUserData.first_name,
        lastName: telegramUserData.last_name,
        photoUrl: telegramUserData.photo_url,
      });

      // Предполагаем, что бэкенд возвращает данные пользователя после входа
      setUser(response.data.user); // Сохраняем данные пользователя, полученные от бэкенда
      setLoading(false);
      console.log("User logged in successfully:", response.data.user);

    } catch (error) {
      console.error("Error during user login:", error.response?.data || error.message);
      // Обработка ошибок авторизации (например, показать сообщение пользователю)
      setLoading(false);
      // Можно перенаправить на страницу ошибки или снова на главную
    }
  }, []);

  useEffect(() => {
    initTelegram();

    // Если данные Telegram пользователя доступны сразу, пытаемся авторизоваться
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      loginUser(tg.initDataUnsafe.user);
    } else {
      // Если данных нет, установим таймер для ожидания.
      // Это может быть полезно, если Telegram API загружается не мгновенно.
      const intervalId = setInterval(() => {
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          setTelegramUser(tg.initDataUnsafe.user);
          loginUser(tg.initDataUnsafe.user);
          clearInterval(intervalId);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [initTelegram, loginUser]); // Зависимости для useCallback

  const onClose = useCallback(() => {
    tg.close();
  }, []);

  // Эта функция может быть удалена, если MainButton не используется
  // или перенесена туда, где она нужна
  const onToggleButton = useCallback(() => {
    const showText = tg.isExpanded;
    tg.MainButton.setParams({
      text: showText ? "Скрыть кнопку" : "Показать кнопку",
    });
    tg.isExpanded = !tg.isExpanded;
  }, []);

  // Функция для отправки данных на бэкенд (пример)
  const sendDataToBackend = useCallback(async (data) => {
    if (!user) {
      console.error("User not logged in, cannot send data.");
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/data/save`, {
        userId: user._id, // Предполагается, что у пользователя есть _id из бэкенда
        data: data,
      });
      console.log("Data saved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving data to backend:", error.response?.data || error.message);
      throw error; // Пробрасываем ошибку дальше
    }
  }, [user]);

  return {
    user, // Данные пользователя, полученные от бэкенда (после логина)
    loading,
    telegramUser, // Сырые данные из Telegram (для отладки или если нужны)
    onClose,
    onToggleButton,
    tg,
    loginUser, // Экспортируем функцию логина, если нужна снаружи
    sendDataToBackend, // Пример функции отправки данных
  };
}

export default useTelegram;
