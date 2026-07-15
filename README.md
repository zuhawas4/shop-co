# Shop.co — Fashion E-commerce

Fully connected React + Tailwind frontend with Node.js / Express + MongoDB backend.

---

## What’s working

- Dynamic products from MongoDB (no hardcoded catalog)
- Product details with gallery, size/color, quantity, add to cart
- Cart with live totals (subtotal, discount, delivery, total)
- Signup / login / logout with JWT + bcrypt
- Guest cart via `x-guest-id` (localStorage), merges on login
- Navbar shows Login/Signup or Profile/Logout + cart count
- Routes for home, shop, category/dress styles, search, cart, auth, account
- Fonts match Home (`Integral CF` + `Satoshi` from `/fonts`)
- Real product/category images from `public/images`

---

## Project structure

### Backend (`backend/`)

```
backend/
 ├── models/          # User, Product, Cart
 ├── routes/          # auth, products, cart
 ├── controllers/
 ├── middleware/      # JWT auth
 ├── config/          # MongoDB connection
 ├── seed/            # Product seed script
 ├── docker-compose.yml
 ├── server.js
 └── .env
```

### Frontend (`src/`)

```
src/
 ├── api/             # client, auth, products, cart
 ├── context/         # AuthContext, CartContext
 ├── components/      # Header, Cart, ProductPage, Category, etc.
 ├── pages/           # Home, Shop, Login, Signup, Search, Account
 └── index.css        # Fonts + typography utilities
```

---

## 1. Database setup

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community) **or** use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and set `MONGODB_URI` in `backend/.env`.
2. Default local URI: `mongodb://127.0.0.1:27017/shopco`
3. Optional Docker (from `backend/`):

```bash
docker compose up -d
```

4. Seed products (15 products with images, sizes, colors):

```bash
cd backend
npm run seed
```

Users are created via the Signup page/API. Passwords are hashed with bcrypt and never stored as plain text.

---

## 2. Backend setup

```bash
cd backend
npm install
```

Ensure `backend/.env` exists (copy from `.env.example` if needed):

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopco
JWT_SECRET=shopco_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d
```

Start the API:

```bash
npm run dev
```

API runs at **http://localhost:5000**

### Main API routes

| Area     | Endpoints |
|----------|-----------|
| Health   | `GET /api/health` |
| Auth     | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` |
| Products | `GET /api/products`, `GET /api/products/:id`, `POST/PUT/DELETE` (JWT) |
| Cart     | `GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:id`, `DELETE /api/cart/items/:id` |

Cart supports logged-in users (JWT) and guests (`x-guest-id` header).

---

## 3. Frontend setup

```bash
# from project root
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**  
Vite proxies `/api` requests to `http://localhost:5000`.

---

## 4. How to run (both)

**Terminal 1 — backend**

```bash
cd "C:\Users\User\Downloads\shop-co 1\shop-co\backend"
npm run dev
```

**Terminal 2 — frontend**

```bash
cd "C:\Users\User\Downloads\shop-co 1\shop-co"
npm run dev
```

Open **http://localhost:5173**

From the project root you can also use:

```bash
npm run backend   # start API
npm run seed      # re-seed products
npm run build     # production frontend build
```

---

## 5. Test the full flow

1. Open the website  
2. Browse products / dress styles  
3. Open a product → select size & color → Add to Cart  
4. Open cart → change quantity / remove items → check totals  
5. Sign up → log in → log out  
6. Confirm cart count updates in the navbar  

---

## 6. Recommended next improvements

- Stripe / PayPal checkout (order summary structure is ready)
- Admin panel for product CRUD
- Persist reviews in MongoDB
- Order history model
- Image CDN / WebP optimization
- Email verification & password reset

---

## Typography

Use the same system as `Home.jsx`:

- Headings: `font-integral` (or `.font-heading`)
- Body: `font-satoshi` (or `.font-body`)

Fonts live in `public/fonts/`.
