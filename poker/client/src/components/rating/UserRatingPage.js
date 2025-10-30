import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Установи: npm install axios
import './AdminRatingPage.css';
import './UserRatingPage.css';

import '../HomePage.css';
const UserRatingPage = () => {
  const [ratingData, setRatingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Добавим состояние для загрузки
    const navigate = useNavigate();

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rating'); // Замени на URL своего API, если необходимо
        setRatingData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rating data:', error);
        setLoading(false);
      }
    };

    fetchRatingData();
  }, []);

  const sortedRating = [...ratingData].sort((a, b) => b.points - a.points);

  const filteredRating = sortedRating.filter((player) =>
    player.telegramUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Загрузка...</div>; // Отображаем индикатор загрузки
  }

  const handleGoBack = () => {
            navigate(-1); // Переходим на одну страницу назад в истории браузера
        };

  return (
    <div className="bottom-section">
      <h1>Рейтинг</h1>
    <button className="bottom-section-button" onClick={handleGoBack}>Назад</button>
      <div>
        <label>Поиск игрока:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table>
        <thead>
<tr>
  <th>№</th>
  <th>Игрок</th>
  <th>Очки</th>
</tr>

        </thead>
        <tbody>
          {filteredRating.map((player, index) => (
            <tr key={player.telegramId}>
              <td>{index + 1}</td>
              <td>{player.telegramUsername}</td>
              <td>{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRatingPage;
