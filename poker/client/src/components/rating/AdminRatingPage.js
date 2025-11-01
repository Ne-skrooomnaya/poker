// client/src/pages/AdminRatingPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminRatingPage({ user }) { // Предполагается, что user передается из App.js
  const [users, setUsers] = useState([]); // Список всех пользователей
  const [selectedUserId, setSelectedUserId] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Предполагается, что у вас есть эндпоинт для получения списка всех пользователей
        const response = await axios.get(`${BACKEND_URL}/users`); // Например, GET /users
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Не удалось загрузить список пользователей.");
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateRating = async () => {
    if (!selectedUserId || score === null || score === undefined) {
      setMessage("Пожалуйста, выберите пользователя и введите балл.");
      return;
    }

    try {
      // Предполагается, что у вас есть эндпоинт для обновления рейтинга
      // Например, POST /admin/update-rating
      const response = await axios.post(`${BACKEND_URL}/admin/update-rating`, {
        userId: selectedUserId, // ID пользователя для обновления
        score: score,
      });
      setMessage(response.data.message);
      // Можно обновить список пользователей или рейтинг после успешного обновления
      // Например, повторно вызвать fetchUsers()
    } catch (error) {
      console.error("Error updating rating:", error);
      setMessage(`Ошибка при обновлении рейтинга: ${error.response?.data?.message || error.message}`);
    }
  };

  // Проверка роли пользователя, если это необходимо
  if (user.role !== 'admin') {
    return <div>У вас нет доступа к этой странице.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель Администратора</h1>
      {message && <p>{message}</p>}

      <div>
        <h2>Управление Рейтингом</h2>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="">-- Выберите пользователя --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.username || u.firstName} ({u._id})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Балл рейтинга"
          style={{ marginRight: '10px', padding: '8px' }}
        />

        <button onClick={handleUpdateRating} style={{ padding: '8px 15px' }}>
          Обновить Рейтинг
        </button>
      </div>

      {/* Дополнительные функции админки, если нужны */}
    </div>
  );
}

export default AdminRatingPage;