import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react'; // Импортируем useRef
import RatingForm from './RatingForm';
import axios from 'axios';
import './AdminRatingPage.css';

const AdminRatingPage = () => {
    const [ratingData, setRatingData] = useState([]);
    // Изначально устанавливаем текущую дату в формате DD.MM.YYYY
    const [updateDate, setUpdateDate] = useState(new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    const [showForm, setShowForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Добавляем состояние для хранения сообщений об ошибках

    // Новые состояния для редактирования даты
    const [isEditingDate, setIsEditingDate] = useState(false);
    const dateInputRef = useRef(null); // Референс для input type="date"

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRatingData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Дефолтное значение на всякий случай
                const response = await axios.get(`${apiUrl}/rating`); // Обращаемся к /rating
                setRatingData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rating data:', error);
                setError('Ошибка при загрузке данных рейтинга'); // Устанавливаем сообщение об ошибке
                setLoading(false);
            }
        };

        const fetchRegisteredUsers = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${apiUrl}/users/registered`);
                setRegisteredUsers(response.data);
            } catch (error) {
                console.error('Error fetching registered users:', error);
                setError('Ошибка при загрузке списка зарегистрированных пользователей'); // Устанавливаем сообщение об ошибке
            }
        };

        fetchRatingData();
        fetchRegisteredUsers();
    }, []);

    // Функция для форматирования даты из JS Date в YYYY-MM-DD (для input type="date")
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return '';
    };

    // Функция для форматирования даты из YYYY-MM-DD в DD.MM.YYYY
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return '';
    };

    const handleAddPlayer = () => {
        setEditingPlayer(null);
        setShowForm(true);
        console.log("registeredUsers:", registeredUsers); // Выводим в консоль registeredUsers
    };

    const handleEditPlayer = (telegramId) => {
        const playerToEdit = ratingData.find((player) => player.telegramId === telegramId);
        setEditingPlayer(playerToEdit);
        setShowForm(true);
    };

    const handleDeletePlayer = async (telegramId) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого игрока?');
        if (confirmDelete) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.delete(`${apiUrl}/rating/${telegramId}`); // Исправлена строка
                setRatingData(ratingData.filter((player) => player.telegramId !== telegramId));
            } catch (error) {
                console.error('Error deleting player:', error);
                setError('Ошибка при удалении игрока'); // Устанавливаем сообщение об ошибке
            }
        }
    };

    // --- Функциональность редактирования даты ---

    const toggleDateEditMode = () => {
        setIsEditingDate(!isEditingDate);
        // Если переходим в режим редактирования, фокус на поле ввода
        if (!isEditingDate) {
            // Добавляем небольшую задержку, чтобы дать DOM обновиться перед установкой фокуса
            setTimeout(() => {
                if (dateInputRef.current) {
                    dateInputRef.current.focus();
                }
            }, 0);
        }
    };

    const handleDateInputChange = (event) => {
        // Форматируем введенную дату для отображения
        setUpdateDate(formatDateForDisplay(event.target.value));
        // Можно сразу выйти из режима редактирования после выбора
        setIsEditingDate(false);
        // Здесь вы можете добавить логику сохранения даты на бэкенд, если это нужно
        // Например: await axios.put('http://localhost:5000/rating/date', { date: event.target.value });
    };

    // Обработчик для нажатия Escape для отмены редактирования
    const handleDateInputKeyDown = (event) => {
        if (event.key === 'Escape') {
            // Возвращаем исходную дату (можно сохранить ее в отдельном состоянии)
            // Для простоты, если пользователь нажал Escape, мы просто выходим из режима редактирования
            // и дата остается прежней, пока не будет выбрана новая.
            setIsEditingDate(false);
            // Если вы хотите вернуть предыдущее значение, вам нужно будет сохранить его
            // в отдельном состоянии перед переходом в режим редактирования.
        }
        if (event.key === 'Enter') {
            // При нажатии Enter, можно считать, что дата сохранена
            setIsEditingDate(false);
            // Здесь также можно добавить логику сохранения даты на бэкенд
            // Например: await axios.put('http://localhost:5000/rating/date', { date: event.target.value });
        }
    };

    // --- Конец функциональности редактирования даты ---
      const handleGoBack = () => {
            navigate(-1); // Переходим на одну страницу назад в истории браузера
        };

    if (loading) return <div className="loading-indicator">Загрузка...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="bottom-section">
            <h2>Администрирование рейтинга</h2>
            <button className="bottom-section-button" onClick={handleGoBack}>Назад</button> {/* Кнопка "Назад" onClick={handleGoBack}*/}

            {/* Блок для отображения и редактирования даты */}
            <div className="date-editor-container">
                {!isEditingDate ? (
                    <>
                        <span>Дата рейтинга: </span>
                        <span className="current-date-display">{updateDate}</span>
                        <button onClick={toggleDateEditMode} className="edit-date-button">
                            Редактировать дату
                        </button>
                    </>
                ) : (
                    <>
                        <span>Новая дата: </span>
                        <input
                            type="date"
                            ref={dateInputRef}
                            value={formatDateForInput(updateDate)} // Преобразуем для input type="date"
                            onChange={handleDateInputChange}
                            onKeyDown={handleDateInputKeyDown}
                            onBlur={() => setIsEditingDate(false)} // Выходим из режима редактирования при потере фокуса
                            className="date-input-field"
                        />
                        {/* Можно добавить кнопку "Сохранить" если не хотите автоматическое сохранение */}
                        {/* <button onClick={() => setIsEditingDate(false)} className="save-date-button">Сохранить</button> */}
                    </>
                )}
            </div>

            <button className="bottom-section-button" onClick={handleAddPlayer} >
                Добавить Игрока
            </button>

            {showForm && (
                <RatingForm
                    editingPlayer={editingPlayer}
                    registeredUsers={registeredUsers}
                    onClose={() => setShowForm(false)}
                    onSubmit={(playerData) => {
                        if (editingPlayer) {
                            // Логика обновления игрока
                            const updatedData = ratingData.map(p =>
                                p.telegramId === playerData.telegramId ? playerData : p
                            );
                            setRatingData(updatedData);
                        } else {
                            // Логика добавления игрока
                            setRatingData([...ratingData, playerData]);
                        }
                        setShowForm(false);
                        setEditingPlayer(null);
                    }}
                />
            )}

            <table className="polya">
                <thead>
                    <tr>
                        <th>Telegram ID</th>
                        <th>Имя</th>
                        <th>Рейтинг</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {ratingData.map((player) => (
                        <tr key={player.telegramId}>
                            <td>{player.telegramId}</td>
                            <td>{player.name}</td>
                            <td>{player.rating}</td>
                            <td>
                                <button className="bottom-section-button-d" onClick={() => handleEditPlayer(player.telegramId)} >
                                    Редактировать
                                </button>
                                <button className="bottom-section-button-d" onClick={() => handleDeletePlayer(player.telegramId)} >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );



};

export default AdminRatingPage;