// // hooks/useTelegramAdmin.js
// import { useEffect, useState } from 'react';

// // Имя пользователя для локальной разработки (администратор).
// const localUsername = 'admin';  // Имя админа

// const telegram = window.Telegram ? window.Telegram.WebApp : null;

// export function useTelegramAdmin() {
//     const [user, setUser] = useState(null);
//     const [tg, setTg] = useState(null);

//     useEffect(() => {
//         if (!telegram) {
//             // Create fake telegram object for local development (Администратор)
//             const fakeTelegram = {
//                 WebApp: {
//                     initDataUnsafe: {
//                         user: {
//                             id: 'faiz_hair',  //  ID администратора
//                             username: localUsername,  //  Имя пользователя (admin)
//                             first_name: 'Admin',
//                             last_name: 'User',
//                             isAdmin: true,  //  Администратор
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
