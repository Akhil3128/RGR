# Ranganayaki Godavari Ruchulu 🪔

A responsive website + admin panel for a homemade sweets business selling
authentic **Rajahmundry / Godavari** sweets and snacks in **Vizag**.

> **Traditional Taste, Pure Love** · Pre-orders only · 📞 +91 99638 14860

Built with **React + Vite + Tailwind CSS** on the frontend and **Supabase**
(Postgres + Auth) on the backend.

---

## ✨ Features

### Customer website (`/`)
- Elegant hero, brand story (Rajahmundry → Vizag) and quality section
- Product menu with cards (image placeholder, name, size, price, **Add to Order**)
- Cart drawer: add multiple items, increase/decrease quantity, remove items
- Customer form: name, phone, delivery/pickup, address, notes
- **Order on WhatsApp** button — sends the full order to `+91 99638 14860`
- Every order is also **saved to Supabase**
- "Pre-orders only" message shown clearly throughout
- Works **without Supabase** using sample products (great for a quick preview)

### Admin panel (`/admin`)
- Secure login via **Supabase Auth**
- Dashboard cards: Total Orders, Total Sales, Total Cost, Total Profit,
  Pending Orders, Low Stock Items
- **Products**: add / edit / delete, set price, set net rate (cost),
  mark available / unavailable
- **Inventory**: Opening Stock, Stock Received, Sales, and auto
  **Closing Stock = Opening + Received − Sales** (with low-stock alerts)
- **Orders**: view website orders, update status
  (New → Confirmed → Preparing → Ready → Delivered / Cancelled) and payment
  status (Pending / Paid / Partial)

### Key formulas
| Metric | Formula |
| --- | --- |
| Sales Amount | Qty Sold × Selling Price |
| Cost Amount | Qty Sold × Net Rate |
| Profit | Sales Amount − Cost Amount |
| Closing Stock | Opening Stock + Stock Received − Sales |

---

## 📁 Folder structure

```
.
├── index.html                  # App entry HTML (fonts, title)
├── .env.example                # Copy to .env and fill in your keys
├── package.json
├── tailwind.config.js          # Brand colours: maroon, forest, gold, cream
├── vite.config.js
├── supabase/
│   └── schema.sql              # Run this in Supabase SQL Editor
└── src/
    ├── main.jsx                # App bootstrap + providers
    ├── App.jsx                 # Routes (customer + admin)
    ├── index.css               # Tailwind + reusable component classes
    ├── config.js               # Business info (name, phone, tagline)
    ├── constants.js            # Order/payment statuses, categories
    ├── lib/
    │   └── supabase.js         # Supabase client (safe when not configured)
    ├── context/
    │   ├── CartContext.jsx     # Cart state (localStorage)
    │   └── AuthContext.jsx     # Admin auth state
    ├── services/
    │   ├── products.js         # Fetch products (sample fallback)
    │   ├── orders.js           # Save orders
    │   └── admin.js            # Admin CRUD + dashboard queries
    ├── data/
    │   └── sampleProducts.js   # Used only when Supabase is not set up
    ├── utils/
    │   ├── format.js           # ₹ formatting + labels
    │   └── whatsapp.js         # Build WhatsApp order message + link
    ├── components/
    │   ├── Navbar.jsx  Hero.jsx  BrandStory.jsx  QualitySection.jsx
    │   ├── ProductMenu.jsx  ProductCard.jsx  ProductImage.jsx
    │   ├── CartDrawer.jsx  Footer.jsx  WhatsAppFloat.jsx  icons.jsx
    │   └── admin/
    │       ├── ProtectedRoute.jsx  DashboardStats.jsx
    │       ├── ProductsManager.jsx InventoryManager.jsx OrdersManager.jsx
    └── pages/
        ├── HomePage.jsx  NotFoundPage.jsx
        └── admin/
            ├── AdminLoginPage.jsx  AdminDashboardPage.jsx
```

---

## 🚀 Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app (works immediately with sample data)
```bash
npm run dev
```
Open the printed URL (usually http://localhost:5173).
Without Supabase you can already browse the menu, use the cart and order on
WhatsApp — a banner will remind you to connect Supabase for live data + admin.

### 3. (Optional but recommended) Connect Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. Copy the env file and paste your keys:
   ```bash
   cp .env.example .env
   ```
   Fill in from **Supabase → Project Settings → API**:
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_WHATSAPP_NUMBER=919963814860
   ```
3. In Supabase, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   This creates all tables (products, orders, order_items, inventory,
   admin_users), security rules, and seeds the 19 products.
4. Restart `npm run dev`.

---

## 🔑 Admin login instructions

1. In Supabase go to **Authentication → Users → Add user**.
   Enter an email + password and keep **Auto Confirm User** enabled.
2. Copy the new user's **UUID** (User ID).
3. In **SQL Editor**, run (replace the values):
   ```sql
   insert into public.admin_users (id, email)
   values ('PASTE-USER-UUID-HERE', 'admin@example.com');
   ```
4. Visit **`/admin/login`**, sign in, and you'll land on the dashboard.

> Only users listed in `admin_users` can manage products, inventory and orders.
> Customers can place orders but cannot read or change any data.

---

## 🧾 How ordering works

1. Customer adds items to the cart and fills in their details.
2. On **Order on WhatsApp**:
   - the order is saved to Supabase (if configured), and
   - WhatsApp opens with a pre-filled message to **+91 99638 14860** containing
     name, phone, items, quantities, prices, total, delivery/pickup, address
     and notes.
3. The order appears in the admin **Orders** tab, where you update its status
   and payment status.

---

## 🎨 Design

Mobile-first, traditional-yet-modern Indian sweet-shop look using:
- **Maroon** `#7B1E2B` · **Dark green** `#1F4D2E` · **Gold** `#C79A3A` ·
  **Cream** `#FBF4E6`
- Clean product cards, soft shadows, gold borders and a decorative divider.

To change the shop name, tagline or phone number, edit
[`src/config.js`](src/config.js).

---

## 🛠️ Scripts
```bash
npm run dev       # start dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## ☁️ Deploy
Any static host works (Vercel, Netlify, Cloudflare Pages):
- Build command: `npm run build`
- Output directory: `dist`
- Add the same `VITE_...` environment variables in the host's dashboard.

---

Made with ❤️ for a small homemade sweets business.
