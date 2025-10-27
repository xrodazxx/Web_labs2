import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchCurrentUser } from "../../store/slices/profileSlice";
import { logoutUser } from "../../store/slices/authSlice";
import styles from "./Home.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/localStorage";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.backgroundAnimation}></div>

      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logoContainer}>
            <img src="/app.png" alt="Logo" className={styles.logo} />
            <h1 className={styles.title}>
              Cyber<span>Events</span>
            </h1>
          </div>

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>👤 {user.name}</span>
              <button 
                className={styles.primaryButton} 
                onClick={() => navigate("/events")}
              >
                🎯 Мои события
              </button>
              <button 
                className={styles.primaryButton}
                onClick={() => navigate("/profile")}
              >
                ⚡ Профиль
              </button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                🚪 Выйти
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login">
                <button className={styles.authButton}>🔐 Войти</button>
              </Link>
              <Link to="/register">
                <button className={styles.authButton}>✨ Создать аккаунт</button>
              </Link>
            </div>
          )}
        </div>

        <p className={styles.subtitle}>
          <strong>🚀 Добро пожаловать в будущее управления мероприятиями!</strong><br/>
          Создавайте кибер-события, управляйте виртуальными пространствами<br/>
          и контролируйте цифровые собрания с инновационным подходом.
        </p>
      </header>

      <div className={styles.features}>
        <div className={styles.row}>
          <div
            className={styles.featureCard}
            onClick={() => navigate("/events")}
          >
            <div className={styles.featureIcon}>🎮</div>
            <h3>КИБЕР-СОБЫТИЯ</h3>
            <p>
              Создавайте виртуальные мероприятия с продвинутыми настройками<br/>
              и неоновым дизайном.
            </p>
            <p>⚡ Мгновенная синхронизация</p>
          </div>
        </div>

        <div className={styles.row}>
          <div 
            className={styles.featureCard}
            onClick={() => user ? navigate("/events") : navigate("/register")}
          >
            <div className={styles.featureIcon}>👥</div>
            <h3>НЕЙРО-КОЛЛАБОРАЦИЯ</h3>
            <p>
              Организуйте кибер-встречи с расширенной реальностью<br/>
              и голографическими участниками.
            </p>
            <p>🔮 Технология будущего</p>
          </div>
          
          <div 
            className={styles.featureCard}
            onClick={() => user ? navigate("/profile") : navigate("/register")}
          >
            <div className={styles.featureIcon}>📊</div>
            <h3>ЦИФРОВАЯ АНАЛИТИКА</h3>
            <p>
              Получайте нейросетевые отчеты в реальном времени<br/>
              с предсказательной аналитикой.
            </p>
            <p>🧠 AI-ассистент</p>
          </div>
        </div>

        {/* Добавляем киберпанк элементы */}
        <div className={styles.cyberElements}>
          <div className={styles.cyberLine}></div>
          <div className={styles.cyberGrid}></div>
        </div>
      </div>
    </div>
  );
};

export default Home;