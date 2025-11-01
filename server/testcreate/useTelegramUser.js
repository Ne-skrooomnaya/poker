// // hooks/useTelegramUser.js
// import { useEffect, useState } from 'react';

// // Имя пользователя для локальной разработки (обычный пользователь).
// const localUsername = null;  // По умолчанию null, если не указано

// const telegram = window.Telegram ? window.Telegram.WebApp : null;

// export function useTelegramUser() {
//     const [user, setUser] = useState(null);
//     const [tg, setTg] = useState(null);

//     useEffect(() => {
//         if (!telegram) {
//             // Create fake telegram object for local development (Обычный пользователь)
//             const fakeTelegram = {
//                 WebApp: {
//                     initDataUnsafe: {
//                         user: {
//                             id: '123456789',  //  ID обычного пользователя
//                             username: localUsername || 'testuser',  //  Имя пользователя
//                             first_name: 'Test',
//                             last_name: 'User',
//                             isAdmin: false,  //  Обычный пользователь - не админ
//                         },
//                     },
//                 },
//             };

//             setTg(fakeTelegram.WebApp);
//             setUser(fakeTelegram.WebApp.initDataUnsafe?.user);
//             return;
//         }

//         // Fetch user from database based on telegramId
//         const fetchUser = async () => {
//             try {
//                 //TODO: Implement get user API to get user role
//                 // const response = await axios.get(/users/${telegram.initDataUnsafe.user.id});
//                 // setUser(response.data);
//                 // Предполагаем, что API возвращает объект пользователя с полем isAdmin
//                 // Пример: { ...telegram.initDataUnsafe?.user, isAdmin: true } или { ...telegram.initDataUnsafe?.user, isAdmin: false }

//                 // Вместо этого, теперь ищем пользователя по telegramId в вашей "БД"
//                 const telegramId = telegram.WebApp.initDataUnsafe?.user.id;
//                 let isAdmin = false;

//                 if (telegramId === 'faiz_hair') {
//                     isAdmin = true;
//                 } else if (telegramId === '123456789') {
//                     isAdmin = false;
//                 }

//                 setUser({...telegram.initDataUnsafe?.user, isAdmin: isAdmin});


//             } catch (error) {
//                 console.error("Error fetching user:", error);
//                 setUser({...telegram.initDataUnsafe?.user, isAdmin: false});
//             }
//         };

//         fetchUser();
//         setTg(telegram);
//     }, []);

//     return {
//         tg,
//         user,
//     };
// }
