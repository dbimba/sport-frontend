import { useState } from 'react';
import { createProduct } from './api';
import styles from './ProductForm.module.css';

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name:          '',
    article:       '',
    current_price: '',
    category_id:   1,
    image_url:     ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(form);
      onProductAdded();
      setForm({ name: '', article: '', current_price: '', category_id: 1, image_url: '' });
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Помилка! Перевір консоль (F12).");
    }
  };

  return (
    <div className={styles.wrap}>

      {/* Заголовок */}
      <div className={styles.header}>
        <div className={styles.dot} />
        <h3 className={styles.title}>Додати новий товар</h3>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Рядок: Назва + Артикул + Ціна */}
        <div className={styles.row}>
          <input
            type="text"
            placeholder="Назва (напр. Креатин)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={`${styles.input} ${styles.inputName}`}
          />
          <input
            type="text"
            placeholder="Артикул (напр. CR-01)"
            value={form.article}
            onChange={(e) => setForm({ ...form, article: e.target.value })}
            required
            className={`${styles.input} ${styles.inputArticle}`}
          />
          <input
            type="number"
            placeholder="Ціна (грн)"
            value={form.current_price}
            onChange={(e) => setForm({ ...form, current_price: e.target.value })}
            required
            className={`${styles.input} ${styles.inputPrice}`}
          />
        </div>

        {/* URL фото */}
        <input
          type="text"
          placeholder="Посилання на фото (URL)"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className={styles.inputUrl}
        />

        <button type="submit" className={styles.btnSave}>
          Зберегти товар
        </button>

      </form>
    </div>
  );
}
