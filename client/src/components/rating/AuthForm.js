// import React, { useState, useEffect } from 'react';
// import './AuthForm.css';
// import { useTelegram } from '../../hooks/useTelegram'; // Import useTelegram



// const AuthForm = ({ onLogin }) => {
//     const { user } = useTelegram(); // Get user data from Telegram
//     const [isReadyToLogin, setIsReadyToLogin] = useState(false);

//     useEffect(() => {
//         // Если user есть, то можно отображать кнопку "Войти"
//         if (user) {
//             setIsReadyToLogin(true);
//         } else {
//             setIsReadyToLogin(false);
//         }
//     }, [user]);

//     const handleLoginClick = () => {
//         if (user) {
//             onLogin(user.username, user.id, user.first_name, user.last_name); // Call onLogin with Telegram data
//         }
//     };

//     return (
//         <div className="auth-form">
//             <h2 className='h2'>Авторизация</h2>
//             {user ? (
//                 <div>
//                     <p>Вы вошли как {user.username}</p>
//                     {isReadyToLogin && (
//                         <button onClick={handleLoginClick} className="submit-button">
//                             Войти
//                         </button>
//                     )}
//                 </div>
//             ) : (
//                 <p>Пожалуйста, авторизуйтесь в Telegram</p>
//             )}
//         </div>
//     );
// };

// export default AuthForm;

