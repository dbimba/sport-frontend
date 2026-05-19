import styles from './ProductCard.module.css';

export default function ProductCard({ product, isAdmin, onBuy, onDelete }) {
  return (
    <div className={styles.card}>

      {/* Фото */}
      <div className={styles.imageWrap}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage}>📦</div>
        )}
      </div>

      {/* Інфо */}
      <div className={styles.body}>
        <p className={styles.article}>{product.article}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>
          {Number(product.current_price).toLocaleString('uk-UA')}
          <span> грн</span>
        </p>
      </div>

      {/* Кнопка дії */}
      <div className={styles.footer}>
        {isAdmin ? (
          <button
            className={styles.btnDelete}
            onClick={() => onDelete(product.id)}
          >
            Видалити товар
          </button>
        ) : (
          <button
            className={styles.btnBuy}
            onClick={() => onBuy(product)}
          >
            Купити
          </button>
        )}
      </div>

    </div>
  );
}
