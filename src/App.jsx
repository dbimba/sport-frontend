import { useState, useEffect } from 'react';
import { getProducts, deleteProduct, logoutUser, createTransaction } from './api'; // ДОДАНО: імпорт logoutUser
import ProductForm from './ProductForm';
import AuthForm from './AuthForm';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';

function App() {
  // 1. Створюємо "сховище" (state) для наших товарів.
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email'));
  const adminEmail = 'admin@gmail.com';

  // 2. Функція завантаження товарів
  const fetchProducts = async () => {
    try {
      const response = await getProducts({ search: search, category_id: categoryId });
      setProducts(response.data);
    } catch (error) {
      console.error("Помилка при завантаженні товарів:", error);
    }
  };

  // Ось тут має бути функція handleBuy:
  const handleBuy = async (productId, currentPrice) => {
    // Знаходимо інпути конкретного товару за їхніми ID
    const fileInput = document.getElementById(`file-${productId}`);
    const qtyInput = document.getElementById(`qty-${productId}`);

    // Валідація: не пускаємо запит, якщо юзер не вибрав чек
    if (!fileInput.files[0]) {
      alert("Будь ласка, завантажте скріншот чека про оплату!");
      return;
    }

    // Створюємо об'єкт FormData
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('quantity', qtyInput.value || 1);
    formData.append('price_per_unit', currentPrice);
    formData.append('document', fileInput.files[0]); // Передаємо файл

    try {
      await createTransaction(formData); // Ось тут ми викликаємо функцію з api.js
      alert("Оплата успішна! Чек відправлено на перевірку.");
      fileInput.value = ""; 
      qtyInput.value = 1;   
    } catch (error) {
      console.error("Помилка транзакції:", error);
      alert("Не вдалося завершити покупку. Перевір консоль.");
    }
  };

  const handleDelete = async (id) => {
    // Вбудоване вікно підтвердження, щоб не видалити випадково
    if (!window.confirm("Дійсно видалити цей товар?")) return;
    
    try {
      await deleteProduct(id); // Запит на бекенд
      fetchProducts(); // Миттєве оновлення таблиці після видалення
    } catch (error) {
      console.error("Помилка при видаленні:", error);
      alert("Помилка видалення. Перевір консоль.");
    }
  };

  // ОНОВЛЕНО: Нова асинхронна функція виходу
  const handleLogout = async () => {
    try {
      await logoutUser(); 
    } catch (error) {
      console.error("Помилка при виході", error);
    } finally {
      localStorage.removeItem('token'); 
      localStorage.removeItem('email'); // Чистимо email з браузера
      setIsAuthenticated(false); 
      setUserEmail(null); // Скидаємо стан
    }
  };

  // Правильний useEffect для завантаження даних
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // ОНОВЛЕНО: Приймаємо email від форми авторизації
  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={(email) => { 
      setIsAuthenticated(true);
      setUserEmail(email); 
    }} />;
  }

  return (
    <div className="App">
      
      {/* ОНОВЛЕНО: Додано блок з привітанням та кнопкою виходу */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Sport Nutrition - Магазин спортивного харчування</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Вітаємо, <b>{userEmail}</b>!</span>
          <button 
            onClick={handleLogout} 
            style={{ padding: '8px 16px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Вийти
          </button>
        </div>
      </div>

      {/* ОНОВЛЕНО: Форма додавання показується ТІЛЬКИ адміністратору */}
      {userEmail === adminEmail && (
        <ProductForm onProductAdded={fetchProducts}></ProductForm>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        
        <input 
          type="text" 
          placeholder="Пошук за назвою або артикулом..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Всі категорії</option>
          <option value="1">Протеїни (Категорія 1)</option>
          <option value="2">Креатин (Категорія 2)</option>
          <option value="3">Вітаміни (Категорія 3)</option>
          <option value="4">Передтреники (Категорія 4)</option>
        </select>

        <button 
          onClick={fetchProducts} 
          style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔍 Знайти
        </button>
        
      </div>

      <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Фото</th>
            <th>Назва</th>
            <th>Артикул</th>
            <th>Ціна (грн)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <span style={{ fontSize: '12px', color: '#888' }}>Немає фото</span>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.article}</td>
              
              {/* ОСТАННЯ КОЛОНКА - ДІЇ */}
              <td>
                <div style={{ marginBottom: '10px' }}>
                  <strong>{product.current_price} грн</strong>
                </div>
                
                {userEmail === adminEmail ? (
                  // ВЕРСІЯ ДЛЯ АДМІНА
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ padding: '6px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Видалити товар
                  </button>
                ) : (
                  // ВЕРСІЯ ДЛЯ ЮЗЕРА
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div>
                      <label style={{ fontSize: '12px', marginRight: '5px' }}>К-сть:</label>
                      <input type="number" id={`qty-${product.id}`} defaultValue="1" min="1" style={{ width: '50px', padding: '2px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', display: 'block' }}>Чек (фото/PDF):</label>
                      <input type="file" id={`file-${product.id}`} accept=".jpg,.jpeg,.png,.pdf" style={{ fontSize: '11px', width: '160px' }} />
                    </div>
                    <button 
                      onClick={() => handleBuy(product.id, product.current_price)}
                      style={{ marginTop: '5px', padding: '6px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Купити
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;