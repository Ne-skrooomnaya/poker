import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from './images/logo.svg'; // Импортируйте ваш логотип
import chip from './images/chip.svg'; // Импортируйте изображение чипа

const HomePage = ({ onLogout }) => {
  return (
    <>
      {/* Логотип */}
      <div className="logo-container">
        <img src={logo} alt="Poker Logo" />
      </div>

      {/* Верхний блок */}
      <div className="top-section">
        <div className="top-section-img">
            <object data={chip} type="image/svg+xml"></object>
        </div>
        <div className="top-buttons">
          <Link to="/rating" className="top-button">
            <button className="top-button">Рейтинг</button>
          </Link>
          <Link to="/rating" className="top-button"><button className="top-button">Гонка месяца</button></Link>
          <Link to="/rating" className="top-button"><button className="top-button">Прошедшие игры</button></Link>
          
          
        </div>
      </div>

      {/* Нижний блок */}
      <div className="bottom-section">
        <Link to="/rating" className="t"><button className="bottom-section-button">Меню</button></Link>
        <Link to="/rating" className="t"><button className="bottom-section-button">Чайная карта</button></Link>
        <Link to="/rating" className="t"><button className="bottom-section-button">Паркур</button></Link>
        <Link to="/rating" className="t"><button className="bottom-section-button">Карта бара</button></Link>
        
        
        
        
      </div>

      {/* Кнопка выхода */}
      <button className="logout-button" onClick={onLogout}>
        Выйти
      </button>
    </>
  );
};

export default HomePage;
