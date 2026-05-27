import { useState, useEffect, useCallback } from 'react';
import { getTransactions, updateTransactionStatus, deleteTransaction } from './api';
import styles from './OrdersPanel.module.css';

const STATUS_LABELS = {
  pending:   { text: 'Очікує',       className: 'pending'   },
  confirmed: { text: 'Підтверджено', className: 'confirmed' },
  rejected:  { text: 'Відхилено',    className: 'rejected'  },
};

export default function OrdersPanel() {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setOrders(res.data);
    } catch (err) {
      console.error('Помилка завантаження замовлень:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateTransactionStatus(id, newStatus);
      setOrders(prev =>
        prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error('Помилка зміни статусу:', err);
      alert('Не вдалося змінити статус.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити це відхилене замовлення? Файл чека також буде видалено.')) return;
    setUpdatingId(id);
    try {
      await deleteTransaction(id);
      // Прибираємо рядок локально — без зайвого запиту
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Помилка видалення:', err);
      alert('Не вдалося видалити замовлення.');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = orders.reduce(
    (acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; },
    {}
  );

  return (
    <div className={styles.panel}>

      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.icon}>📋</span>
          <h3 className={styles.title}>Замовлення</h3>
          {!loading && (
            <span className={styles.totalBadge}>{orders.length} всього</span>
          )}
        </div>
        <div className={styles.counters}>
          <span className={`${styles.counter} ${styles.counterPending}`}>
            ⏳ {counts.pending || 0} очікує
          </span>
          <span className={`${styles.counter} ${styles.counterConfirmed}`}>
            ✓ {counts.confirmed || 0} підтверджено
          </span>
          <span className={`${styles.counter} ${styles.counterRejected}`}>
            ✕ {counts.rejected || 0} відхилено
          </span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Завантаження замовлень...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p>Замовлень поки немає</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Покупець</th>
                <th>Товар</th>
                <th>К-сть</th>
                <th>Сума</th>
                <th>Чек</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const s      = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                const isThis = updatingId === order.id;

                return (
                  <tr key={order.id} className={isThis ? styles.rowUpdating : ''}>

                    <td className={styles.idCell}>#{order.id}</td>

                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.userName}>{order.user?.name ?? '—'}</span>
                        <span className={styles.userEmail}>{order.user?.email ?? '—'}</span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.productCell}>
                        <span className={styles.productName}>{order.product?.name ?? '—'}</span>
                        <span className={styles.productArticle}>{order.product?.article ?? '—'}</span>
                      </div>
                    </td>

                    <td className={styles.centerCell}>{order.quantity}</td>

                    <td className={styles.priceCell}>
                      {Number(order.total).toLocaleString('uk-UA')} грн
                    </td>

                    <td className={styles.centerCell}>
                      {order.document_url ? (
                        <a
                          href={order.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.receiptLink}
                        >
                          📄 Чек
                        </a>
                      ) : (
                        <span className={styles.noReceipt}>—</span>
                      )}
                    </td>

                    <td className={styles.dateCell}>{order.created_at}</td>

                    <td>
                      <span className={`${styles.badge} ${styles[s.className]}`}>
                        {s.text}
                      </span>
                    </td>

                    {/* ── Дії: залежать від статусу ── */}
                    <td>
                      {order.status === 'pending' && (
                        <div className={styles.actions}>
                          <button
                            className={styles.btnConfirm}
                            onClick={() => handleStatusChange(order.id, 'confirmed')}
                            disabled={isThis}
                            title="Підтвердити"
                          >✓</button>
                          <button
                            className={styles.btnReject}
                            onClick={() => handleStatusChange(order.id, 'rejected')}
                            disabled={isThis}
                            title="Відхилити"
                          >✕</button>
                        </div>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          className={styles.btnReset}
                          onClick={() => handleStatusChange(order.id, 'pending')}
                          disabled={isThis}
                          title="Повернути до розгляду"
                        >↩</button>
                      )}

                      {order.status === 'rejected' && (
                        <div className={styles.actions}>
                          <button
                            className={styles.btnReset}
                            onClick={() => handleStatusChange(order.id, 'pending')}
                            disabled={isThis}
                            title="Повернути до розгляду"
                          >↩</button>
                          <button
                            className={styles.btnDelete}
                            onClick={() => handleDelete(order.id)}
                            disabled={isThis}
                            title="Видалити замовлення"
                          >🗑</button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
