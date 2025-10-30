import { useState, useEffect } from 'react';
import axios from 'axios';

export function useTelegram() {
  const [tg, setTg] = useState(window.Telegram?.WebApp);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (tg && tg.initDataUnsafe?.user?.id) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/users/${tg.initDataUnsafe.user.id}`); // Замените URL
          setUser(response.data); // Предполагается, что сервер возвращает объект пользователя с isAdmin
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [tg]);

  return {
    tg,
    user,
  };
}
