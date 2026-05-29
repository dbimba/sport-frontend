# SportNutrition — Інтернет-магазин спортивного харчування

> Full-stack pet-project: React SPA + Laravel REST API з автентифікацією, рольовою моделлю та завантаженням файлів.

## Про проект

SportNutrition — це навчальний full-stack проект інтернет-магазину спортивного харчування. Мета — відпрацювати побудову REST API на Laravel, клієнтського SPA на React, та їхню взаємодію через токен-автентифікацію.

## Технічний стек

### Backend
| Інструмент | Версія | Призначення |
|---|---|---|
| PHP | ^8.2 | Мова програмування |
| Laravel | ^12.0 | MVC-фреймворк, маршрутизація, ORM |
| Laravel Sanctum | ^4.0 | Token-based автентифікація (SPA) |
| MySQL | 8.0+ | База даних |
| Eloquent ORM | — | Робота з БД через моделі |

### Frontend
| Інструмент | Версія | Призначення |
|---|---|---|
| React | ^19 | UI-бібліотека, компонентний підхід |
| Vite | ^8 | Збірник, dev-сервер |
| Axios | ^1.16 | HTTP-запити до API |
| CSS Modules | — | Ізольована стилізація компонентів |

---

### Рольова модель

Проект має два типи користувачів, визначених по `email`:

| Роль | Email | Можливості |
|---|---|---|
| **Адміністратор** | `admin@gmail.com` | Додавати та видаляти товари, переглядати аналітику складу, керувати замовленнями |
| **Користувач** | будь-який інший | Переглядати каталог, купувати товари (з підтвердженням чеком) |

---

### Статуси замовлень

| Статус | Опис | Доступні дії |
|---|---|---|
| ⏳ Очікує | Нове замовлення | Підтвердити / Відхилити |
| ✅ Підтверджено | Оплата прийнята | Повернути до розгляду |
| ❌ Відхилено | Оплата відхилена | Повернути до розгляду / Видалити |

---

## Структура проекту

```
SportNutrition/
│
├── sport_nutrition_shop/          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/
│   │   │   │   └── ProductController.php
│   │   │   ├── AuthController.php
│   │   │   └── TransactionController.php  # store, index, updateStatus, destroy
│   │   └── Models/
│   │       ├── Product.php        # belongsTo Category
│   │       ├── Category.php       # hasMany Products
│   │       ├── Transaction.php    # belongsTo User, Product
│   │       └── User.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/               # CategorySeeder, ProductSeeder
│   └── routes/
│       └── api.php
│
└── sport_frontend/                # React Frontend
    └── src/
        ├── api.js                 # Axios instance + всі API-функції
        ├── App.jsx                # Головний компонент, весь стейт
        ├── App.module.css
        ├── AuthForm.jsx           # Вхід / реєстрація
        ├── AuthForm.module.css
        ├── ProductCard.jsx        # Картка одного товару
        ├── ProductCard.module.css
        ├── ProductForm.jsx        # Форма додавання товару (адмін)
        ├── ProductForm.module.css
        ├── Modal.jsx              # Модальне вікно покупки
        ├── Modal.module.css
        ├── StatsPanel.jsx         # Аналітика складу (адмін)
        ├── StatsPanel.module.css
        ├── OrdersPanel.jsx        # Панель замовлень (адмін)
        ├── OrdersPanel.module.css
        └── useStatsAnalytics.js   # Custom hook з useMemo
```

---

## Швидкий старт

### Вимоги
- PHP 8.2+
- Composer
- Node.js 18+
- npm
- MySQL 8.0+

### 1. Клонувати репозиторій

### 2. Запустити бекенд
```bash
cd sport_nutrition_shop

# Встановити залежності
composer install

# Налаштувати середовище
cp .env.example .env
php artisan key:generate

# У .env вказати дані MySQL:
# DB_DATABASE=sport_nutrition_db
# DB_USERNAME=root
# DB_PASSWORD=

# Підготувати базу даних
php artisan migrate --seed

# Зробити storage доступним публічно (для чеків)
php artisan storage:link

# Запустити сервер
php artisan serve
# → http://localhost:8000
```

### 3. Запустити фронтенд
```bash
cd sport_frontend

npm install
npm run dev
# → http://localhost:5173