    import React from 'react';
    import AdminRatingPage from './rating/AdminRatingPage';
    import UserRatingPage from './rating/UserRatingPage';
    import useTelegram from '../hooks/useTelegram'; // Путь к твоему хуку

    const RatingPage = () => {
        const { user } = useTelegram(); // Получаем информацию о пользователе из хука
        const isAdmin = user?.isAdmin; // Проверяем, является ли пользователь администратором

        if (isAdmin) {
            return <AdminRatingPage />;
        } else {
            return <UserRatingPage />;
        }
    };

    export default RatingPage;