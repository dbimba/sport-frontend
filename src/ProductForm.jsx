import { useState } from 'react';
import { createProduct } from './api';
import styles from './ProductForm.module.css';

const CATEGORIES = [
  { id: 1, name: 'Протеїни' },
  { id: 2, name: 'Амінокислоти та Креатин' },
  { id: 3, name: 'Передтренувальні комплекси' },
  { id: 4, name: 'Вітаміни та БАДи' },
  { id: 5, name: 'Здорове харчування та Снеки' },
];

const EMPTY_FORM = {
  name:          '',
  article:       '',
  current_price: '',
  category_id:   1,
  image_url:     '',
};

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(form);
      onProductAdded();
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Помилка! Перевір консоль (F12).");
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.dot} />
        <h3 className={styles.title}>Додати новий товар</h3>
      </div>

      <form onSubmit={handleSubmit}>

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
        <div className={styles.row}>
          <input
            type="text"
            placeholder="Посилання на фото (URL)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className={`${styles.input} ${styles.inputUrl}`}
          />
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
            className={styles.select}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.btnSave}>
          Зберегти товар
        </button>

      </form>
    </div>
  );
}
