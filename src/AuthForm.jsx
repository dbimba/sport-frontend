import { useState } from 'react';
import { loginUser, registerUser } from './api';
import styles from './AuthForm.module.css';

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin,  setIsLogin]  = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error,    setError]    = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('email', response.data.email);
        onAuthSuccess(response.data.email);
      } else {
        await registerUser({ name, email, password, password_confirmation: password });
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Помилка авторизації", error);
      setError('Помилка! Перевір введені дані.');
    }
  };

  return (
    <div className={styles.page}>

      {/* Логотип */}
      <div className={styles.logo}>
        Sport<span>Nutrition</span>
      </div>

      {/* Картка */}
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isLogin ? 'Вхід до акаунту' : 'Реєстрація'}
        </h2>
        <p className={styles.subtitle}>
          {isLogin
            ? 'Введіть свої дані щоб продовжити'
            : 'Створіть акаунт щоб робити покупки'}
        </p>

        {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Імʼя"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль (мін. 8 символів)"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.btnSubmit}>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        <div className={styles.switchWrap}>
          {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}
          <button
            className={styles.btnSwitch}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </div>
      </div>

    </div>
  );
}
