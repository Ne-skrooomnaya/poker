// client/src/pages/ UserRatingPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Для запросов к бэкенду

// URL вашего бэкенда
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function  UserRatingPage({ user }) { // Предполагается, что user передается из App.js
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        setError(null);
        // Предполагается, что у вас есть эндпоинт для получения рейтинга
        const response = await axios.get(`${BACKEND_URL}/rating`);
        setRatingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rating:", err);
        setError("Не удалось загрузить рейтинг.");
        setLoading(false);
      }
    };

    fetchRating();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Рейтинг Пользователей</h1>
      {loading && <p>Загрузка рейтинга...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {ratingData.length > 0 ? (
            ratingData.map((item, index) => (
              <li key={item._id || index} style={{ marginBottom: '10px' }}>
                {index + 1}. {item.user?.username || item.user?.firstName || 'Неизвестный'} - Score: {item.score}
              </li>
            ))
          ) : (
            <li>Рейтинг пока пуст.</li>
          )}
        </ul>
      )}
      {/* Если пользователь админ, можно добавить кнопку для перехода на админку */}
      {user && user.role === 'admin' && (
        <button onClick={() => window.location.href = '/admin'}>
          Перейти в Админку
        </button>
      )}
    </div>
  );
}

export default UserRatingPage;
