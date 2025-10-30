import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import RatingPage from './components/rating/RatingPage';
import AdminRatingPage from './components/rating/AdminRatingPage';
import UserRatingPage from './components/rating/UserRatingPage';
import { getAuthToken } from './utils/auth';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [isLocalDev, setIsLocalDev] = useState(true); // Flag для локальной разработки

  useEffect(() => {
    if (!isLocalDev) {
      const storedToken = getAuthToken();
      if (storedToken) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setIsLoggedIn(true);
        setIsAdmin(storedUser?.isAdmin || false);
        setUsername(storedUser?.username || '');
      }
    }
  }, [isLocalDev]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
    setUsername(userData.username);
    localStorage.setItem('user', JSON.stringify({ username: userData.username, isAdmin: userData.isAdmin }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    localStorage.removeItem('user');
  };

  // Функции для переключения между админом и обычным пользователем в локалке
  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(true);
    setUsername('admin');
  };

  const handleUserLogin = () => {
    setIsLoggedIn(true);
    setIsAdmin(false);
    setUsername('testuser');
  };

  return (
    <Router>
      <div className="App">
        {/* Кнопки для переключения в локальной разработке */}
        {isLocalDev && !isLoggedIn && (
          <div>
            <button className="but" onClick={handleAdminLogin}>Войти как админ</button>
            <button className="but" onClick={handleUserLogin}>Войти как пользователь</button>
          </div>
        )}

        {isLoggedIn && (
          <div className='your' >
            Ваше имя: {isAdmin ? 'Вы админ' : username}
          </div>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <AuthForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <AdminPage onLogout={handleLogout} />
                ) : (
                  <HomePage onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/rating"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <AdminRatingPage onLogout={handleLogout} />
                ) : (
                  <UserRatingPage onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
