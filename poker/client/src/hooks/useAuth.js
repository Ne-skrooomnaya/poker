// // client/src/hooks/useAuth.js
// import { useState, createContext, useContext, useEffect } from 'react';

// const AuthContext = createContext(null);




// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (process.env.NODE_ENV === 'development') {
//   window.Telegram = {
//     WebApp: {
//       initDataUnsafe: {
//         user: {
//           id: '123456789', // Замените на тестовый ID
//           username: 'testuser', // Замените на тестовый username
//         },
//       },
//       // Добавьте другие необходимые свойства и методы WebApp API
//     },
//   };
// }
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async (telegramId, telegramUsername) => {
//     const response = await fetch('http://localhost:5000/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ telegramId, telegramUsername }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setUser(data);
//       localStorage.setItem('user', JSON.stringify(data));
//       return data; // Возвращаем данные пользователя
//     } else {
//       throw new Error(data.message || 'Ошибка при входе');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const fetchUserProfile = async () => {
//     if (user && user.telegramUsername) {  // Используем telegramUsername
//       try {
//         const response = await fetch(`/api/auth/profile/${user.telegramUsername}`);  // Endpoint для получения профиля по telegramUsername
//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//           localStorage.setItem('user', JSON.stringify(userData));
//         } else {
//           console.error('Ошибка при загрузке профиля пользователя');
//         }
//       } catch (error) {
//         console.error('Ошибка при загрузке профиля пользователя:', error);
//       }
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, fetchUserProfile }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
