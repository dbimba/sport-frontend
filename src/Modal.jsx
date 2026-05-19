import { useState, useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ product, onClose, onConfirm }) {
  const [qty, setQty]           = useState(1);
  const [file, setFile]         = useState(null);
  const [fileName, setFileName] = useState('');
  const overlayRef              = useRef(null);

  // Закрити по кнопці Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Закрити по кліку на фон
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  const handleSubmit = () => {
    // Передаємо file та qty вгору в App.jsx → handleBuy
    onConfirm(product.id, product.current_price, file, qty);
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal}>

        {/* Хрестик */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрити">✕</button>

        {/* Шапка: превʼю товару */}
        <div className={styles.productPreview}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className={styles.productImg} />
          ) : (
            <div className={styles.noImg}>📦</div>
          )}
          <div>
            <p className={styles.articleLabel}>{product.article}</p>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>
              {Number(product.current_price).toLocaleString('uk-UA')} грн
            </p>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Форма */}
        <div className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label}>Кількість</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className={styles.qtyInput}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Скріншот / чек оплати</label>
            <p className={styles.hint}>Прикріпіть фото або PDF підтвердження оплати</p>
            <label className={styles.fileLabel}>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <span className={styles.fileBtn}>📎 Вибрати файл</span>
              <span className={styles.fileName}>
                {fileName || 'Файл не вибрано'}
              </span>
            </label>
          </div>

        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Скасувати</button>
          <button className={styles.btnConfirm} onClick={handleSubmit}>
            Підтвердити оплату
          </button>
        </div>

      </div>
    </div>
  );
}
