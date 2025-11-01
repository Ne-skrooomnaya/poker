// client/src/components/RatingPage.js

import React from 'react';
import AdminRatingPage from './rating/AdminRatingPage'; // Компонент админского рейтинга
import UserRatingPage from './rating/UserRatingPage';   // Компонент обычного рейтинга
import useTelegram from '../hooks/useTelegram';         // Путь к твоему хуку

const RatingPage = ({ user }) => { // Принимаем user как пропс
    // Важно: Убедитесь, что user объект, возвращаемый useTelegram(),
    // действительно содержит поле `role` и оно правильно установлено.
    // Например: { _id: '...', telegramId: '...', firstName: '...', role: 'admin' }

    // Проверяем, есть ли пользователь и его роль 'admin'
    // Используем ?. для безопасного доступа, на случай если user еще null
    const isAdmin = user?.role === 'admin';

    // Если пользователь является админом, отображаем AdminRatingPage
    if (isAdmin) {
        return <AdminRatingPage user={user} />; // Передаем user, если он нужен в AdminRatingPage
    }
    // В противном случае, отображаем UserRatingPage
    else {
        return <UserRatingPage user={user} />; // Передаем user, если он нужен в UserRatingPage
    }
};

export default RatingPage;

