import { useState } from 'react';
import { createProduct } from './api';

export default function ProductForm({ onProductAdded }) {
  // 1. Створюємо порожню форму (сховище для того, що вводить користувач)
  const [form, setForm] = useState({
    name: '',
    article: '',
    current_price: '',
    category_id: 1, // За замовчуванням ставимо категорію 1 (наприклад, Протеїни)
    image_url: ''
  });

  // 2. Ця функція спрацьовує, коли ми натискаємо "Зберегти товар"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Щоб сторінка не перезавантажувалася, як у старих сайтах
    try {
      // Відправляємо дані нашому кур'єру (в Laravel)
      await createProduct(form); 
      
      // Кажемо таблиці в App.jsx: "Гей, я додав товар, онови список!"
      onProductAdded(); 
      
      // Очищаємо поля форми, щоб можна було вводити наступний товар
      setForm({ name: '', article: '', current_price: '', category_id: 1 }); 
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Помилка! Перевір консоль (F12).");
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: '0' }}>➕ Додати новий товар</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Назва (напр. Креатин)" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          required 
          style={{ padding: '8px', flex: '1' }}
        />
        <input 
          type="text" 
          placeholder="Артикул (напр. CR-01)" 
          value={form.article} 
          onChange={(e) => setForm({ ...form, article: e.target.value })} 
          required 
          style={{ padding: '8px', flex: '1' }}
        />
        <input 
          type="number" 
          placeholder="Ціна (грн)" 
          value={form.current_price} 
          onChange={(e) => setForm({ ...form, current_price: e.target.value })} 
          required 
          style={{ padding: '8px', width: '120px' }}
        />
        <input
        type="text"
        placeholder="Посилання на фото (URL)"
        value={form.image_url}
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Зберегти товар
        </button>
      </form>
    </div>
  );
}