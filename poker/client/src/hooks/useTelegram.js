// client/src/hooks/useTelegram.js
import { useEffect, useState, useCallback } from "react";
import axios from 'axios';

// Получаем Telegram Web App API.
// Важно: Эта переменная 'tg' будет undefined, если Telegram Web App API еще не загружен.
let tg = window.Telegram ? window.Telegram.WebApp : undefined;

// URL вашего бэкенда на Render
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Замените или настройте через .env

function useTelegram() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null); // Для хранения данных из Telegram

  // Хук для инициализации Telegram Web App
  useEffect(() => {
    // Проверяем, доступен ли Telegram Web App API
    if (!tg) {
      console.error("Telegram Web App API is not available. Ensure it's loaded correctly.");
      // Здесь можно показать пользователю сообщение об ошибке или перенаправить
      return; // Прерываем выполнение, если API недоступен
    }

    tg.ready(); // Сообщаем Telegram, что приложение готово
    tg.expand(); // Расширяем мини-приложение на весь экран (опционально)

    // Получаем данные пользователя из Telegram, если они доступны
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setTelegramUser(tg.initDataUnsafe.user);
    } else {
      console.error("Telegram user data not available.");
      // Возможно, стоит показать пользователю сообщение об ошибке или перенаправить
    }
  }, []); // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании.

  // Функция для авторизации пользователя на бэкенде
  const loginUser = useCallback(async (telegramUserData) => {
    if (!telegramUserData) {
      console.error("Telegram user data is missing for login.");
      return;
    }

    // Проверяем, доступен ли Telegram Web App API перед отправкой запроса
    if (!tg) {
      console.error("Telegram Web App API is not available for login.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        telegramId: telegramUserData.id,
        username: telegramUserData.username,
        firstName: telegramUserData.first_name,
        lastName: telegramUserData.last_name,
        photoUrl: telegramUserData.photo_url,
      });

      setUser(response.data.user);
      setLoading(false);
      console.log("User logged in successfully:", response.data.user);
    } catch (error) {
      console.error("Error during user login:", error.response?.data || error.message);
      setLoading(false);
    }
  }, []); // Зависимости для useCallback

  // Основной эффект для инициализации и авторизации
  useEffect(() => {
    // Если tg доступен и данные пользователя есть, пытаемся авторизоваться
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      loginUser(tg.initDataUnsafe.user);
    } else if (tg && !tg.initDataUnsafe) {
      // Если API загрузился, но initDataUnsafe еще нет, ждем
      const intervalId = setInterval(() => {
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          setTelegramUser(tg.initDataUnsafe.user);
          loginUser(tg.initDataUnsafe.user);
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    } else if (!tg) {
      // Если tg так и не стал доступен, мы уже вывели ошибку в первом useEffect
      setLoading(false); // Завершаем загрузку, так как дальнейшая работа невозможна
    }
  }, [loginUser]); // Зависимость loginUser

  const onClose = useCallback(() => {
    if (tg) {
      tg.close();
    }
  }, []);

  const onToggleButton = useCallback(() => {
    if (tg) {
      const showText = tg.isExpanded;
      tg.MainButton.setParams({
        text: showText ? "Скрыть кнопку" : "Показать кнопку",
      });
      tg.isExpanded = !tg.isExpanded;
    }
  }, []);

  const sendDataToBackend = useCallback(async (data) => {
    if (!user) {
      console.error("User not logged in, cannot send data.");
      return;
    }
    if (!tg) {
      console.error("Telegram Web App API is not available for sending data.");
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/data/save`, {
        userId: user._id,
        data: data,
      });
      console.log("Data saved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving data to backend:", error.response?.data || error.message);
      throw error;
    }
  }, [user]);

  return {
    user,
    loading,
    telegramUser,
    onClose,
    onToggleButton,
    tg: tg || window.Telegram?.WebApp, // Возвращаем tg, но с fallback на случай, если он был undefined
    loginUser,
    sendDataToBackend,
  };
}

export default useTelegram;
