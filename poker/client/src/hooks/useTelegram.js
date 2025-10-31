// client/src/hooks/useTelegram.js
 import { useEffect, useState, useCallback } from "react";
    import axios from 'axios';

    let tg = window.Telegram ? window.Telegram.WebApp : undefined;

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
function useTelegram() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null); // Для хранения данных из Telegram

  // Хук для инициализации Telegram Web App
      useEffect(() => {
        if (!tg) {
          console.error("Telegram Web App API object (tg) is not initialized.");
          setLoading(false);
          return;
        }
        tg.ready();
        tg.expand();

        // --- ДОБАВЬТЕ ЭТИ ЛОГИ ---
        console.log("tg.initData:", tg.initData); // Сырые данные
        console.log("tg.initDataUnsafe:", tg.initDataUnsafe); // Распарсенный объект
        console.log("tg.initDataUnsafe.user:", tg.initDataUnsafe.user); // Данные пользователя
        // --- КОНЕЦ ЛОГОВ ---

        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
          setTelegramUser(tg.initDataUnsafe.user);
        } else {
          console.error("Telegram user data not available. (From initial check)"); // Изменил сообщение, чтобы понимать, откуда оно
        }
      }, []); // Зависимости не нужны, выполняется один раз
 // Пустой массив зависимостей означает, что этот эффект выполнится только один раз при монтировании.

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
        if (!tg) {
          console.error("Telegram Web App API is not available when attempting login (second useEffect).");
          setLoading(false);
          return;
        }

        if (telegramUser) { // Если telegramUser уже установлен первым useEffect или interval
            loginUser(telegramUser);
        } else if (tg.initDataUnsafe && tg.initDataUnsafe.user) { // Если данные появились сейчас
            setTelegramUser(tg.initDataUnsafe.user);
            loginUser(tg.initDataUnsafe.user);
        } else {
            // Если данные не доступны сразу, ждем
            const checkDataInterval = setInterval(() => {
                if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    setTelegramUser(tg.initDataUnsafe.user);
                    loginUser(tg.initDataUnsafe.user);
                    clearInterval(checkDataInterval);
                }
            }, 200);

            return () => clearInterval(checkDataInterval);
        }
      }, [loginUser, telegramUser]); // Добавил telegramUser в зависимости

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
