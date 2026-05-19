import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, logoutUser, createTransaction } from './api';
import ProductForm from './ProductForm';
import AuthForm   from './AuthForm';
import ProductCard from './ProductCard';
import Modal       from './Modal';
import styles from './App.module.css';

function App() {
  // ── Стейт (нічого не змінювалось, крім selectedProduct) ──────────────
  const [products,         setProducts]         = useState([]);
  const [search,           setSearch]           = useState('');
  const [categoryId,       setCategoryId]       = useState('');
  const [isAuthenticated,  setIsAuthenticated]  = useState(!!localStorage.getItem('token'));
  const [userEmail,        setUserEmail]        = useState(localStorage.getItem('email'));
  const [selectedProduct,  setSelectedProduct]  = useState(null); // null = модал закритий

  const adminEmail = 'admin@gmail.com';
  const isAdmin    = userEmail === adminEmail;

  // ── API: завантаження товарів (без змін) ─────────────────────────────
  const fetchProducts = async () => {
    try {
      const response = await getProducts({ search, category_id: categoryId });
      setProducts(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні товарів:", error);
    }
  };

  // ── handleBuy: рефакторинг — більше не читаємо DOM через getElementById
  //    Тепер file і qty приходять безпосередньо з Modal ──────────────────
  const handleBuy = async (productId, currentPrice, file, qty) => {
    if (!file) {
      alert("Будь ласка, завантажте скріншот чека про оплату!");
      return;
    }

    const formData = new FormData();
    formData.append('product_id',    productId);
    formData.append('quantity',      qty || 1);
    formData.append('price_per_unit', currentPrice);
    formData.append('document',      file);

    try {
      await createTransaction(formData);
      alert("Оплата успішна! Чек відправлено на перевірку.");
      setSelectedProduct(null); // закриваємо модал після успіху
    } catch (error) {
      console.error("Помилка транзакції:", error);
      alert("Не вдалося завершити покупку. Перевір консоль.");
    }
  };

  // ── handleDelete (без змін) ───────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Дійсно видалити цей товар?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Помилка видалення. Перевір консоль.");
    }
  };

  // ── handleLogout (без змін) ───────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Помилка при виході", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  // ── useEffect (без змін) ──────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  // ── Сторінка авторизації ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <AuthForm onAuthSuccess={(email) => {
        setIsAuthenticated(true);
        setUserEmail(email);
      }} />
    );
  }

  // ── Головна сторінка ──────────────────────────────────────────────────
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

        {/* Форма додавання товару — тільки для адміна */}
        {isAdmin && <ProductForm onProductAdded={fetchProducts} />}

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
            <option value="1">Протеїни</option>
            <option value="2">Креатин</option>
            <option value="3">Вітаміни</option>
            <option value="4">Передтреники</option>
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
                onBuy={setSelectedProduct}   // клік "Купити" → відкриває модал
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
