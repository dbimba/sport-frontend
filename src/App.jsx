import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, logoutUser, createTransaction } from './api';
import ProductForm from './ProductForm';
import AuthForm    from './AuthForm';
import ProductCard from './ProductCard';
import Modal       from './Modal';
import StatsPanel  from './StatsPanel';
import OrdersPanel from './OrdersPanel';
import styles from './App.module.css';

const CATEGORIES = [
  { id: 1, name: 'Протеїни' },
  { id: 2, name: 'Амінокислоти та Креатин' },
  { id: 3, name: 'Передтренувальні комплекси' },
  { id: 4, name: 'Вітаміни та БАДи' },
  { id: 5, name: 'Здорове харчування та Снеки' },
];

function App() {
  const [products,        setProducts]        = useState([]);
  const [search,          setSearch]          = useState('');
  const [categoryId,      setCategoryId]      = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userEmail,       setUserEmail]       = useState(localStorage.getItem('email'));
  const [selectedProduct, setSelectedProduct] = useState(null);

  const adminEmail = 'admin@gmail.com';
  const isAdmin    = userEmail === adminEmail;

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ search, category_id: categoryId });
      setProducts(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні товарів:', error);
    }
  };

  const handleBuy = async (productId, currentPrice, file, qty) => {
    if (!file) {
      alert('Будь ласка, завантажте скріншот чека про оплату!');
      return;
    }
    const formData = new FormData();
    formData.append('product_id',     productId);
    formData.append('quantity',       qty || 1);
    formData.append('price_per_unit', currentPrice);
    formData.append('document',       file);
    try {
      await createTransaction(formData);
      alert('Оплата успішна! Чек відправлено на перевірку.');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Помилка транзакції:', error);
      alert('Не вдалося завершити покупку. Перевір консоль.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Дійсно видалити цей товар?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Помилка при видаленні:', error);
      alert('Помилка видалення. Перевір консоль.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Помилка при виході', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthForm onAuthSuccess={(email) => {
        setIsAuthenticated(true);
        setUserEmail(email);
      }} />
    );
  }

  return (
    <div className={styles.app}>

      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          Sport<span>Nutrition</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userEmail}>
            Вітаємо, <strong>{userEmail}</strong>
          </span>
          <button className={styles.btnLogout} onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className={styles.main}>

        {/* Форма додавання товару — тільки адмін */}
        {isAdmin && <ProductForm onProductAdded={fetchProducts} />}

        {/* Аналітика складу — тільки адмін */}
        {isAdmin && <StatsPanel products={products} />}

        {/* Панель замовлень — тільки адмін */}
        {isAdmin && <OrdersPanel />}

        {/* Фільтри */}
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Пошук за назвою або артикулом..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className={styles.searchInput}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">Всі категорії</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={fetchProducts} className={styles.btnSearch}>
            🔍 Знайти
          </button>
        </div>

        {/* Заголовок секції */}
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Каталог товарів</h2>
          {products.length > 0 && (
            <span className={styles.sectionCount}>{products.length} товарів</span>
          )}
        </div>

        {/* Сітка карток */}
        <div className={styles.grid}>
          {products.length === 0 ? (
            <p className={styles.empty}>Товарів не знайдено</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onBuy={setSelectedProduct}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

      </main>

      {/* ─── Модальне вікно покупки ─── */}
      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleBuy}
        />
      )}

    </div>
  );
}

export default App;
