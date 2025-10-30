import React, { useState, useEffect } from 'react';
import { telegramLogin } from '../utils/auth';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { setAuthToken } from '../utils/auth';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { tg, user } = useTelegram();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        if (user) {
            handleTelegramLogin(user);
        }
    }, [user]);

    const handleTelegramLogin = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = {
                telegramUsername: userData.username,
                telegramId: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name
            };
            const response = await telegramLogin(data);
            setAuthToken(response.token); // Store the token
            // Redirect to a protected route or update the app state
            console.log('Telegram login successful!');

            // Decode token and redirect to appropriate page
            const decodedToken = JSON.parse(atob(response.token.split('.')[1])); // Use JSON.parse and atob
            if (decodedToken.isAdmin) {
                navigate('/admin'); // Redirect to AdminPage
            } else {
                navigate('/'); // Redirect to HomePage
            }

        } catch (err) {
            setError(err.message || 'Telegram login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default Auth;

