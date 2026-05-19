import { useState } from 'react';
import { loginUser, registerUser } from './api';

export default function AuthForm({ onAuthSuccess}) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ДОДАНО: Витягуємо дані зі стану форми, щоб їх бачив Axios
    const { name, email, password } = formData; 

    try {
      if (isLogin) {
        // Логіка входу
        const response = await loginUser({ email, password });
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('email', response.data.email); 
        
        // ВИПРАВЛЕНО: Викликаємо правильний пропс і передаємо туди email
        onAuthSuccess(response.data.email); 
      } else {
        // Логіка реєстрації
        await registerUser({ name, email, password, password_confirmation: password });
        alert('Реєстрація успішна! Тепер увійдіть.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Помилка авторизації", error);
      alert('Помилка! Перевір дані.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {!isLogin && (
          <input 
            type="text" 
            name="name" 
            placeholder="Ім'я" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ padding: '8px' }}
          />
        )}
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Пароль (мін. 8 символів)" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
      
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isLogin ? 'Немає акаунту? Зареєструватися' : 'Вже є акаунт? Увійти'}
      </button>
    </div>
  );
}