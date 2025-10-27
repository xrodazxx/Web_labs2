import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, resetError } from '../../store/slices/authSlice';
import styles from './Login.module.scss';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Notification from '../../components/Notification/Notification';
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, isError, errorMessage } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isError && errorMessage) {
      setNotification({ type: 'error', message: errorMessage });
      dispatch(resetError());
    }
  }, [isError, errorMessage, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setNotification({ type: 'success', message: 'Успешный вход! Перенаправляем...' });

      const timer = setTimeout(() => {
        navigate('/events', { replace: true });
      }, 1700);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setNotification(null);
    await dispatch(loginUser(formData));
    // редирект произойдёт позже в useEffect при isAuthenticated
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Вход в систему</h1>
          <p>Введите почту и пароль</p>
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Введите ваш email"
            required
          />

          <Input
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Введите пароль"
            required
          />

          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Авторизация...' : 'Войти'}
          </Button>
        </form>

        <div className={styles.loginLink}>
          <p>
            Еще нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
