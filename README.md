# 🪔 Ranganayaki Godavari Ruchulu

**Traditional Taste, Pure Love**

A complete website for a homemade sweets business selling authentic
Rajahmundry / Godavari sweets and snacks in Vizag. Customers browse the menu,
build an order, and send it as a **WhatsApp pre-order** to **+91 99638 14860**.
An admin panel (behind Supabase login) manages products, prices, inventory and
orders.

Built with **React + Vite + Tailwind CSS + Supabase**.

---

## ✨ What's Included

**Customer website** (`/`)

- Hero section with the brand name and tagline
- Brand story: from Rajahmundry to Vizag
- Product menu grouped by category, with clean cards and "Add to Order"
- Cart with quantity +/− and remove
- Customer form: name, phone, delivery/pickup, address, notes
- One-tap WhatsApp button that sends the full order details
- "Pre-orders only" messaging and a quality-promise section
- Footer with contact number and WhatsApp chat button

**Admin panel** (`/admin`)

- Secure login with Supabase Auth
- Dashboard cards: Total Orders, Total Sales, Total Cost, Total Profit,
  Pending Orders, Low Stock Items
- Products: add / edit / delete, update selling price and net rate (cost
  price), mark available/unavailable
- Inventory: Opening Stock, Stock Received, Sales →
  **Closing Stock = Opening + Received − Sales** (calculated automatically)
- Orders: view website orders, update order status
  (New / Confirmed / Preparing / Ready / Delivered / Cancelled) and payment
  status (Pending / Paid / Partial)

**Works without Supabase too** — if the `.env` file is empty, the customer
site runs with built-in sample products and orders still go out via WhatsApp.
The admin login page shows setup instructions instead.

---

## 📁 Folder Structure

```
├── index.html                    # Page shell + Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js            # Brand colors (maroon, forest, gold, cream)
├── postcss.config.js
├── .env.example                  # Copy to .env and fill in Supabase keys
│
├── supabase/
│   └── schema.sql                # Full database schema + seed products
│
└── src/
    ├── main.jsx                  # App entry point
    ├── App.jsx                   # All routes (customer + admin)
    ├── index.css                 # Tailwind + shared button/card styles
    │
    ├── lib/
    │   ├── business.js           # Name, tagline, phone, WhatsApp link
    │   ├── supabase.js           # Supabase client (null if not configured)
    │   ├── sampleProducts.js     # Fallback menu when Supabase is empty
    │   └── format.js             # ₹ price and date formatting
    │
    ├── context/
    │   └── CartContext.jsx       # Cart state (saved in localStorage)
    │
    ├── hooks/
    │   └── useProducts.js        # Loads products (Supabase or samples)
    │
    ├── components/
    │   ├── Navbar.jsx            # Sticky header with cart badge
    │   ├── Footer.jsx            # Contact + WhatsApp + admin link
    │   ├── Hero.jsx              # Home page hero section
    │   ├── BrandStory.jsx        # Rajahmundry → Vizag story
    │   ├── ProductMenu.jsx       # Menu grouped by category
    │   ├── ProductCard.jsx       # Single product card
    │   ├── QualitySection.jsx    # Fresh / hygienic / quality promise
    │   ├── PreOrderBanner.jsx    # "Pre-orders only" strip
    │   └── WhatsAppIcon.jsx      # Inline WhatsApp logo
    │
    └── pages/
        ├── HomePage.jsx          # Customer home page
        ├── OrderPage.jsx         # Cart + customer form + WhatsApp order
        └── admin/
            ├── AdminLogin.jsx    # Supabase Auth login
            ├── AdminLayout.jsx   # Auth guard + admin navigation
            ├── Dashboard.jsx     # Stats cards + low stock list
            ├── ProductsAdmin.jsx # Product management
            ├── InventoryAdmin.jsx# Stock management
            └── OrdersAdmin.jsx   # Order + payment status management
```

---

## 🚀 Setup Steps

### 1. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173 — the site already works with sample products.

### 2. Create the Supabase backend (free)

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the project, open **SQL Editor**, paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
   This creates the `products`, `orders`, `order_items` and `inventory`
   tables, sets up security rules, and loads the starting menu.

### 3. Connect the website to Supabase

1. In Supabase go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public key**
2. Copy `.env.example` to `.env` and fill in both values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart the dev server (`npm run dev`). Products now come from the
   database and every order is saved automatically.

### 4. Create the admin login

1. In Supabase go to **Authentication → Users → Add user**.
2. Choose **Create new user**, enter an email and a strong password, and tick
   **Auto Confirm User**.
3. Open http://localhost:5173/admin/login and sign in with that email and
   password.

> There is no public sign-up — only accounts you create in the Supabase
> dashboard can access the admin panel, so no separate `admin_users` table is
> needed.

### 5. Build for production

```bash
npm run build
```

The finished site is in the `dist/` folder — deploy it to any static host
(Netlify, Vercel, Cloudflare Pages…). Remember to add the two environment
variables in your host's settings too. If your host supports it, enable
"SPA fallback" / rewrite all routes to `index.html` so `/admin` works on
refresh.

---

## 🧮 Business Formulas Used

| Value         | Formula                                  |
| ------------- | ---------------------------------------- |
| Sales Amount  | Qty Sold × Selling Price                 |
| Cost Amount   | Qty Sold × Net Rate                      |
| Profit        | Sales Amount − Cost Amount               |
| Closing Stock | Opening Stock + Stock Received − Sales   |

Cancelled orders are excluded from sales, cost and profit totals. Products
with a closing stock of **5 or fewer** are flagged as low stock.

---

## 📝 Everyday Tasks

- **Change a price** (e.g. Plain Putharekulu): Admin → Products → Edit →
  update Selling Price → Save.
- **Sold out of something?** Admin → Products → click the Available badge to
  toggle it off. Customers see "Currently Unavailable".
- **New order arrives:** it appears in Admin → Orders (and on your WhatsApp).
  Move its status from New → Confirmed → Preparing → Ready → Delivered as you
  go, and set the payment status once paid.
- **Update stock:** Admin → Inventory → edit Opening / Received / Sales →
  Save. Closing stock updates automatically.
- **Change phone number or tagline:** edit `src/lib/business.js`.
- **Add real product photos:** replace the emoji placeholder block at the top
  of `src/components/ProductCard.jsx` with an `<img>` tag.
