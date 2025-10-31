// import React, { useState, useEffect } from 'react';

// // Вспомогательная функция для форматирования даты в YYYY-MM-DD
// const formatDate = (date) => {
//   if (!date) return '';
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const RatingForm = ({ onSubmit, onCancel, initialValues, registeredUsers }) => {
//   const [telegramId, setTelegramId] = useState('');
//   const [points, setPoints] = useState('');
//   const [selectedUsername, setSelectedUsername] = useState('');

//   useEffect(() => {
//     if (initialValues) {
//       // При редактировании
//       setTelegramId(initialValues.telegramId || '');
//       setPoints(initialValues.points || '');

//       // Находим username по telegramId из registeredUsers
//       const initialUser = registeredUsers.find(user => user.telegramId === initialValues.telegramId);
//       setSelectedUsername(initialUser ? initialUser.telegramUsername : '');
//     } else {
//       // При добавлении нового игрока, очищаем поля
//       setTelegramId('');
//       setPoints('');
//       setSelectedUsername('');
//     }
//   }, [initialValues, registeredUsers]); // Зависимости эффекта

//   const handleTelegramIdChange = (e) => {
//     const selectedId = e.target.value;
//     setTelegramId(selectedId);

//     // Находим username по выбранному telegramId
//     const selectedUser = registeredUsers.find(user => user.telegramId === selectedId);
//     setSelectedUsername(selectedUser ? selectedUser.telegramUsername : '');
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Проверка на заполненность обязательных полей
//     if (!telegramId || !points) {
//       alert('Пожалуйста, выберите Telegram ID и укажите очки.');
//       return;
//     }

//     // Передаем объект с данными, включая telegramId
//     onSubmit({ telegramId, points: Number(points) });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="rating-form">
//       <div>
//         <label htmlFor="telegram-id">Telegram ID:</label>
//         <select
//           id="telegram-id"
//           value={telegramId}
//           onChange={handleTelegramIdChange}
//           required={!initialValues} // Обязательно только при добавлении
//           disabled={!!initialValues} // Запретить изменение ID при редактировании
//         >
//           <option value="">Выберите Telegram ID</option>
//           {registeredUsers.map((user) => (
//             <option key={user.telegramId} value={user.telegramId}>
//               {user.telegramId}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label htmlFor="username">Игрок:</label>
//         <input
//           type="text"
//           id="username"
//           value={selectedUsername || ''}
//           readOnly
//         />
//       </div>

//       <div>
//         <label htmlFor="points">Очки:</label>
//         <input
//           type="number"
//           id="points"
//           value={points}
//           onChange={(e) => setPoints(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-actions">
//         <button type="submit">Сохранить</button>
//         <button type="button" onClick={onCancel}>Отменить</button>
//       </div>
//     </form>
//   );
// };

// export default RatingForm;
