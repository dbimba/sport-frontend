import { useStatsAnalytics } from './useStatsAnalytics';
import styles from './StatsPanel.module.css';

const BAR_COLORS = ['#FF5E00', '#2563EB', '#16A34A', '#9333EA'];

export default function StatsPanel({ products }) {
  const { totalValue, totalCount, categories } = useStatsAnalytics(products);

  if (totalCount === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h3 className={styles.title}>Аналітика складу</h3>
        </div>
        <div className={styles.totalBadge}>
          Загальна вартість:&nbsp;
          <strong>{totalValue.toLocaleString('uk-UA')} грн</strong>
        </div>
      </div>
      <div className={styles.list}>
        {categories.map((cat, i) => (
          <div key={cat.name} className={styles.row}>
            <div className={styles.meta}>
              <span className={styles.catName}>{cat.name}</span>
              <span className={styles.catCount}>{cat.count} товар(и)</span>
            </div>
            <div className={styles.barWrap}>
              <div
                className={styles.bar}
                style={{
                  width:      `${cat.percent}%`,
                  background: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            </div>
            <div className={styles.nums}>
              <span className={styles.sum}>
                {cat.sum.toLocaleString('uk-UA')} грн
              </span>
              <span
                className={styles.percent}
                style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}
              >
                {cat.percent}%
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
